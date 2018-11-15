$(() => {
  let formMuuta;

  function haeVaraukset(kayttaja_id) { // Tee: hakee käyttäjän varaukset/ lainat (käyttäjäid->status), (Admin osio?: Tehdäänkö adminille mahdollisuus hakea varauksia)
    $.get(
      'http://localhost:3000/varaus/', kayttaja_id,
    ).done((data, textStatus, jqXHR) => {
      $('#varauksettaulu').empty(); // Poistetaan vanhat arvot taulukosta

      if (data.length === 0) {
        alert('Antamillasi hakuehdoilla ei löytynyt varauksia!');
      } else {
        data.forEach(function (varaus) {
          $('#varauksettaulu').append(
            '<tr>'
            + '<td>' + varaus.id + '</td>'
            + '<td>' + varaus.laite_id + '</td>'
            + '<td>' + varaus.alkupvm + '</td>'
            + '<td>' + varaus.loppupvm + '</td>'
            + '<td>' + varaus.status + '</td>'
            + '<td>' + varaus.kayttaja_id + '</td>'
            + '</tr>'
          );
        });
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log('status=' + textStatus + ', ' + errorThrown);
    });
  }

  function haeLainat(kayttaja_id) { // Tee: hakee käyttäjän varaukset/ lainat (käyttäjäid->status), (Admin osio: sama kuin ylemäpänä)
    $.get(
      'http://localhost:3000/laina/', kayttaja_id,
    ).done(function (data, textStatus, jqXHR) {
      $('#lainattaulu').empty(); // Poistetaan vanhat arvot taulukosta

      if (data.length === 0) {
        alert('Antamillasi hakuehdoilla ei löytynyt lainoja!');
      } else {
        data.forEach(function (varaus) {
          $('#varauksettaulu').append(
            '<tr>'
            + '<td>' + varaus.id + '</td>'
            + '<td>' + varaus.laite_id + '</td>'
            + '<td>' + varaus.alkupvm + '</td>'
            + '<td>' + varaus.loppupvm + '</td>'
            + '<td>' + varaus.status + '</td>'
            + '<td>' + varaus.kayttaja_id + '</td>'
            + '</tr>'
          );
        });
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log('status=' + textStatus + ', ' + errorThrown);
    });
  }

  function muutaKayttajatiedot() {
    const muutettukayttajaData = $('#kayttajanmuutoslomake').serialize();

    $.ajax({
      url: 'http://localhost:3000/kayttaja/' + $('#usrID').val(),
      method: 'put',
      data: muutettukayttajaData,
    });
  }

  function haeKayttajatiedot() {
    $.get('http://localhost:3000/kayttaja',
      (data, textStatus, jqXHR) => {
        $('#usrID').val(data[0].id);
        $('#usrTunnus').val(data[0].tunnus);
        $('#usrNimi').val(data[0].nimi);
      });
  }

  $('#hakulomake').submit(function (event) {
    event.preventDefault();

    let hakuehdot = $(this).serialize();
    haeVaraukset(hakuehdot);
  });

  $('#kirjauduulos').click(function () {
    var element = document.getElementById('sisalto');
    element.classList.add('hidden');
  });

  const dialogMuuta = $('#dialogi_kayttajamuutos').dialog({
    autoOpen: false,
    closeOnEscape: false,
    draggable: false,
    modal: true,
    resizable: false,
    open: haeKayttajatiedot,
    close: () => {
      $('#muutosError').html('');
      formMuuta[0].reset();
    },
    buttons: [
      {
        text: 'Tallenna',
        click: () => {
          if ($.trim($('#usrTunnus').val()) === ''
            || $.trim($('#usrSalasana').val()) === ''
            || $.trim($('#usrSalasana2').val()) === ''
            || $.trim($('#usrNimi').val()) === '') {
            $('#muutosError').html('<p>Anna arvo kaikki kenttiin!</p>');
            return false;
          }
          if ($.trim($('#usrSalasana').val()) !== $.trim($('#usrSalasana2').val())) {
            $('#muutosError').html('<p>Antamasi salasanat eivät täsmää!</p>');
            return false;
          }
          muutaKayttajatiedot();
          dialogMuuta.dialog('close');
        },
      },
      {
        text: 'Peruuta',
        click: () => {
          dialogMuuta.dialog('close');
        },
      },
    ],
  });

  $('#muutaTietoja').click(() => {
    dialogMuuta.dialog('open');
  });

  formMuuta = dialogMuuta.find('form').on('submit', (event) => {
    event.preventDefault();
  });
});
