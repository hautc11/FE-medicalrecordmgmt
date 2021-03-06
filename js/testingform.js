const uri = "http://localhost:8080/testingforms";
const accessToken = sessionStorage.getItem('accessToken');
const searchInput = $("#searchInput")
// add input
const testNameInputAdd = $('#testNameInputAdd');
const testDateInputAdd = $('#testDateInputAdd');
const resultInputAdd = $('#resultInputAdd');
const recordIdInputAdd = $('#recordIdInputAdd');
// edit input
const idInputEdit = $('#idInputEdit')
const testNameInputEdit = $('#testNameInputEdit');
const testDateInputEdit = $('#testDateInputEdit');
const resultInputEdit = $('#resultInputEdit');
const recordIdInputEdit = $('#recordIdInputEdit');

//side bar
$('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active', 2000, "easeOutSine");
    $('#hidden-text').toggle(500);
    $('#title').toggleClass('mb-3');
});
//dropdown logout
$('#dropdownLogout').click(function () {
    $('#myDropdown').slideToggle("slow");
})
//close dropdown khi click outside
$(document).on("click", function (event) {
    var $trigger = $("#dropdownLogout");
    if ($trigger !== event.target && !$trigger.has(event.target).length) {
        $(".dropdown-content").slideUp("slow");
    }
});
//logout event
$('#logout-btn').click(function () {
    console.log(sessionStorage.getItem('accessToken'))
    sessionStorage.removeItem('accessToken')
    sessionStorage.clear()
    $(location).attr('href', "index.html")
})
//
$("#btn-add-done").click(function (e) {
    e.preventDefault();
    if (testNameInputAdd.val() == "" || testDateInputAdd.val() == ""
        || resultInputAdd.val() == "" || recordIdInputAdd.val() == "") {
        $("#emptyAddForm").text("Vui lòng điền đầy đủ thông tin phiếu xét nghiệm")
    } else {
        $("#emptyAddForm").text("")
        $.ajax({
            type: "POST",
            url: uri,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
            }, data: JSON.stringify({
                testName: testNameInputAdd.val(),
                testDate: testDateInputAdd.val(),
                result: resultInputAdd.val(),
                recordId: recordIdInputAdd.val()
            })
            , success: function () {
                console.log("Thêm thành công")
                setTimeout(function () {// wait for 5 secs(2)
                    location.reload(); // then reload the page.(3)
                }, 1000);
            }, error: function (xhr) {
                if (xhr.status == 400) {
                    var err = JSON.parse(xhr.responseText).message
                    $("#emptyAddForm").text(err)
                } else if (xhr.status == 200) {
                    $('#addModal').modal('hide')
                    notifyPush("Thêm thành công!", "success")
                }
            }
        })
    }
})

$(".btn-update").click(function () {
    $("#tableBody tr").remove()
    sendGetBillRequest(uri);
})

