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

        document.getElementById("alkupvm").value = today;
        document.getElementById("loppupvm").value = today;
        document.getElementById("kloaika1").value = displayTime;
        document.getElementById("kloaika2").value = displayTime;
    }
    window.onload = date();

    $("#hakulomake").submit(function (event) {
        event.preventDefault();

        var hakuehdot = $(this).serialize();
        haeLaitteet(hakuehdot);
    });

    $("#laitteet").click(function () {
        haeLaitteet();
        $("#laitedialogi").dialog("open");
    });


    // Laite dialogi                //TEHTY
    $("#laitedialogi").dialog({
        autoOpen: false,
        height: 500,
        width: 1500,
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
                        muutaLaite();
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

                    else if (tarkistapaallekkaisyydet($("#laite_id").val()) != false)      
                         {
                         $('#muutosError2').html('<p>Varaus menee muiden varausten päälle!!</p>');
                         return false;
                           
                    } else {
                        var lisattyVarausData = "laite_id=" + $("#laite_id").val() +
                            "&alkupvm=" + $("#alkupvm").val() + " " + $("#kloaika1").val() +
                            "&loppupvm=" + $("#loppupvm").val() + " " + $("#kloaika2").val() +
                            "&status=Varattu";
                        lisaaVaraus(lisattyVarausData, $("#laite_id").val());
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

function haeLaitteet(hakuehdot) {                   //TEHTY
    $.get(
        "http://localhost:3000/laite", hakuehdot
    ).done(function (data, textStatus, jqXHR) {
        $("#laitetaulu").empty();

        if (data.length == 0) 
            alert("Antamillasi hakuehdoilla ei löytynyt laitteita!"); 
        
        data.forEach(function (laite) {
            $("#laitetaulu").append(
                "<tr id=laite" + laite.sarjanro +  ">" +
                "<td>" + laite.sarjanro + "</td>" +
                "<td>" + laite.kategoria + "</td>" +
                "<td>" + laite.nimi + "</td>" +
                "<td>" + laite.merkki + "</td>" +
                "<td>" + laite.malli + "</td>" +
                "<td>" + laite.omistaja + "</td>" +
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
        "http://localhost:3000/laitteenvaraus/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {

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

        $("#dialogi_varaushistoria").dialog("open");

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function lisaaVaraus(lisattyVarausData, laite_id) {
    $.post(
        "http://localhost:3000/laitteenvaraus",
        lisattyVarausData
    ).done(function (data, textStatus, jqXHR) {
        $("#varaushistoriataulu").empty();
        haeVaratutpaivat(laite_id);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}

function tarkistapaallekkaisyydet(sarjanro) {
    $.get(
        "http://localhost:3000/laitteenvaraus/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {

        data.forEach(function (pvm) {
            let alku = pvm.alkupvm;
            let loppu = pvm.loppupvm;
            if (loppu >= $("#alkupvm").val() && alku <= $("#loppupvm").val()) 
                return true;
            });
                return false;

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
    $.get(
        "http://localhost:3000/laitteenvaraus/" + sarjanro
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
    const muutettuData = $("#muutoslomake").serialize();

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
            $("#sarjanro_muutos").val(sarjanro);
            $("#kategoria_muutos").val(data[0].kategoria);
            $("#nimi_muutos").val(data[0].nimi);
            $("#merkki_muutos").val(data[0].merkki);
            $("#malli_muutos").val(data[0].malli);
            $("#omistaja_muutos").val(data[0].omistaja);
            $("#kuvaus_muutos").val(data[0].kuvaus);
            $("#sijainti_muutos").val(data[0].sijainti);

            $("#dialogi_muutos").dialog("open");
        });
}
