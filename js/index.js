const uri = "http://localhost:8080/login";

function sendLoginRequest(urlToSend, email, password) {
    $.ajax({
        type: "POST",
        url: urlToSend,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            email: email,
            password: password
        })
        , success: function (result) {
            sessionStorage.setItem('accessToken', result.accessToken)
            $(location).attr('href', 'medicalrecord.html')
        }, error: function (result) {
            $.notify({
                message: "<strong>Email hoặc mật khẩu chưa chính xác<strong>",
            }, {
                type: "danger",
                placement: {
                    from: "top",
                    align: "right"
                },
                delay: 3000,
                animate: {
                    enter: 'animate__animated animate__fadeInDown',
                    exit: 'animate__animated animate__fadeOutUp'
                },
            });
            console.log("Fail: " + result.responseJSON.message)
        }
    })
}

$('.btn-login').click(function (e) {
    e.preventDefault();
    var email = $('#emailInput').val()
    var password = $('#passwordInput').val()
    var errEmail = $('#errEmail')
    var errPassword = $('#errPassword')
    if (email == "" && password == "") {
        errEmail.text("Không thể để trống Email!")
        errPassword.text("Không thể để trống Pasword!")
    } else {
        if (email == "" && password != "") {
            errEmail.text("Không thể để trống Email!")
            errPassword.text("")
        } else {
            if (email != "" && password == "") {
                errEmail.text("")
                errPassword.text("Không thể để trống Pasword!")
            } else {
                errEmail.text("")
                errPassword.text("")
                sendLoginRequest(uri, email, password)
            }
        }
    }
});