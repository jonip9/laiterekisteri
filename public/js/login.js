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
                    if ($.trim($("#reg_tunnus").val()) === "" || 
                        $.trim($("#reg_ss").val()) === "" || 
                        $.trim($("#reg_nimi").val()) === "" ||) {
                        alert('Anna arvo kaikkiin kenttiin!');
                        return false;
                    } else if (
                        $.trim($("#reg_ss").val()) != $.trim($("#reg_ss2").val())) {
                        alert('Antamasi salasanat eivät täsmää!');
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
   
    function regKayttaja(reglauseke) {  //Tarkista onko tunnus uusi
        $.post(
            "http://localhost:3000/kayttaja",
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
                "http://localhost:3000/login",
                "tunnus=" + tunnus + "&salasana=" + ss   // Hakuehdot muodossa nimi=kalle&osoite=teku
            ).done(function (data, textStatus, jqXHR) {
                $("#asiakkaat").empty(); //Poistetaan vanhat arvot taulukosta

                if (data.length == 0) {
                    alert("Tunnus tai salasana väärin!");
                } else {
                    $("#sisalto").removeClass("hidden");
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("status=" + textStatus + ", " + errorThrown);
            });
        }
    });
});
