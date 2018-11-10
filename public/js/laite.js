$(function () {


    $("#hakulomake").submit(function (event) {
        event.preventDefault();

        var hakuehdot = $(this).serialize();
        haeVaraukset(hakuehdot);
    });

    $("#laitteet").click(function () {
        haeLaitteet();
        $("#laitedialogi").dialog("open");
    });

    $("lisaalaite").click(function () {
        $("#dialogi_lisays").dialog("open");
    });

    // Laite dialogi                //TEHTY
    $("#laitedialogi").dialog({
        autoOpen: false,
        height: 500,
        width: 800,
        buttons: [
            {
                text: "Takaisin",
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



    //Laitteen lisays dialogi       //TEHTY
    $("#dialogi_lisays").dialog({
        autoOpen: false,
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#sarjanro_lisays").val()) === "" ||
                        $.trim($("#kategoria_lisays").val()) === "" ||
                        $.trim($("#nimi_lisays").val()) === "" ||
                        $.trim($("#merkki_lisays").val()) === "" ||
                        $.trim($("#malli_lisays").val()) === "" ||
                        $.trim($("#omistaja_lisays").val()) === "" ||
                        $.trim($("#kuvaus_lisays").val()) === "" ||
                        $.trim($("#sijainti_lisays").val()) === "") {
                        alert('Anna arvo kaikki kenttiin!');
                        return false;
                    } else {
                        var lisattyData = $("#lisayslomake").serialize();
                        lis‰‰Laite(lisattyData);
                        $(this).dialog("close");

                        $("#lisayslomake")[0].reset();
                    }
                },
            },
            {
                text: "Peruuta",
                click: function () {
                    $("#lisayslomake")[0].reset();
                    $(this).dialog("close");
                },
            }
        ],
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false
    });



    //Laitteen muutos dialogi               --TEHTY
    $("#dialogi_muutos").dialog({
        autoOpen: false,
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#sarjanro_muutos").val()) === "" ||
                        $.trim($("#kategoria_muutos").val()) === "" ||
                        $.trim($("#nimi_muutos").val()) === "" ||
                        $.trim($("#merkki_muutos").val()) === "" ||
                        $.trim($("#malli_muutos").val()) === "" ||
                        $.trim($("#omistaja_muutos").val()) === "" ||
                        $.trim($("#kuvaus_muutos").val()) === "" ||
                        $.trim($("#sijainti_muutos").val()) === "") {
                        alert('Anna arvo kaikki kenttiin!');
                        return false;
                    } else {
                        var muutettuData = $("#muutoslomake").serialize();
                        muutaLaite(muutettuData, $("#sarjanro_muutos").val());
                        $(this).dialog("close");
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

    //Varaushistoria diaogi                 TEE
    $("#dialogi_varaushistoria").dialog({
        autoOpen: false,
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#alkupvm").val()) === "" ||
                        $.trim($("#loppupvm").val()) === "") {
                        alert('Anna arvo kaikki kenttiin!');
                        return false;
                    }
                                   /* else if (      //Pit‰‰ tehd‰ logiikka tarkistaa meneekˆ varauspvm edelt‰vien p‰‰lle

                                        ) {
                                        alert('Varaus menee muiden varasuten p‰‰lle!');
                                        return false;
                                    } */else {
                        var lisattyVarausData = $("#uusivaraus").serialize();
                        lisaaVaraus(lisattyVarausData);
                        $(this).dialog("close");
                    }
                },
            },
            {
                text: "Takaisin",
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

function haeLaitteet(hakuehdot) {                   //TEHTY
    $.get(
        "http://localhost:3001/laite/",
        hakuehdot   // Hakuehdot muodossa nimi=kalle&osoite=teku
    ).done(function (data, textStatus, jqXHR) {
        $("#laitetaulu").empty(); //Poistetaan vanhat arvot taulukosta

        if (data.length == 0) {
            alert("Antamillasi hakuehdoilla ei lˆytynyt varauksia!");
        } else {
            data.forEach(function (laite) {
                $("#laitetaulu").append(
                    "<tr>" +
                    "<td>" + laite.sarjanro + "</td>" +
                    "<td>" + laite.kategoria + "</td>" +
                    "<td>" + laite.nimi + "</td>" +
                    "<td>" + laite.merkki + "</td>" +
                    "<td>" + laite.malli + "</td>" +
                    "<td>" + laite.omistaja + "</td>" +
                    "<td>" + laite.kuvaus + "</td>" +
                    "<td>" + laite.sijainti + "</td>" +
                    "<td><button onclick=\"varaushistoria(" + laite.sarjanro + ")\">Varaushistoria</button></td>" +
                    "</tr>"
                );
            });
        } /*else //tee t‰m‰ hakuehto kuntoon, ja katso viel‰ Adminin varausmuutos kuntoon
                            {
                                data.forEach(function (laite) {
                                    $("#laitetaulu").append(
                                        "<tr>" +
                                        "<td>" + laite.sarjanro + "</td>" +
                                        "<td>" + laite.kategoria + "</td>" +
                                        "<td>" + laite.nimi + "</td>" +
                                        "<td>" + laite.merkki + "</td>" +
                                        "<td>" + laite.malli + "</td>" +
                                        "<td>" + laite.omistaja + "</td>" +
                                        "<td>" + laite.kuvaus + "</td>" +
                                        "<td>" + laite.sijainti + "</td>" +
                                        "<td><button onclick=\"varaushistoria(" + laite.sarjanro + ")\">Varaushistoria</button></td>" +
                                        "<td><button onclick=\"poistaLaite(" + laite.sarjanro + ")\">Poista laite</button></td>" +
                                        "<td><button onclick=\"avaaMuutosLomake(" + laite.sarjanro + ")\">Muuta laite</button></td>" +
                                        "</tr>"
                                    );
                                });
                            }
                            */
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function varaushistoria(sarjanro) {
    $.get(
        "http://localhost:3001/varaus/", sarjanro
    ).done(function (data, textStatus, jqXHR) {
        $("#varaushistoriataulu").empty(); //Poistetaan vanhat arvot taulukosta

        data.forEach(function (varaus) {
            $("#varaushistoriataulu").append(
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

        $("#laite_id").val(sarjanro);
        $("#status").val(data.status);
        $("#kayttaja_id").val();  // HAE sis‰‰nkirjautuneen k‰ytt‰j‰n id

        $("#dialogi_varaushistoria").dialog("open");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}
function lisaaVaraus(lisattyVarausData) {
    $.post(
        "http://localhost:3001/varaus/lisaa/",
        lisattyVarausData
    ).done(function (data, textStatus, jqXHR) {
        $("#hakulomake").submit();              //onko tarpeellinen
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}







function lisaaLaite(lisattyData) {
    $.post(
        "http://localhost:3001/laite/lisaa/",
        lisattyData
    ).done(function (data, textStatus, jqXHR) {
        $("#hakulomake").submit();
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function poistaLaite(sarjanro) {            //Tarkista onko varauksia ja poisto jos ei
    $.ajax(
        {
            url: "http://localhost:3001/laite/poista/" + sarjanro,
            method: 'delete'
        }).done(function (data, textStatus, jqXHR) {
            // Haetaan data uudelleen
            $("#hakulomake").submit();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Suoriteaan, jos kutsu ep‰onnistuu
            console.log("Kutsu ep‰onnistui: " + errorThrown);
        });
}





function muutaLaite(data, sarjanro) {
    $.ajax(
        {
            url: "http://localhost:3001/laite/muuta/" + sarjanro,
            method: 'put',
            data: data
        }).done(function (data, textStatus, jqXHR) {
            // Haetaan data uudelleen
            $("#hakulomake").submit();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Suoriteaan, jos kutsu ep‰onnistuu
            console.log("Kutsu ep‰onnistui: " + errorThrown);
        });
}

function avaaMuutosLomake(sarjanro) {          //TEHTY
    $.get(
        "http://localhost:3001/laite/muuta/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {
        $("#sarjanro_muutos").val(data.sarjanro);
        $("#kategoria_muutos").val(data.kategoria);
        $("#nimi_muutos").val(data.nimi);
        $("#merkki_muutos").val(data.merkki);
        $("#malli_muutos").val(data.malli);
        $("#omistaja_muutos").val(data.omistaja);
        $("#kuvaus_muutos").val(data.kuvaus);
        $("#sijainti_muutos").val(data.sijainti);

        $("#dialogi_muutos").dialog("open");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}