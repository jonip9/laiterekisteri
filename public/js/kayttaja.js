$(() => {
    let formMuuta;

    function haeVaraukset() { // Tee: admin tarkistus-> näyttää kaikki varaukset ja muutaLainatuksi Button
        $.get(
            'http://localhost:3000/varaus',
        ).done((data, textStatus, jqXHR) => {
            $('#varauksettaulu').empty();

            data.forEach(function (varaus) {
                $('#varauksettaulu').append(
                    '<tr>'
                    + '<td>' + varaus.id + '</td>'
                    + '<td>' + varaus.laite_id + '</td>'
                    + '<td>' + varaus.alkupvm + '</td>'
                    + '<td>' + varaus.loppupvm + '</td>'
                    + '<td>' + varaus.status + '</td>'
                    + '<td>' + varaus.kayttaja_id + '</td>'
                    + "<td><button onclick=\"poistaVaraus(" + varaus.id + ")\">Poista varaus</button></td>"
                    // + "<td><button onclick=\"muutaLainatuksi(" + varaus.id + ")\">Muuta lainatuksi</button></td>"
                    + '</tr>'
                );
            });

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('status=' + textStatus + ', ' + errorThrown);
        });
    }
    /*      Ei varmaan tarvi olla put
    function muutaLainatuksi(id) {
        $.ajax({
            url: 'http://localhost:3000/laitteenvaraus/' + id,
            method: 'put',
        });
    }
    */
    function haeLainat() { // Tee: admin tarkistus-> näyttää kaikki lainat ja muutaPalautetuksi Button
        $.get(
            'http://localhost:3000/laina',
        ).done(function (data, textStatus, jqXHR) {
            $('#lainattaulu').empty();

            data.forEach(function (varaus) {
                $('#varauksettaulu').append(
                    '<tr>'
                    + '<td>' + varaus.id + '</td>'
                    + '<td>' + varaus.laite_id + '</td>'
                    + '<td>' + varaus.alkupvm + '</td>'
                    + '<td>' + varaus.loppupvm + '</td>'
                    + '<td>' + varaus.status + '</td>'
                    + '<td>' + varaus.kayttaja_id + '</td>'
                    // + "<td><button onclick=\"muutaPalautetuksi(" + varaus.id + ")\">Muuta palautetuksi</button></td>"
                    + '</tr>'
                );
            });

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('status=' + textStatus + ', ' + errorThrown);
        });
    }
    /*
    function muutaPalautetuksi(id) {
        $.ajax({
            url: 'http://localhost:3000/laitteenvaraus/' + id,
            method: 'put',
        });
    }
    */
    function poistaVaraus(id) {
        $.ajax(
            {
                url: "http://localhost:3000/varaus/" + id,
                method: 'delete'
            }).done(function (data, textStatus, jqXHR) {

                $("#hakulomake").submit();
            }).fail(function (jqXHR, textStatus, errorThrown) {
                // Suoriteaan, jos kutsu epäonnistuu
                console.log("Kutsu epäonnistui: " + errorThrown);
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

    /* 
    $('#hakulomake').submit(function (event) {
         event.preventDefault();
 
         let hakuehdot = $(this).serialize();
         haeVaraukset(hakuehdot);
     });
     

 */
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
