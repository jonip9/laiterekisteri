$(function () {

    $("#hakulomake").submit(function (event) {
        event.preventDefault();

        var hakuehdot = $(this).serialize();
        haeVaraukset(hakuehdot);
    });

    $("#muutatietoja").click(function () {
        avaaKayttajaMuutos();
        $("#dialogi_kayttajanmuutos").dialog("open");
    });

    $("#kirjauduulos").click(function () {
        var element = document.getElementById("sisalto");
        element.classList.add("hidden");
    });

    $("#dialogi_kayttajamuutos").dialog({           //TEHTY
        autoOpen: false,
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#tunnus_muutos").val()) === "" ||
                        $.trim($("#salasana_muutos").val()) === "" ||
                        $.trim($("#salasana2_muutos").val()) === "" ||
                        $.trim($("#nimi_muutos").val()) === "" ||
                        $.trim($("#sposti_muutos").val()) === "" ||
                        $.trim($("#malli_muutos").val()) === "") {
                        alert('Anna arvo kaikki kenttiin!');
                        return false;
                    } else if (
                        $.trim($("#salasana_muutos").val()) != $.trim($("#salasana2_muutos").val())) {
                        alert('Antamasi salasanat eivät täsmää!');
                        return false;
                    } else {
                        var muutettukayttajaData = $("#kayttajanmuutoslomake").serialize();
                        muutaKayttajatiedot(muutettukayttajaData, $("#id_muutos").val());
                        $(this).dialog("close");

                        $("#kayttajanmuutoslomake")[0].reset();
                    }
                },
            },
            {
                text: "Peruuta",
                click: function () {
                    $(this).dialog("close");
                },
            }
        ],
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false
    });
});

function haeVaraukset(kayttaja_id) {  //Tee: hakee käyttäjän varaukset/ lainat (käyttäjäid->status), Admin osio
    $.get(
        "http://localhost:3001/varaus/", kayttaja_id
    ).done(function (data, textStatus, jqXHR) {
        $("#varauksettaulu").empty(); //Poistetaan vanhat arvot taulukosta

        if (data.length == 0) {
            alert("Antamillasi hakuehdoilla ei löytynyt varauksia!");
        } else {
            data.forEach(function (varaus) {
                $("#varauksettaulu").append(
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
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}
// Lainojen haku
function haeLainat(kayttaja_id) {  //Tee: hakee käyttäjän varaukset/ lainat (käyttäjäid->status), Admin osio
    $.get(
        "http://localhost:3001/laina/", kayttaja_id
    ).done(function (data, textStatus, jqXHR) {
        $("#lainattaulu").empty(); //Poistetaan vanhat arvot taulukosta

        if (data.length == 0) {
            alert("Antamillasi hakuehdoilla ei löytynyt lainoja!");
        } else {
            data.forEach(function (varaus) {
                $("#varauksettaulu").append(
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
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function muutaKayttajatiedot(data, id) {
    $.ajax(
        {
            url: "http://localhost:3001/kayttaja/muuta/" + sarjanro,
            method: 'put',
            data: data
        }).done(function (data, textStatus, jqXHR) {
            // Haetaan data uudelleen
            $("#hakulomake").submit();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Suoriteaan, jos kutsu epäonnistuu
            console.log("Kutsu epäonnistui: " + errorThrown);
        });
}

function avaaKayttajaMuutos(sarjanro) {          //TEHTY
    $.get(
        "http://localhost:3001/kayttaja/muuta/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {
        $("#id_muutos").val(data.id);
        $("#tunnus_muutos").val(data.tunnus);
        $("#salasana_muutos").val(data.salasana);
        $("#salasana2_muutos").val(data.salasana);
        $("#nimi_muutos").val(data.nimi);
        $("#sposti_muutos").val(data.sposti);

        $("#dialogi_kayttajamuutos").dialog("open");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}
