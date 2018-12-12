$(function () {
    function date() {
        var date = new Date();

        var day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            hour = date.getHours(),
            min = date.getMinutes();

        month = (month < 10 ? "0" : "") + month;
        day = (day < 10 ? "0" : "") + day;
        hour = (hour < 10 ? "0" : "") + hour;
        min = (min < 10 ? "0" : "") + min;

        var today = year + "-" + month + "-" + day,
            displayTime = hour + ":" + min;

        $("#alkupvm").val(today);
        $("#loppupvm").val(today);
        $("#kloaika1").val(displayTime);
        $("#kloaika2").val(displayTime);
    }
    window.onload = date();

    function hide() {
        document.getElementById('status').style.visibility = 'hidden';
        document.getElementById('statuslabel').style.visibility = 'hidden';
    }

    function show() {
        if ($("#isAdmin").val() === "true") {
            document.getElementById('status').style.visibility = 'visible';
            document.getElementById('statuslabel').style.visibility = 'visible';
        }
    }
    window.onload = hide();
    window.onload = show();

    $("#dialogi_varaushistoria").dialog({
        width: 1200,
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        modal: true,
        resizable: false,
        close: () => {
            $('#muutosError2').html('');
        },
        buttons: [
            {
                text: "Tallenna",
                click: function () {
                    if ($.trim($("#alkupvm").val()) === "" ||
                        $.trim($("#loppupvm").val()) === "") {
                        $('#muutosError2').html('<p>Anna arvo kaikkiin kenttiin!</p>');
                        return false;
                    }
                    else if ($("#alkupvm").val() > $("#loppupvm").val()) {
                        $('#muutosError2').html('<p>Alkupvm ei voi olla suurempi kuin loppupvm!!</p>');
                        return false;
                    } else {
                        tarkistapaallekkaisyydet($("#laite_id").val());
                    }
                },
            },
            {
                text: "Takaisin",
                click: function () {
                    $(this).dialog("close");
                    $("#varaushistoriataulu").empty();
                },
            }
        ],
    });
});

function haeVaratutpaivat(sarjanro) {
    $.ajax({
        url: "http://localhost:3000/laitteenvaraukset/" + sarjanro,
        method: 'GET',
        datatype: 'json',
        success: function (data) {
            $("#laite_id").val(sarjanro);
            $("#dialogi_varaushistoria").dialog("open");

            $('#varaushistoriataulu').DataTable({
                bJQueryUI: true,
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

    $.ajax({
        url: "http://localhost:3000/vanhatlaitteenvaraukset/" + sarjanro,
        method: 'GET',
        datatype: 'json',
        success: function (data) {

            $('#vanhatvarauksettaulu').DataTable({
                bJQueryUI: true,
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

function tarkistapaallekkaisyydet(sarjanro) {
    $.get(
        "http://localhost:3000/laitteenvaraukset/" + sarjanro
    ).done(function (data, textStatus, jqXHR) {

        let paallekain = false;
        data.forEach(function (pvm) {
            let alkutietokanta = pvm.alkupvm;
            let lopputietokanta = pvm.loppupvm;
            let alkuinput = $("#alkupvm").val() + "T" + $("#kloaika1").val() + ":00.000Z";
            let loppuinput = $("#loppupvm").val() + "T" + $("#kloaika2").val() + ":00.000Z";

            if (lopputietokanta >= alkuinput && alkutietokanta <= loppuinput)
                paallekain = true;
        });

        if (paallekain) {
            $('#muutosError2').html('<p>Varaus menee muiden varausten päälle!!</p>');
        } else {
            $('#muutosError2').html('');
            var lisattyVarausData = "laite_id=" + $("#laite_id").val() +
                "&alkupvm=" + $("#alkupvm").val() + " " + $("#kloaika1").val() +
                "&loppupvm=" + $("#loppupvm").val() + " " + $("#kloaika2").val() +
                "&status=" + $("#status").val();

            $.post(
                "http://localhost:3000/laitteenvaraus",
                lisattyVarausData
            ).done(function (data, textStatus, jqXHR) {
                $("#varaushistoriataulu").empty();
                haeVaratutpaivat(sarjanro);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("status=" + textStatus + ", " + errorThrown);
            });
        }
    });
}