$(".btn-search").click(function () {
    if (searchInput.val() != "") {
        search(searchInput.val());
    }
})
$(".btn-export").click(function () {
    var d = new Date();
    var month = d.getMonth() + 1
    var now = d.getDate() + "/" + month + "/" + d.getFullYear();
    console.log(now);
    html2canvas(document.querySelector("#table-medical-record"), {
        x: 300,
    }).then(canvas => {
        pdfMake.fonts = {
            Roboto: {
                normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
                bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
                italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
                bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
            }
        }
        var image = canvas.toDataURL();
        var dd = {
            pageOrientation: 'landscape',
            pageMargins: [40, 30],
            content: [
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                [
                                    {
                                        text: 'Bệnh viện trung ương X',
                                        alignment: 'center',
                                    },
                                    {
                                        text: 'Thành phố Y\n',
                                        style: 'subtext',
                                        alignment: 'center',
                                        italics: true
                                    },
                                ],
                            ]
                        ]

                    },
                    layout: 'noBorders'
                },
                {
                    text: 'Người lập bảng: ',
                    margin: [30, 20, 0, 0],
                    style: 'subtext'
                },
                {
                    text: 'Ngày lập: ' + now,
                    margin: [30, 0],
                    style: 'subtext'
                },
                {
                    text: 'LỊCH SỬ XÉT NGHIỆM',
                    style: 'header',
                    margin: [0, 20],
                    alignment: 'center'
                },
                {
                    image: image,
                    width: 750
                },
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [[],
                            [
                                {
                                    text: 'Chữ ký',
                                    alignment: 'center',
                                    margin: [80, 10, 0, 0]
                                },

                            ],
                            ]
                        ]

                    },
                    layout: 'noBorders'
                },
            ],
            styles: {
                header: {
                    fontSize: 15,
                    bold: true
                },
                subtext: {
                    fontSize: 10,
                    italic: true
                }
            },
        }
        pdfMake.createPdf(dd).open();
    });
})
function search(params) {
    $("#tableBody tr").remove()
    $.ajax({
        type: "GET",
        url: uri + `?search=${params}`,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
        }, success: function (result) {
            renderTable(result)
            $('#pagination li').remove()
            for (let index = 1; index <= result.totalPages; index++) {
                if (index == 1) {
                    $('#pagination').append(`<li class="pagination-active pagination-page" data=${index}>${index}</li>`)
                } else {
                    $('#pagination').append(`<li class="pagination-page" data=${index}>${index}</li>`)
                }
            }
            $('.pagination-page').click(function () {
                $('.pagination-page').removeClass('pagination-active')
                var page = $(this).attr('data');
                setPaginationEvent(uri, page)
            })
        }, error: function (result) {
            console.log("Fail: " + result)
        }
    })
}
function cvtTimestamp2Date(timestamp) {
    let date = new Date(timestamp);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let dt = date.getUTCDate();
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    let result = year + "-" + month + "-" + dt;
    return result;
}
function sendGetBillRequest(urlToSend) {
    $.ajax({
        type: "GET",
        url: urlToSend,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
        }, success: function (result) {
            renderTable(result)
            $('#pagination li').remove()
            for (let index = 1; index <= result.totalPages; index++) {
                if (index == 1) {
                    $('#pagination').append(`<li class="pagination-active pagination-page" data=${index}>${index}</li>`)
                } else {
                    $('#pagination').append(`<li class="pagination-page" data=${index}>${index}</li>`)
                }
            }
            $('.pagination-page').click(function () {
                $('.pagination-page').removeClass('pagination-active')
                var page = $(this).attr('data');
                setPaginationEvent(uri, page)
            })
        }, error: function (result) {
            console.log("Fail: " + result)
        }
    })
}

function sendEditRequest(urlToSend) {
    $.ajax({
        type: "PUT",
        url: urlToSend,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: idInputEdit.val(),
            testName: testNameInputEdit.val(),
            testDate: testDateInputEdit.val(),
            result: resultInputEdit.val(),
            recordId: recordIdInputEdit.val()
        }), beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
        }, success: function (result) {
            console.log("success! " + result)
        }, error: function (xhr) {
            if (xhr.status == 400) {
                var err = JSON.parse(xhr.responseText).message
                $("#emptyEditForm").text(err)
            } else if (xhr.status == 200) {
                $('#editModal').modal('hide')
                notifyPush("Chỉnh sửa thành công!", "success")
                setTimeout(function () {// wait for 5 secs(2)
                    location.reload(); // then reload the page.(3)
                }, 1000);
            }
        }
    })
}

