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
                + "<td><button onclick=\"muutaVarausta(" + varaus.laite_id + "," + varaus.id + "); return false;\">Muuta varaus</button></td>"
                + "<td><button onclick=\"poistaVaraus(" + varaus.id + "); return false;\">Poista varaus</button></td>");
            if ($("#isAdmin").val() === "true") {
                $("#varaus" + varaus.id).append(
                  "<td><button onclick=\"muutaLainatuksi(" + varaus.id + ", " + varaus.status + ")\">Muuta lainatuksi</button></td>"
                );
            }           
        });

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log('status=' + textStatus + ', ' + errorThrown);
    });
}

function muutaVarausta(sarjanro, id) {
    $.get(
        "http://localhost:3000/laiteenvaraus/" + id,
        (data, textStatus, jqXHR) => {
            var alku = data[0].alkupvm;
            var pvm1 = alku.substring(0, 10);
            var aika1 = alku.substring(11, 16);
            var loppu = data[0].loppupvm;
            var pvm2 = loppu.substring(0, 10);
            var aika2 = loppu.substring(11, 16);
            $("#alkupvm").val(pvm1);
            $("#kloaika1").val(aika1);
            $("#loppupvm").val(pvm2);
            $("#klokaika2").val(aika2);
        });
    document.getElementById('pvarausdialog').innerHTML = "Anna varauksen uudet päivät";
    haeVaratutpaivat(sarjanro);
}

function muutaLainatuksi(id, status) {
    $.ajax({
        url: 'http://localhost:3000/laitteenvaraukset/' + id, 
        method: 'put',
        data: { status: status }
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
                    "<td><button onclick=\"muutaVaratuksi(" + varaus.id + ", " + varaus.status +")\">Muuta varatuksi</button></td>" +
                    "<td><button onclick=\"muutaPalautetuksi(" + varaus.id + ", " + varaus.status + "1" + ")\">Muuta palautetuksi</button></td>"
                );
            }
        });

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log('status=' + textStatus + ', ' + errorThrown);
    });
}

    function muutaVaratuksi(id, status) {
        $.ajax({
            url: 'http://localhost:3000/laitteenvaraukset/' + id, status,
            method: 'put',
        }).done(function (data, textStatus, jqXHR) {
            haeKayttajanVaraukset();
            haeKayttajanLainat();
        });
    }
     
    function muutaPalautetuksi(id, status) {
        $.ajax({
            url: 'http://localhost:3000/laitteenvaraukset/' + id, status,
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
