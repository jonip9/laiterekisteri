$(() => {
  let tunnus = $('#tunnus').val();
  let salasana = $('#salasana').val();
  let adminkayttaja = false;
  let dialog;
  let form;

  function regKayttaja() {
    $.post(
      'http://localhost:3000/kayttaja',
      { tunnus: $('#reg_tunnus').val(), salasana: $('#reg_ss').val(), nimi: $('#reg_nimi').val() },
    ).done((data) => {
      dialog.dialog('close');
      location.reload();
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log('status=' + textStatus + ', ' + errorThrown);
      $('#regError').html('<p>Käyttäjä on jo olemassa!</p>');
    });
  }

  dialog = $('#dialogi_register').dialog({
    autoOpen: false,
    closeOnEscape: false,
    draggable: false,
    modal: true,
    resizable: false,
    buttons: [
      {
        text: 'Lähetä',
        click: () => {
          if ($.trim($('#reg_tunnus').val()) === '' || $.trim($('#reg_ss').val()) === '' || $.trim($('#reg_nimi').val()) === '') {
            $('#regError').html('<p>Anna arvo kaikkiin kenttiin!</p>');
            return false;
          }
          if (
            $.trim($('#reg_ss').val()) !== $.trim($('#reg_ss2').val())) {
            $('#regError').html('<p>Antamasi salasanat eivät täsmää!</p>');
            return false;
          }
          regKayttaja();
        },
      },
      {
        text: 'Peruuta',
        click: () => {
          dialog.dialog('close');
        },
      },
    ],
    close: () => {
      $('#regError').html('');
      form[0].reset();
    },
  });

  form = dialog.find('form').on('submit', (event) => {
    event.preventDefault();
    regKayttaja();
  });

  $('#register').click(() => {
    dialog.dialog('open');
  });
});
