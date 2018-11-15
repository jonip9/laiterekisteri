/* eslint-disable func-names */
$(() => {
  let dialogMuuta;
  let formMuuta;

  function haeVaraukset(kayttaja_id) { // Tee: hakee käyttäjän varaukset/ lainat (käyttäjäid->status), (Admin osio?: Tehdäänkö adminille mahdollisuus hakea varauksia)
    $.get(
      "http://localhost:3000/varaus/", kayttaja_id,
    ).done((data, textStatus, jqXHR) => {
      $("#varauksettaulu").empty(); // Poistetaan vanhat arvot taulukosta

      if (data.length === 0) {
        alert("Antamillasi hakuehdoilla ei löytynyt varauksia!");
      } else {
        data.forEach(function (varaus) {
          $("#varauksettaulu").append(
            "<tr>"
            + "<td>" + varaus.id + "</td>"
            + "<td>" + varaus.laite_id + "</td>"
            + "<td>" + varaus.alkupvm + "</td>"
            + "<td>" + varaus.loppupvm + "</td>"
            + "<td>" + varaus.status + "</td>"
            + "<td>" + varaus.kayttaja_id + "</td>"
            + "</tr>"
          );
        });
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log("status=" + textStatus + ", " + errorThrown);
    });
  }
  function haeLainat(kayttaja_id) { // Tee: hakee käyttäjän varaukset/ lainat (käyttäjäid->status), (Admin osio: sama kuin ylemäpänä)
    $.get(
      "http://localhost:3000/laina/", kayttaja_id,
    ).done(function (data, textStatus, jqXHR) {
      $("#lainattaulu").empty(); // Poistetaan vanhat arvot taulukosta

      if (data.length === 0) {
        alert("Antamillasi hakuehdoilla ei löytynyt lainoja!");
      } else {
        data.forEach(function (varaus) {
          $("#varauksettaulu").append(
            "<tr>"
            + "<td>" + varaus.id + "</td>"
            + "<td>" + varaus.laite_id + "</td>"
            + "<td>" + varaus.alkupvm + "</td>"
            + "<td>" + varaus.loppupvm + "</td>"
            + "<td>" + varaus.status + "</td>"
            + "<td>" + varaus.kayttaja_id + "</td>"
            + "</tr>"
          );
        });
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log("status=" + textStatus + ", " + errorThrown);
    });
  }

  function muutaKayttajatiedot() {
    const muutettukayttajaData = $("#kayttajanmuutoslomake").serialize();

    $.ajax({
      url: "http://localhost:3000/kayttaja/" + $("#id_muutos").val(),
      method: 'put',
      data: muutettukayttajaData,
    }).done((data2, textStatus, jqXHR) => {
      // Haetaan data uudelleen
      // $("#hakulomake").submit();
    }).fail((jqXHR, textStatus, errorThrown) => {
      // Suoriteaan, jos kutsu epäonnistuu
      console.log("Kutsu epäonnistui: " + errorThrown);
    });
  }

  function avaaKayttajaMuutos() {
    $.get(
      "http://localhost:3000/kayttaja",
    ).done((data, textStatus, jqXHR) => {
      console.log(data[0]);
      $("#id_muutos").val(data[0].id);
      $("#tunnus_muutos").val(data[0].tunnus);
      $("#nimi_muutos").val(data[0].nimi);

      // $("#dialogi_kayttajamuutos").dialog("open");
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log("status=" + textStatus + ", " + errorThrown);
    });
  }

  $("#hakulomake").submit(function (event) {
    event.preventDefault();

    let hakuehdot = $(this).serialize();
    haeVaraukset(hakuehdot);
  });

  $("#kirjauduulos").click(function () {
    var element = document.getElementById("sisalto");
    element.classList.add("hidden");
  });

  dialogMuuta = $("#dialogi_kayttajamuutos").dialog({
    autoOpen: false,
    closeOnEscape: false,
    draggable: false,
    modal: true,
    resizable: false,
    open: avaaKayttajaMuutos(),
    buttons: [
      {
        text: "Tallenna",
        click: function () {
          if ($.trim($("#tunnus_muutos").val()) === ""
            || $.trim($("#salasana_muutos").val()) === ""
            || $.trim($("#salasana2_muutos").val()) === ""
            || $.trim($("#nimi_muutos").val()) === "") {
            alert('Anna arvo kaikki kenttiin!');
            return false;
          } else if ($.trim($("#salasana_muutos").val()) !== $.trim($("#salasana2_muutos").val())) {
            alert('Antamasi salasanat eivät täsmää!');
            return false;
          } else {
            // let muutettukayttajaData = $("#kayttajanmuutoslomake").serialize();
            muutaKayttajatiedot();
            formMuuta[0].reset();
            dialogMuuta.dialog("close");
          }
        },
      },
      {
        text: "Peruuta",
        click: function () {
          dialogMuuta.dialog("close");
        },
      },
    ],
  });

  $("#muutaTietoja").click(function () {
    dialogMuuta.dialog("open");
  });

  formMuuta = dialogMuuta.find("form").on("submit", (event) => {
    event.preventDefault();
    muutaKayttajatiedot();
  });
});
