$(function () {
    let adminkayttaja = false;


    $("#hakulomake").submit(function (event) {
        event.preventDefault();

        var hakuehdot = $(this).serialize();
        haeLaitteet(hakuehdot);
    });

    $("#laitteet").click(function () {
        $("#laitedialogi").dialog("open");
    });

    // Laite dialogi                //TEHTY
    $("#laitedialogi").dialog({
        autoOpen: false,
        height: 500,
        width: 1330,
        buttons: [

            {
                text: "Lisää",
                click: function () {
                    $("#dialogi_lisays").dialog("open");
                    $("#hakulomake")[0].reset();
                },
            },
            {
                text: "Takaisin",
                click: function () {
                    $(this).dialog("close");
                    $("#hakulomake")[0].reset();
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
                        lisaaLaite(lisattyData);
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



    //Laitteen muutos dialogi               //TEHTY
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
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#alkupvm").val()) === "" ||
                        $.trim($("#loppupvm").val()) === "") {
                        $('#muutosError2').html('<p>Anna arvo kaikki kenttiin!</p>');
                        return false;
                    }
                                   /* else if (      //Pitää tehdä logiikka tarkistaa meneekö varauspvm edeltävien päälle

                                        ) {
                                        $('#muutosError2').html('<p>Varaus menee vanhan varauksen päälle!</p>');
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
    });
});


function haeLaitteet(hakuehdot) {                   //TEHTY
    $.get(
        "http://localhost:3000/laite", hakuehdot   
    ).done(function (data, textStatus, jqXHR) {
        $("#laitetaulu").empty(); 

        if (data.length == 0) {
            alert("Antamillasi hakuehdoilla ei löytynyt laitteita!");
        } else if (adminkayttaja=false) {
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
                        "<td><button onclick=\"haeVaratutpaivat(" + laite.sarjanro + ")\">Varatutpäivät</button></td>" +
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
                    "<td><button onclick=\"haeVaratutpaivat(" + laite.sarjanro + ")\">Varatutpäivät</button></td>" +
                    "</tr>"
                );
            });
        }
        
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function haeVaratutpaivat(sarjanro) {     //Tee
    $.get(
        "http://localhost:3000/laitteenvaraus/", sarjanro //tämä linkki pitää korjata
    ).done(function (data, textStatus, jqXHR) {

        data.forEach(function (laite) {
            $("#varaushistoriataulu").append(
                "<tr>" +
                "<td>" + laite.id + "</td>" +
                "<td>" + laite.laite_id + "</td>" +
                "<td>" + laite.alkupvm + "</td>" +
                "<td>" + laite.loppupvm + "</td>" +
                "<td>" + laite.status + "</td>" +
                "<td>" + laite.kayttaja_id + "</td>" +
                "</tr>"
            );
        });


        $("#laite_id").val(sarjanro);

        $("#dialogi_varaushistoria").dialog("open");
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}
function lisaaVaraus(lisattyVarausData) {      
    $.post(
        "http://localhost:3000/laitteenvaraus",  
        lisattyVarausData
    ).done(function (data, textStatus, jqXHR) {
        $("#hakulomake").submit();              // korjaa päivittämään haevaratutpäivät taulu  
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
