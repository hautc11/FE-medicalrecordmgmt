var emailInput = document.getElementById("emailInput");
var passwordInput = document.getElementById("passwordInput");

var uri = 'http://localhost:8080/login';


function eventLoginBtn() {
    console.log("login");
    var dataInput = {
        "email": emailInput.value,
        "password": passwordInput.value
    };
    console.log(dataInput)
    fetchLogin(uri, dataInput);
}

function fetchLogin(url = '', data = {}) {
    var t = fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    }).then(response => response.json()).then(
        data => {
            if (data.accessToken) {
                //luu vao session
                console.log(data.accessToken)
                sessionStorage.setItem('accessToken',data.accessToken)
                window.location.href = "medicalrecord.html";
            }else{
                //thong bao loi len UI
                console.log(data.message);
            }
        }
    )
}