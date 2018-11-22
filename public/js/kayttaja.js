$(() => {
    let formMuuta;
    window.onload = haeKayttajanVaraukset();
    window.onload = haeKayttajanLainat();

    function muutaKayttajatiedot() {
        const muutettukayttajaData = $('#kayttajanmuutoslomake').serialize();

        $.ajax({
            url: 'http://localhost:3000/kayttaja/' + $('#usrID').val(),
            method: 'put',
            data: muutettukayttajaData,
        });
    }

    function haeKayttajatiedot() {
        $.get('http://localhost:3000/kayttaja',
            (data, textStatus, jqXHR) => {
                $('#usrID').val(data[0].id);
                $('#usrTunnus').val(data[0].tunnus);
                $('#usrNimi').val(data[0].nimi);
            });
    }

    $('#kirjauduulos').click(function () {
        location.href = "http://localhost:3000";
    });

    const dialogMuuta = $('#dialogi_kayttajamuutos').dialog({
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        open: haeKayttajatiedot,
        close: () => {
            $('#muutosError').html('');
            formMuuta[0].reset();
        },
        buttons: [
            {
                text: 'Tallenna',
                click: () => {
                    if ($.trim($('#usrTunnus').val()) === ''
                        || $.trim($('#usrSalasana').val()) === ''
                        || $.trim($('#usrSalasana2').val()) === ''
                        || $.trim($('#usrNimi').val()) === '') {
                        $('#muutosError').html('<p>Anna arvo kaikki kenttiin!</p>');
                        return false;
                    }
                    if ($.trim($('#usrSalasana').val()) !== $.trim($('#usrSalasana2').val())) {
                        $('#muutosError').html('<p>Antamasi salasanat eivät täsmää!</p>');
                        return false;
                    }
                    muutaKayttajatiedot();
                    dialogMuuta.dialog('close');
                },
            },
            {
                text: 'Peruuta',
                click: () => {
                    dialogMuuta.dialog('close');
                },
            },
        ],
    });

    $('#muutaTietoja').click(() => {
        dialogMuuta.dialog('open');
    });

    formMuuta = dialogMuuta.find('form').on('submit', (event) => {
        event.preventDefault();
    });
});

function haeKayttajanVaraukset() { 
    $.get(
        'http://localhost:3000/varaus',
    ).done((data, textStatus, jqXHR) => {
        $('#varauksettaulu').empty();

        data.forEach(function (varaus) {
            $('#varauksettaulu').append(
                "<tr id=varaus" + varaus.id + ">"
                + '<td>' + varaus.id + '</td>'
                + '<td>' + varaus.laite_id + '</td>'
                + '<td>' + varaus.alkupvm + '</td>'
                + '<td>' + varaus.loppupvm + '</td>'
                + '<td>' + varaus.status + '</td>'
                + '<td>' + varaus.kayttaja_id + '</td>'
                + "<td><button onclick=\"poistaVaraus(" + varaus.id + "); return false;\">Poista varaus</button></td>");
            if ($("#isAdmin").val() === "true") {
                $("#varaus" + varaus.id).append(
                  "<td><button onclick=\"muutaLainatuksi(" + varaus.id + ")\">Muuta lainatuksi</button></td>"
                );
            }           
        });

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log('status=' + textStatus + ', ' + errorThrown);
    });
}

function muutaLainatuksi(id) {
    $.ajax({
        url: 'http://localhost:3000/laitteenvaraus/' + id,
        method: 'put'
    }).done(function (data, textStatus, jqXHR) {
        haeKayttajanVaraukset();
        haeKayttajanLainat();
    });
}

function haeKayttajanLainat() { 
    $.get(
        'http://localhost:3000/laina',
    ).done(function (data, textStatus, jqXHR) {
        $('#lainattaulu').empty();

        data.forEach(function (varaus) {
            $('#varauksettaulu').append(
                "<tr id=lainaus" + varaus.id + ">"
                + '<td>' + varaus.id + '</td>'
                + '<td>' + varaus.laite_id + '</td>'
                + '<td>' + varaus.alkupvm + '</td>'
                + '<td>' + varaus.loppupvm + '</td>'
                + '<td>' + varaus.status + '</td>'
                + '<td>' + varaus.kayttaja_id + '</td>');
            if ($("#isAdmin").val() === "true") {
                $("#lainaus" + varaus.id).append(
                    "<td><button onclick=\"muutaVaratuksi(" + varaus.id + ")\">Muuta varatuksi</button></td>" +
                    "<td><button onclick=\"muutaPalautetuksi(" + varaus.id + ")\">Muuta palautetuksi</button></td>"
                );
            }
        });

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log('status=' + textStatus + ', ' + errorThrown);
    });
}

    function muutaVaratuksi(id) {
        $.ajax({
            url: 'http://localhost:3000/laitteenvaraus/' + id,
            method: 'put',
        }).done(function (data, textStatus, jqXHR) {
            haeKayttajanVaraukset();
            haeKayttajanLainat();
        });
    }
     
    function muutaPalautetuksi(id) {
        $.ajax({
            url: 'http://localhost:3000/laitteenvaraus/' + id,
            method: 'put',
        }).done(function (data, textStatus, jqXHR) {
            haeKayttajanVaraukset();
            haeKayttajanLainat();
        });
    }
    
function poistaVaraus(id) {
    $.ajax(
        {
            url: "http://localhost:3000/varaus", id,
            method: 'delete',
        }).done(function (data, textStatus, jqXHR) {
            haeKayttajanVaraukset();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("Kutsu epäonnistui: " + errorThrown);
        });
}
