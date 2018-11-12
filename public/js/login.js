$(function () {
    tunnus = $("#tunnus"),
    salasana = $("#ss")    
    var adminkayttaja = false;  

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
   
    function regKayttaja(reglauseke) {       
        function onkoadmin() {          
            $.get(
                "http://localhost:3000/kayttaja", tunnus 
            ).done(function (data, textStatus, jqXHR) {
                if( data.lenght == 0) {      
                    $.post(
                        "http://localhost:3000/kayttaja",
                        reglauseke
                    ).done(function (data, textStatus, jqXHR) {
                        $("#hakulomake").submit();
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log("status=" + textStatus + ", " + errorThrown);
                    });
                } else {
                    alert("Anatamasi tunnus on jo käytössä!") 
                }       
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("status=" + textStatus + ", " + errorThrown);
         });
}
        
        
        

    }


    $("#kirjaudu").click(function () {  //Täällä pitää tarkistaa done kohdassa, meneekö kaikki oikein --pitäisi olla
        function login() {
            $.post(
                "http://localhost:3000/login",
                "tunnus=" + tunnus + "&salasana=" + ss   
            ).done(function (data, textStatus, jqXHR) {

                if (data.length == 0) {
                    alert("Tunnus tai salasana väärin!");
                } else {
                    onkoadmin();
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("status=" + textStatus + ", " + errorThrown);
            });
        }
    });
});

function onkoadmin() {          
    $.get(
        "http://localhost:3000/kayttaja", tunnus 
    ).done(function (data, textStatus, jqXHR) {
        if( data.id == 99)
            adminkayttaja = true;
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.log("status=" + textStatus + ", " + errorThrown);
    });
}
