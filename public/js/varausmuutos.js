$(() => {
    $("#dialogi_varaushistoria2").dialog({
        width: 1200,
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        close: () => {
            $('#muutosError3').html('');
        },
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#alkupvm2").val()) === "" ||
                        $.trim($("#loppupvm2").val()) === "") {
                        $('#muutosError3').html('<p>Anna arvo kaikkiin kenttiin!</p>');
                        return false;
                    }
                    else if ($("#alkupvm2").val() > $("#loppupvm2").val()) {
                        $('#muutosError3').html('<p>Alkupvm ei voi olla suurempi kuin loppupvm!!</p>');
                        return false;
                    } else
                        tarkistapaallekkaisyydet2($("#laite_id2").val(), $("#varaus_id").val())
                },
            },
            {
                text: "Takaisin",
                click: function () {
                    $(this).dialog("close");
                    $("#varaushistoriataulu2").empty();
                },
            }
        ],
    });

    $('#dialog-poisto-varmennus').dialog({
        autoOpen: false,
        resizable: false,
        height: 'auto',
        width: 400,
        modal: true,
        title: 'Varmistus',
        close: () => {
            $('#varausPoistoError').val('');
        }
    });
});

function avaamuutaVarausta(sarjanro, id) {
    $.get(
        "http://localhost:3000/laitteenvaraus/" + id,
        (data, textStatus, jqXHR) => {
            var alku = data[0].alkupvm,
                pvm1 = alku.substring(0, 10),
                aika1 = alku.substring(11, 16),
                loppu = data[0].loppupvm,
                pvm2 = loppu.substring(0, 10),
                aika2 = loppu.substring(11, 16);
            $("#alkupvm2").val(pvm1);
            $("#loppupvm2").val(pvm2);
            $("#kloaika11").val(aika1);
            $("#kloaika21").val(aika2);
            $("#varaus_id").val(id);
        });
    $.ajax({
        url: "http://localhost:3000/laitteenvaraukset/" + sarjanro,
        method: 'GET',
        datatype: 'json',
        success: function (data) {

            $("#laite_id2").val(sarjanro);
            $("#dialogi_varaushistoria2").dialog("open");

            $('#varaushistoriataulu2').DataTable({
                data: data,
                bJQueryUI: true,
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
                    { 'data': 'kayttaja' }
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
                        }
                    ]
            });
        }
    });
}

function tarkistapaallekkaisyydet2(sarjanro, id) {
    $.get(
        "http://localhost:3000/laitteenvaraukset/" + sarjanro + "/" + id
    ).done(function (data, textStatus, jqXHR) {

        let paallekain2 = false;
        let alkuinput = $("#alkupvm2").val() + "T" + $("#kloaika11").val() + ":00.000Z";
        let loppuinput = $("#loppupvm2").val() + "T" + $("#kloaika21").val() + ":00.000Z";
        data.forEach(function (pvm) {
            let alkutietokanta = pvm.alkupvm;
            let lopputietokanta = pvm.loppupvm;

            if (lopputietokanta >= alkuinput && alkutietokanta <= loppuinput)
                paallekain2 = true;
        });

        if (paallekain2) {
            $('#muutosError3').html('<p>Varaus menee muiden varausten päälle!!</p>');
        } else {

            $('#muutosError3').html('');
            var muutettuVarausData = "alkupvm=" + $("#alkupvm2").val() + " " + $("#kloaika11").val() +
                "&loppupvm=" + $("#loppupvm2").val() + " " + $("#kloaika21").val();

            $.ajax({
                url: "http://localhost:3000/laitteenvaraus/" + $("#varaus_id").val(),
                method: 'put',
                data: muutettuVarausData,
            }).done(function (data, textStatus, jqXHR) {
                $("#varaushistoriataulu2").empty();
                avaamuutaVarausta($("#laite_id2").val(), $("#varaus_id").val());
            });
        }
    });
}

function muutaLainatuksi(id, status) {
    $.ajax({
        url: 'http://localhost:3000/laitteenvaraukset/' + id,
        method: 'put',
        data: { status: status }
    }).done(function (data, textStatus, jqXHR) {
        haeKayttajanVaraukset();
        haeKayttajanLainat();
    });
}

function poistaVaraus(id) {
    $('#dialog-poisto-varmennus').dialog({
        buttons: {
            "Kyllä": () => {
                if ($("#varaus" + id + ".varausStatus:contains('Varattu')")) {
                    $.ajax({
                        url: "http://localhost:3000/laitteenvaraus/" + id,
                        method: 'delete',
                    }).done(function (data, textStatus, jqXHR) {
                        haeKayttajanVaraukset();
                        $('#dialog-poisto-varmennus').dialog('close');
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        console.log("Kutsu epäonnistui: " + errorThrown);
                    });
                } else {
                    $('#varausPoistoError').val('Laite on jo lainattu. Varausta ei voida poistaa.')
                }
            },
            "Ei": () => {
                $('#dialog-poisto-varmennus').dialog('close');
            }
        }
    });
    $('#dialog-poisto-varmennus').dialog('open');
}

function muutaVaratuksi(id, status) {
    $.ajax({
        url: 'http://localhost:3000/laitteenvaraukset/' + id,
        method: 'put',
        data: { status: status }
    }).done(function (data, textStatus, jqXHR) {
        haeKayttajanVaraukset();
        haeKayttajanLainat();
    });
}

function muutaPalautetuksi(id, status) {
    $.ajax({
        url: 'http://localhost:3000/laitteenvaraukset/' + id,
        method: 'put',
        data: { status: status }
    }).done(function (data, textStatus, jqXHR) {
        haeKayttajanVaraukset();
        haeKayttajanLainat();
    });
}
