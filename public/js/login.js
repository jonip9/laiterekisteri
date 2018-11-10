$(function () {
    tunnus = $("#tunnus"),
        ss = $("#ss")

    $("#register").click(function () {
        $("#dialogi_register").dialog("open");
    });
    $("#dialogi_register").dialog({
        autoOpen: false,
        buttons: [
            {
                text: "Save",
                click: function () {
                    if ($.trim($("#reg_tunnus").val()) === "" || $.trim($("#reg_ss").val()) === "" || $.trim($("#reg_nimi").val()) === "" || $.trim($("#reg_email").val()) === "") {
                        alert('Anna arvo kaikkiin kenttiin!');
                        return false;
                    } else if (
                        $.trim($("#reg_ss").val()) != $.trim($("#reg_ss2").val())) {
                        alert('Antamasi salasanat eiv�t t�sm��!');
                        return false;
                    } else {
                        var reglauseke = $("#reglomake").serialize();
                        console.log("Reglauseke: " + reglauseke);
                        regKayttaja(reglauseke);
                        $("#reg_lomake")[0].reset();
                        $(this).dialog("close");
                    }
                },
            },
            {
                text: "Peruuta",
                click: function () {
                    $(this).dialog("close");
                    $("#reg_lomake")[0].reset();
                },
            }
        ],
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false
    });
    //tarkista onko tunnus uusi
    function regKayttaja(reglauseke) {
        $.post(
            "http://localhost:3001/kayttaja/lisaa/",
            reglauseke
        ).done(function (data, textStatus, jqXHR) {
            $("#hakulomake").submit();
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("status=" + textStatus + ", " + errorThrown);
        });
    }


    $("#kirjaudu").click(function () {
        function login() {
            $.get(
                "http://localhost:3001/kayttaja",
                "tunnus=" + tunnus + "&salasana=" + ss   // Hakuehdot muodossa nimi=kalle&osoite=teku
            ).done(function (data, textStatus, jqXHR) {
                $("#asiakkaat").empty(); //Poistetaan vanhat arvot taulukosta

                if (data.length == 0) {
                    alert("Tunnus tai salasana v��rin!");
                } else {
                    $("#sisalto").removeClass("hidden");
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("status=" + textStatus + ", " + errorThrown);
            });
        }
    });
    /* TARKISTA + MUOKAA T�M� JOS T�T� TARVITAAN!!!!
     *

     * function tulos() {
        $.get(
            "http://localhost:3001/kayttaja",
            hakuehdot   // Hakuehdot muodossa nimi=kalle&osoite=teku
        ).done(function (data, textStatus, jqXHR) {
            $("#asiakkaat").empty(); //Poistetaan vanhat arvot taulukosta

            if (data.length == 0) {
                alert("Antamillasi hakuehdoilla ei l�ytynyt asiakkaita!");
            } else {
                data.forEach(function (asiakas) {
                    $("#asiakkaat").append(
                        "<tr>" +
                        "<td>" + asiakas.Avain + "</td>" +
                        "<td>" + asiakas.Nimi + "</td>" +
                        "<td>" + asiakas.Osoite + "</td>" +
                        "<td>" + asiakas.Postinro + "</td>" +
                        "<td>" + asiakas.Postitmp + "</td>" +
                        "<td>" + asiakas.Luontipvm + "</td>" +
                        "<td>" + asiakas.Selite + "</td>" +
                        "<td><button onclick=\"poistaAsiakas(" + asiakas.Avain + ")\">Poista asiakas</button></td>" +
                        "<td><button onclick=\"avaaMuutosLomake(" + asiakas.Avain + ")\">Muuta asiakas</button></td>" +
                        "</tr>"
                    );
                });
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log("status=" + textStatus + ", " + errorThrown);
        });
    }*/

});
