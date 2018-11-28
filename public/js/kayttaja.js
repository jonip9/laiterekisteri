$(() => {
    let formMuuta;
    window.onload = haeKayttajanVaraukset();
    window.onload = haeKayttajanLainat();

    $("#dialogi_varaushistoria2").dialog({
        width: 850,
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        close: () => {
            $('#muutosError3').html('');
        },
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#alkupvm2").val()) === "" ||
                        $.trim($("#loppupvm2").val()) === "") {
                        $('#muutosError3').html('<p>Anna arvo kaikkiin kenttiin!</p>');
                        return false;
                    }
                    else if ($("#alkupvm2").val() > $("#loppupvm2").val()) {
                        $('#muutosError3').html('<p>Alkupvm ei voi olla suurempi kuin loppupvm!!</p>');
                        return false;
                    } else
                        tarkistapaallekkaisyydet2($("#laite_id2").val(), $("#varaus_id").val())
                },
            },
            {
                text: "Takaisin",
                click: function () {
                    $(this).dialog("close");
                    $("#varaushistoriataulu2").empty();
                },
            }
        ],
    });

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
                + "<td><button onclick=\"avaamuutaVarausta(" + varaus.laite_id + "," + varaus.id + "); return false;\">Muuta varaus</button></td>"
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

function avaamuutaVarausta(sarjanro, id) {
    $.get(
        "http://localhost:3000/laitteenvaraus/" + id,
        (data, textStatus, jqXHR) => {
            var alku = data[0].alkupvm,
                pvm1 = alku.substring(0, 10),
                aika1 = alku.substring(11, 16),
                loppu = data[0].loppupvm,
                pvm2 = loppu.substring(0, 10),
                aika2 = loppu.substring(11, 16);
            $("#alkupvm2").val(pvm1);
            $("#loppupvm2").val(pvm2);
            $("#kloaika11").val(aika1);
            $("#kloaika21").val(aika2);
            $("#varaus_id").val(id);
        });
        $.get(
            "http://localhost:3000/laitteenvaraukset/" + sarjanro
        ).done(function (data, textStatus, jqXHR) {

            data.forEach(function (varaus) {
                $("#varaushistoriataulu2").append(
                    "<tr>" +
                    "<td>" + varaus.id + "</td>" +
                    "<td>" + varaus.laite_id + "</td>" +
                    "<td>" + varaus.alkupvm + "</td>" +
                    "<td>" + varaus.loppupvm + "</td>" +
                    "<td>" + varaus.status + "</td>" +
                    "<td>" + varaus.kayttaja_id + "</td>" +
                    "</tr>"
                );
            });

            $("#laite_id2").val(sarjanro);
            $("#dialogi_varaushistoria2").dialog("open");

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("status=" + textStatus + ", " + errorThrown);
        }); 
}

function tarkistapaallekkaisyydet2(sarjanro, id) {
    $.get(
        "http://localhost:3000/laitteenvaraukset/" + sarjanro + "/" + id
    ).done(function (data, textStatus, jqXHR) {

        let paallekain2 = false;
        let alkuinput = $("#alkupvm2").val() + "T" + $("#kloaika11").val() + ":00.000Z";
        let loppuinput = $("#loppupvm2").val() + "T" + $("#kloaika21").val() + ":00.000Z";
        data.forEach(function (pvm) {
            let alkutietokanta = pvm.alkupvm;
            let lopputietokanta = pvm.loppupvm;

            if (lopputietokanta >= alkuinput && alkutietokanta <= loppuinput)
                paallekain2 = true;
        });
        add2hours($("#kloaika11").val(), $("#kloaika21").val(), $("#alkupvm2").val(), $("#loppupvm2").val());    //Aika lisättäessä serverille se vähentää asetetusta ajasta 2h, joten tämä korjaa sen

        if (paallekain2) {
            $('#muutosError3').html('<p>Varaus menee muiden varausten päälle!!</p>');
        } else {

            $('#muutosError3').html('');
            var muutettuVarausData = "alkupvm=" + $("#alkupvm2").val() + " " + $("#kloaika11").val() +
                "&loppupvm=" + $("#loppupvm2").val() + " " + $("#kloaika21").val();

            $.ajax({
                url: "http://localhost:3000/laitteenvaraus/" + $("#varaus_id").val(),
                method: 'put',
                data: muutettuVarausData,
            }).done(function (data, textStatus, jqXHR) {
                $("#varaushistoriataulu2").empty();
                avaamuutaVarausta($("#laite_id2").val(), $("#varaus_id").val());
            });
        }
    });
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
