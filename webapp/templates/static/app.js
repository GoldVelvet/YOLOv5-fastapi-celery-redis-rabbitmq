var URL = 'http://localhost:8000'
var URL_STATUS = 'http://localhost:8000/api/status/'
var results = []
var status_list = []
var res = ''
jQuery(document).ready(function () {
    $('#row_detail').hide()
    $("#row_results").hide();
    $('#btn-process').on('click', function () {
        var form_data = new FormData();
        files = $('#input_file').prop('files')
        for (i = 0; i < files.length; i++)
            form_data.append('files', $('#input_file').prop('files')[i]);

        $.ajax({
            url: URL + '/api/process',
            type: "post",
            data: form_data,
            enctype: 'multipart/form-data',
            contentType: false,
            processData: false,
            cache: false,
            beforeSend: function () {
                results = []
                status_list = []
                $("#table_result > tbody").html('');
                $('#row_detail').hide();
                $("#row_results").hide();
            },
        }).done(function (jsondata, textStatus, jqXHR) {
            for (i = 0; i < jsondata.length; i++) {
                task_id = jsondata[i]['task_id']
                status = jsondata[i]['status']
                results.push(URL + jsondata[i]['url_result'])
                status_list.push(task_id)
                result_button = `<button class="btn btn-small btn-success" style="display: none" id="btn-view" data=${i}>View</a>`
                $("#table_result > tbody").append(`<tr><td>${task_id}</td><td id=${task_id}>${status}</td><td>${result_button}</td></tr>`);
                $("#row_results").show();
            }

            var interval = setInterval(refresh, 1000);

            function refresh() {
                n_success = 0
                for (i = 0; i < status_list.length; i++) {
                    $.ajax({
                        url: URL_STATUS + status_list[i],
                        success: function (data) {
                            id = status_list[i]
                            status = data['status']
                            $('#' + id).html(status)
                            if ((status == 'SUCCESS') || (status == 'FAILED')) {
                                $($('#' + id).siblings()[1]).children().show()
                                n_success++
                            }
                        },
                        async: false
                    });
                }
                if (n_success == status_list.length) {
                    clearInterval(interval);
                }
            }
        }).fail(function (jsondata, textStatus, jqXHR) {
            console.log(jsondata)
            $("#row_results").hide();
        });

    })

    $(document).on('click', '#btn-view', function (e) {
        id = $(e.target).attr('data')
        $.get(results[id], function (data) {
            res = data
            if (data['status'] == 'SUCCESS') {
                $('#row_detail').show()
                $('#result_txt').val(JSON.stringify(res.result['bbox'], undefined, 4))
                $('#result_img').attr('src', URL + '/' + res.result.file_name)
                $('#result_link').attr('href', URL + '/' + res.result.file_name)
            } else {
                alert('Result not ready or already consumed!')
                $('#row_detail').hide()
            }
        });
    })


    $(document).on('click', '#btn-refresh', function (e) {
        for (i = 0; i < status_list.length; i++) {
            $.ajax({
                url: URL_STATUS + status_list[i],
                success: function (data) {
                    id = status_list[i]
                    status = data['status']
                    $('#' + id).html(status)
                    if (status == 'SUCCESS')
                        $($('#' + id).siblings()[1]).children().show()
                },
                async: false
            });
        }
    })

})