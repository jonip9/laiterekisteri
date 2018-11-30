$(function () {
    function date() {
        var date = new Date();

        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hour = date.getHours(),
            min = date.getMinutes();

        month = (month < 10 ? "0" : "") + month;
        day = (day < 10 ? "0" : "") + day;
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;

        var today = year + "-" + month + "-" + day,
            displayTime = hour + ":" + min;

        $("#alkupvm").val(today);
        $("#loppupvm").val(today);
        $("#kloaika1").val(displayTime);
        $("#kloaika2").val(displayTime);
    }
    window.onload = date();

    $("#hakulomake").submit(function (event) {
        event.preventDefault();

        let hakuehdot = $(this).serialize();
        haeLaitteet(hakuehdot);
    });

    $("#laitteet").click(function () {
        let hakuehdot = $("#hakulomake").serialize();
        haeLaitteet(hakuehdot);
        $("#laitedialogi").dialog("open");
    });

    // Laite dialogi               
    $("#laitedialogi").dialog({
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        height: 500,
        width: 1500,
        create: () => {
            haeKategoriat();
            haeOmistajat();
        },
        close: () => {
            $('#poistoerror').html('');
        },
        buttons: [
            {
                text: "Takaisin",
                click: function () {
                    $(this).dialog("close");
                    $("#hakulomake")[0].reset();
                    haeKayttajanVaraukset();
                    haeKayttajanLainat();
                },
            }
        ],
    });

    //Lisätään "Lisää"-button jos #isAdmin = true
    if ($("#isAdmin").val() === "true") {
        $("#laitedialogi").dialog("option", "buttons",
            {
                "Lisää": function () {
                    $("#dialogi_lisays").dialog("open");
                    $("#hakulomake")[0].reset();
                },

                "Takaisin": function () {
                    $(this).dialog("close");
                    $("#hakulomake")[0].reset();
                    haeKayttajanVaraukset();
                    haeKayttajanLainat();
                },
            });
    }

    //Laitteen lisays dialogi       
    $("#dialogi_lisays").dialog({
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        close: () => {
            $('#poistoerror').html('');
            $("#sarjanro_muutos").val('');
            $("#lisayslomake")[0].reset();
        },
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#kategoria_lisays").val()) === "" ||
                        $.trim($("#nimi_lisays").val()) === "" ||
                        $.trim($("#merkki_lisays").val()) === "" ||
                        $.trim($("#malli_lisays").val()) === "" ||
                        $.trim($("#omistaja_lisays").val()) === "" ||
                        $.trim($("#kuvaus_lisays").val()) === "" ||
                        $.trim($("#sijainti_lisays").val()) === "") {
                        alert('Anna arvo kaikki kenttiin!');
                        return false;
                    }

                    if ($("#sarjanro_muutos").val() === '') {
                        lisaaLaite();
                    } else {
                        muutaLaite();
                    }
                    $(this).dialog("close");
                },
            },
            {
                text: "Peruuta",
                click: function () {
                    $(this).dialog("close");
                },
            }
        ],
    });

    //Varaushistoria diaogi   
    $("#dialogi_varaushistoria").dialog({
        width: 850,
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        close: () => {
            $('#muutosError2').html('');
        },
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#alkupvm").val()) === "" ||
                        $.trim($("#loppupvm").val()) === "") {
                        $('#muutosError2').html('<p>Anna arvo kaikkiin kenttiin!</p>');
                        return false;
                    }
                    else if ($("#alkupvm").val() > $("#loppupvm").val()) {
                        $('#muutosError2').html('<p>Alkupvm ei voi olla suurempi kuin loppupvm!!</p>');
                        return false;
                    } else {
                        tarkistapaallekkaisyydet($("#laite_id").val());
                    }
                },
            },
            {
                text: "Takaisin",
                click: function () {
                    $(this).dialog("close");
                    $("#varaushistoriataulu").empty();
                },
            }
        ],
    });
});

