const uri = "http://localhost:8080/register";
var email_regex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){5,}@fsoft\.com\.vn$\b/;
var password_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
let dataEmail
let dataPassword
function sendRegisterRequest(urlToSend, email, password) {
    $.ajax({
        type: "POST",
        url: urlToSend,
        dataType: 'JSON',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            email: email,
            password: password
        })
        , success: function () {
            console.log("success!")
        }, error: function (xhr) {
            if (xhr.status == 400) {
                console.log("fails")
                notify("Tài khoản e-mail đã tồn tại", "danger")
            } else if (xhr.status == 200) {
                console.log("ok :D")
                notify("Đăng ký tài khoản thành công", "success")
            }
        }
    })
}
function notify(message, type) {
    $.notify({
        message: `<strong>${message}<strong>`,
    }, {
        type: type,
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
}
$('.btn-register').click(function (e) {
    e.preventDefault();
    var email = $('#emailInput').val()
    var password = $('#passwordInput').val()
    var rePassword = $('#re-passwordInput').val()
    var errEmail = $('#errEmail')
    var errPassword = $('#errPassword')
    var errRePassword = $('#errRePassword')
    if (!email_regex.exec(email)) {
        errEmail.text("Không được bỏ trống, chứa khoảng trắng, ký tự đặc biệt và kết thúc bằng @fsoft.com.vn")
    } else {
        errEmail.text("")
        dataEmail = email
    }
    if (!password_regex.exec(password)) {
        errPassword.text("Độ dài mật khẩu ít nhất là 8 kí tự, không chứa ký tự đặc biệt và gồm ít nhất 1 chữ cái")
    } else {
        errPassword.text("")
        dataPassword = password
    }
    if (email != "" && password != "" && password == rePassword) {
        errRePassword.text("")
        sendRegisterRequest(uri, dataEmail, dataPassword)
    } else {
        errRePassword.text("Không trùng khớp mật khẩu")
    }
})