function getDataByID(urlToSend, id) {
    $.ajax({
        type: "GET",
        url: urlToSend + `/${id}`,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
        }, success: function (result) {
            idInputEdit.val(result.id)
            testNameInputEdit.val(result.testName),
                testDateInputEdit.val(result.testDate),
                resultInputEdit.val(result.result),
                recordIdInputEdit.val(result.recordResponse.id)
            $('.btn-edit-done').click(function () {
                sendEditRequest(uri);
            })
        }, error: function (result) {
            console.log(result)
        }
    })
}
function setPaginationEvent(urlToSend, page) {
    let activePage = $(`li[data|=${page}]`);
    activePage.addClass("pagination-active")
    $.ajax({
        type: "GET",
        url: urlToSend + `?page=${page - 1}`,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
        }, success: function (result) {
            $("#tableBody tr").remove()
            renderTable(result)
        }, error: function (result) {
            console.log(result)
        }
    })
}
function renderTable(data) {
    (data.items).forEach(row => {
        $("#tableBody").append(
            `<tr>
                <td><input type="checkbox" name="selectBox" class="checkBox" value=${row.id}></td>
                <td>${row.id}</td>
                <td>${row.testName}</td>
                <td>${row.testDate}</td>
                <td>${row.result == 1 ? "Dương tính" : "Âm tính"}</td>
                <td>${row.recordResponse.id}</td>
                <td>${row.recordResponse.fullName}</td>
                <td>${row.recordResponse.phoneNumber}</td>
                <td>
                    <span class='edit-row' data=${row.id}><i class="fas fa-edit ml-1" data-toggle="modal" data-target="#editModal"></i></span>
                    <span class='delete-row' data='${row.id}' > <i class="fas fa-trash ml-1" data-toggle="modal" data-target="#deleteModal" ></i><span>
                </td>
            </tr>`
        )
    });
    $(".edit-row").click(function () {
        var id = $(this).attr('data');
        getDataByID(uri, id);
    })
    $(".delete-row").click(function () {
        var id = $(this).attr('data');
        $('.modal-body-delete').text(`Bạn muốn xóa phiếu xét nghiệm số: ${id}?`)
        deleteById(uri, id);
    })
    var $submit = $(".btn-delete-all").hide(),
        $cbs = $('input[name="selectBox"]').click(function () {
            $submit.toggle($cbs.is(":checked"));
        });
}
$(".btn-delete-all").click(function () {
    var arr = $('input[name="selectBox"]');
    var listItemsDelete = []
    for (const item of arr) {
        if (item.checked) {
            listItemsDelete.push($(item).val())
        }
    }
    deleteByListId(listItemsDelete);

})
function deleteByListId(list) {
    list.forEach(id => {
        $.ajax({
            type: "DELETE",
            url: uri + `/${id}`,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
            }, success: function () {
                console.log("Xóa thành công")
            }, error: function (xhr) {
                if (xhr.status == 400) {
                    $('#deleteModal').modal('hide')
                    notifyPush("Xóa thất bại!", "danger")
                } else if (xhr.status == 200) {
                    $('#deleteModal').modal('hide')
                    notifyPush("Xóa thành công!", "success")
                }
            }
        })
    })
}
function deleteById(urlToSend, id) {
    $('.btn-delete-done').click(function () {
        $.ajax({
            type: "DELETE",
            url: urlToSend + `/${id}`,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + accessToken)
            }, success: function () {
                console.log("Xóa thành công")
            }, error: function (xhr) {
                if (xhr.status == 400) {
                    $('#deleteModal').modal('hide')
                    notifyPush("Xóa thất bại!", "danger")
                } else if (xhr.status == 200) {
                    $('#deleteModal').modal('hide')
                    notifyPush("Xóa thành công!", "success")
                    setTimeout(function () {// wait for 5 secs(2)
                        location.reload(); // then reload the page.(3)
                    }, 1000);
                }
            }
        })
    })
}

function notifyPush(message, type) {
    $.notify({
        message: `<strong>${message}<strong>`,
    }, {
        type: `${type}`,
        placement: {
            from: "top",
            align: "right"
        },
        delay: 1000,
        animate: {
            enter: 'animate__animated animate__fadeInDown',
            exit: 'animate__animated animate__fadeOutUp'
        },
    });
}
$(document).ready(function () {
    if (accessToken != null) {
        sendGetBillRequest(uri, accessToken);
    } else {
        $(location).attr('href', "page404.html")
    }

})