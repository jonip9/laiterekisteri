$(function () {

    $("#hakulomake").submit(function (event) {
        event.preventDefault();

        var hakuehdot = $(this).serialize();
        haeLaitteet(hakuehdot);
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
                    if ($.trim($("#kategoria_lisays").val()) === "" ||
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
                        lisääLaite(lisattyData);
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
                    if ($.trim($("#kategoria_muutos").val()) === "" ||
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
                                   /* else if (      //Pitää tehdä logiikka tarkistaa meneekö varauspvm edeltävien päälle

                                        ) {
                                        alert('Varaus menee muiden varasuten päälle!');
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
        "http://localhost:3000/laite"   
    ).done(function (data, textStatus, jqXHR) {
        $("#laitetaulu").empty(); 

        if (data.length == 0) {
            alert("Antamillasi hakuehdoilla ei löytynyt varauksia!");
        } else if (adminkayttaja) {
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
        } 
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function varaushistoria(sarjanro) {     //Tee: Mitä tietoja hakee katsottaessa varaushistoriaa ja miten koko uuden varauksen teko toimii
    $.get(
        "http://localhost:3000/varaus/", sarjanro //tämä linkki pitää korjata
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
        $("#kayttaja_id").val();  // HAE sisäänkirjautuneen käyttäjän id

        $("#dialogi_varaushistoria").dialog("open");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}
function lisaaVaraus(lisattyVarausData) {      //Tämän sisältö vielä pitää varmistaa kun varaaminen on tehty kuntoon
    $.post(
        "http://localhost:3000/varaus/lisaa/",  //Linkki oikeaksi
        lisattyVarausData
    ).done(function (data, textStatus, jqXHR) {
        $("#hakulomake").submit();              //onko tarpeellinen
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}







function lisaaLaite(lisattyData) {
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
    $.ajax(
        {
            url: "http://localhost:3000/laite/" + sarjanro,
            method: 'delete'
        }).done(function (data, textStatus, jqXHR) {
            // Haetaan data uudelleen
            $("#hakulomake").submit();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            // Suoriteaan, jos kutsu epäonnistuu
            console.log("Kutsu epäonnistui: " + errorThrown);
        });
}





function muutaLaite(data, sarjanro) {
    $.ajax(
        {
            url: "http://localhost:3000/laite/" + sarjanro,
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

function avaaMuutosLomake(sarjanro) {         
    $.get(
        "http://localhost:3000/laite/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {
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
