/* eslint-disable no-undef */
/* eslint-disable quotes */
$(() => {
  let tunnus = $("#tunnus").val();
  let salasana = $("#salasana").val();
  let adminkayttaja = false;
  let dialog;
  let form;

  function regKayttaja() {
    $.post(
      "http://localhost:3000/kayttaja",
      { tunnus: $("#reg_tunnus").val(), salasana: $("#reg_ss").val(), nimi: $("#reg_nimi").val() },
    ).done(() => {
      dialog.dialog("close");
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log("status=" + textStatus + ", " + errorThrown);
      alert('Käyttäjä on jo olemassa!');
    });
  }

  dialog = $("#dialogi_register").dialog({
    autoOpen: false,
    closeOnEscape: false,
    draggable: false,
    modal: true,
    resizable: false,
    buttons: [
      {
        text: "Lähetä",
        click: () => {
          if ($.trim($("#reg_tunnus").val()) === "" || $.trim($("#reg_ss").val()) === "" || $.trim($("#reg_nimi").val()) === "") {
            alert('Anna arvo kaikkiin kenttiin!');
            return false;
          }
          if (
            $.trim($("#reg_ss").val()) !== $.trim($("#reg_ss2").val())) {
            alert('Antamasi salasanat eivät täsmää!');
            return false;
          }
          regKayttaja();
        },
      },
      {
        text: "Peruuta",
        click: () => {
          dialog.dialog("close");
        },
      },
    ],
    close: () => {
      form[0].reset();
    },
  });

  form = dialog.find("form").on("submit", (event) => {
    event.preventDefault();
    regKayttaja();
  });

  $("#register").click(() => {
    dialog.dialog("open");
  });

  /* $("#kirjaudu").click(function () {  //Täällä pitää tarkistaa done kohdassa, meneekö kaikki oikein --pitäisi olla
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
  }); */
});

/* function onkoadmin() {
  $.get(
    "http://localhost:3000/kayttaja", tunnus
  ).done(function (data, textStatus, jqXHR) {
    if (data.id == 99)
      adminkayttaja = true;
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log("status=" + textStatus + ", " + errorThrown);
  });
} */
