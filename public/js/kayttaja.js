$(() => {
    window.onload = haeKayttajanVaraukset();
    window.onload = haeKayttajanLainat();

    let formMuuta;

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

function haeKayttajanVaraukset() {
    $.ajax({
        url: 'http://localhost:3000/varaus',
        method: 'GET',
        datatype: 'json',
        success: function (data) {
            $('#varausDatatable').DataTable({
                data: data,
                destroy: true,
                columns: [
                    { 'data': 'id' },
                    { 'data': 'laite_id' },
                    { 'data': 'laite' },
                    { 'data': 'merkki' },
                    { 'data': 'malli' },
                    { 'data': 'alkupvm' },
                    { 'data': 'loppupvm' },
                    { 'data': 'status' },
                    { 'data': 'kayttaja' },
                    { "data": null },
                    { "data": null },
                    { "data": null }
                ], "columnDefs":
                    [
                        { "width": "20%", "targets": [5, 6] },
                        {
                            targets: 5,
                            render: function (data, type, row) {
                                var parsittualkupvm = data.substring(11, 16) + " " + data.substring(8, 10) + data.substring(4, 8) + data.substring(0, 4);
                                return parsittualkupvm;
                            }
                        }, {
                            targets: 6,
                            render: function (data, type, row) {
                                var parsittuloppupvm = data.substring(11, 16) + " " + data.substring(8, 10) + data.substring(4, 8) + data.substring(0, 4);
                                return parsittuloppupvm;
                            }
                        }, {
                            "data": null,
                            "targets": -3,
                            "render": function (varaus) {
                                return "<button class=\"btn btn-info\" onclick=\"avaamuutaVarausta(" + varaus.laite_id + "," + varaus.id + "); return false;\">Muuta varaus</button>";
                            }
                        }, {
                            "data": null,
                            "targets": -2,
                            "render": function (varaus) {
                                return "<button class=\"btn btn-danger\" onclick=\"poistaVaraus(" + varaus.id + "); return false;\">Poista varaus</button>";
                            }
                        }, {
                            "targets": -1,
                            "render": function (varaus) {
                                if ($("#isAdmin").val() === "true") {
                                    return "<button class=\"btn btn-warning\" onclick=\"muutaLainatuksi(" + varaus.id + ", '" + varaus.status + "')\">Muuta lainatuksi</button>";
                                } return "";
                            }
                        }
                    ]
            });
        }
    });
}

function haeKayttajanLainat() {
    $.ajax({
        url: 'http://localhost:3000/laina',
        method: 'GET',
        datatype: 'json',
        success: function (data) {
            $('#lainatDatatable').DataTable({
                data: data,
                destroy: true,
                columns: [
                    { 'data': 'id' },
                    { 'data': 'laite_id' },
                    { 'data': 'laite' },
                    { 'data': 'merkki' },
                    { 'data': 'malli' },
                    { 'data': 'alkupvm' },
                    { 'data': 'loppupvm' },
                    { 'data': 'status' },
                    { 'data': 'kayttaja' },
                    { "data": null },
                    { "data": null },
                    { "data": null }
                ], "columnDefs":
                    [
                        { "width": "15%", "targets": [5, 6] },
                        {
                            targets: 5,
                            render: function (data, type, row) {
                                var parsittualkupvm = data.substring(11, 16) + " " + data.substring(8, 10) + data.substring(4, 8) + data.substring(0, 4);
                                return parsittualkupvm;
                            }
                        }, {
                            targets: 6,
                            render: function (data, type, row) {
                                var parsittuloppupvm = data.substring(11, 16) + " " + data.substring(8, 10) + data.substring(4, 8) + data.substring(0, 4);
                                return parsittuloppupvm;
                            }
                        }, {
                            "data": null,
                            "targets": -3,
                            "render": function (varaus) {
                                if ($("#isAdmin").val() === "true") {
                                    return "<td><button class=\"btn btn-info2\" onclick=\"muutaPalautetuksi(" + varaus.id + ", '" + varaus.status + "')\">Muuta palautetuksi</button></td>";
                                } return "";
                            }
                        }, {
                            "targets": -2,
                            "render": function (varaus) {
                                if ($("#isAdmin").val() === "true") {
                                    return "<td><button class=\"btn btn-primary\" onclick=\"muutaVaratuksi(" + varaus.id + ", '" + varaus.status + "1" + "')\">Muuta varatuksi</button></td>";
                                } return "";
                            }
                        }, {
                            "targets": -1,
                            "render": function (varaus) {
                                if ($("#isAdmin").val() === "true") {
                                    return "<button class=\"btn btn-info\" onclick=\"avaamuutaVarausta(" + varaus.laite_id + "," + varaus.id + "); return false;\">Muuta varaus</button>";
                                } return "";
                            }
                        }
                    ]
            });
        }
    });
}