function haeLaitteet(hakuehdot) {
    $.get(
        "http://localhost:3000/laite", hakuehdot
    ).done(function (data, textStatus, jqXHR) {
        $("#laitetaulu").empty();

        if (data.length == 0)
            alert("Antamillasi hakuehdoilla ei löytynyt laitteita!");

        data.forEach(function (laite) {
            $("#laitetaulu").append(
                "<tr id=laite" + laite.sarjanro + ">" +
                "<td>" + laite.sarjanro + "</td>" +
                "<td>" + laite.katNimi + "</td>" +
                "<td>" + laite.nimi + "</td>" +
                "<td>" + laite.merkki + "</td>" +
                "<td>" + laite.malli + "</td>" +
                "<td>" + laite.omNimi + "</td>" +
                "<td>" + laite.kuvaus + "</td>" +
                "<td>" + laite.sijainti + "</td>");
            if ($("#isAdmin").val() === "true") {
                $("#laite" + laite.sarjanro).append(
                    "<td><button onclick=\"haeVaratutpaivat(" + laite.sarjanro + "); return false;\">Varatutpäivät</button></td>" +
                    "<td><button onclick=\"poistaLaite(" + laite.sarjanro + "); return false;\">Poista laite</button></td>" +
                    "<td><button onclick=\"avaaMuutosLomake(" + laite.sarjanro + "); return false;\">Muuta laite</button></td>"
                );
            } else {
                $("#laite" + laite.sarjanro).append(
                    "<td><button onclick=\"haeVaratutpaivat(" + laite.sarjanro + "); return false;\">Varatutpäivät</button></td>"
                );
            }
        });
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function haeVaratutpaivat(sarjanro) {
    $.get(
        "http://localhost:3000/laitteenvaraukset/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {

        data.forEach(function (varaus) {
            var parsittualkupvm = varaus.alkupvm.substring(0, 10) + " " + varaus.alkupvm.substring(11, 16);
            var parsittuloppupvm = varaus.loppupvm.substring(0, 10) + " " + varaus.loppupvm.substring(11, 16);
            $("#varaushistoriataulu").append(
                "<tr>" +
                "<td>" + varaus.id + "</td>" +
                "<td>" + varaus.laite_id + "</td>" +
                "<td>" + varaus.laite + "</td>" +
                "<td>" + varaus.merkki + "</td>" +
                "<td>" + varaus.malli + "</td>" +
                "<td>" + parsittualkupvm + "</td>" +
                "<td>" + parsittuloppupvm + "</td>" +
                "<td>" + varaus.status + "</td>" +
                "<td>" + varaus.kayttaja + "</td>" +
                "</tr>"
            );
        });
        document.getElementById('status').type = 'text';
        $("#laite_id").val(sarjanro);
        $("#dialogi_varaushistoria").dialog("open");

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function tarkistapaallekkaisyydet(sarjanro) {
    $.get(
        "http://localhost:3000/laitteenvaraukset/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {

        let paallekain = false;
        data.forEach(function (pvm) {
            let alkutietokanta = pvm.alkupvm;
            let lopputietokanta = pvm.loppupvm;
            let alkuinput = $("#alkupvm").val() + "T" + $("#kloaika1").val() + ":00.000Z";
            let loppuinput = $("#loppupvm").val() + "T" + $("#kloaika2").val() + ":00.000Z";

            if (lopputietokanta >= alkuinput && alkutietokanta <= loppuinput)
                paallekain = true;
        });

        if (paallekain) {
            $('#muutosError2').html('<p>Varaus menee muiden varausten päälle!!</p>');
        } else {
            $('#muutosError2').html('');
            var lisattyVarausData = "laite_id=" + $("#laite_id").val() +
                "&alkupvm=" + $("#alkupvm").val() + " " + $("#kloaika1").val() +
                "&loppupvm=" + $("#loppupvm").val() + " " + $("#kloaika2").val() +
                "&status=" + $("#status").val();

            $.post(
                "http://localhost:3000/laitteenvaraus",
                lisattyVarausData
            ).done(function (data, textStatus, jqXHR) {
                $("#varaushistoriataulu").empty();
                haeVaratutpaivat(sarjanro);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("status=" + textStatus + ", " + errorThrown);
            });
        }
    });
}

function lisaaLaite() {
    const lisattyData = $("#lisayslomake").serialize();

    $.post(
        "http://localhost:3000/laite",
        lisattyData
    ).done(function (data, textStatus, jqXHR) {
        $("#hakulomake").submit();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function poistaLaite(sarjanro) {
    $.get(
        "http://localhost:3000/laitteenvaraukset/" + sarjanro
    ).done((data, textStatus, jqXHR) => {

        if (data.length === 0) {
            $.ajax(
                {
                    url: "http://localhost:3000/laite/" + sarjanro,
                    method: 'delete'
                }).done(function (data, textStatus, jqXHR) {
                    $("#hakulomake").submit();
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.log("Kutsu epäonnistui: " + errorThrown);
                });
        } else {
            $('#poistoerror').html('<p>Laitteella on varauksia tai lainoja: ei voi poistaa!</p>');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function muutaLaite() {
    const muutettuData = $("#lisayslomake").serialize();
    console.log(muutettuData);

    $.ajax({
        url: "http://localhost:3000/laite/" + $("#sarjanro_muutos").val(),
        method: 'put',
        data: muutettuData,
    }).done(function (data, textStatus, jqXHR) {
        $("#hakulomake").submit();
    });
}

function avaaMuutosLomake(sarjanro) {
    $.get(
        "http://localhost:3000/laite/" + sarjanro,
        (data, textStatus, jqXHR) => {
            console.log(data[0]);
            $("#sarjanro_muutos").val(sarjanro);
            $("#kategoria_lisays").val(data[0].kategoria);
            $("#nimi_lisays").val(data[0].nimi);
            $("#merkki_lisays").val(data[0].merkki);
            $("#malli_lisays").val(data[0].malli);
            $("#omistaja_lisays").val(data[0].omistaja);
            $("#kuvaus_lisays").val(data[0].kuvaus);
            $("#sijainti_lisays").val(data[0].sijainti);

            $("#dialogi_lisays").dialog("open");
        });
}

function haeKategoriat() {
    $("#kategoria_lisays").empty();
    $.get("http://localhost:3000/kategoria", function (data, textStatus, jqXHR) {
        $.each(data, (i, e) => {
            $("#kategoria_lisays").append(new Option(e.nimi, e.id));
            $("#kategoria_haku").append(new Option(e.nimi, e.nimi));
        });
    });
}

function haeOmistajat() {
    $("#omistaja_lisays").empty();
    $.get("http://localhost:3000/omistaja", function (data, textStatus, jqXHR) {
        $.each(data, (i, e) => {
            $("#omistaja_lisays").append(new Option(e.nimi, e.id));
            $("#omistaja_haku").append(new Option(e.nimi, e.nimi));
        });
    });
}
