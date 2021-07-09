const addMedicalRecordForm = document.querySelector('.add-medical-record-form');
const fullNameInputAdd = document.getElementById('fullNameInputAdd');
const dobInputAdd = document.getElementById('dobInputAdd');
const addressInputAdd = document.getElementById('addressInputAdd');
const phoneInputAdd = document.getElementById('phoneInputAdd');
const sexInputAdd = document.getElementById('sexInputAdd');
/*---------------------------*/
const idInputEdit = document.getElementById('idInputEdit');
const fullNameInputEdit = document.getElementById('fullNameInputEdit');
const dobInputEdit = document.getElementById('dobInputEdit');
const addressInputEdit = document.getElementById('addressInputEdit');
const phoneInputEdit = document.getElementById('phoneInputEdit');
const sexInputEdit = document.getElementById('sexInputEdit');
/** ----------x ------------ */
const accessToken = sessionStorage.getItem('accessToken');
const tableBody = document.querySelector("#table-medical-record > tbody");
const pagination = document.getElementById('pagination');

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#hidden-text').toggle();
        $('#title').toggleClass('mb-3');
    });
    $.notify({
        message: "<strong>Đăng nhập thành công!<strong>",
    }, {
        type: "success",
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
});

$('#logout-btn').click(function () {
    console.log(sessionStorage.getItem('accessToken'))
    sessionStorage.removeItem('accessToken')
    sessionStorage.clear()
    $(location).attr('href',"login.html")
})

function dropdownLogout() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//cvt timestamp to custom date
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

const renderMedicalRecords = async (records) => {
    records?.items?.forEach((row) => {
        var createAt = cvtTimestamp2Date(row.createAt);
        var expirationDate = cvtTimestamp2Date(row.expirationDate);
        var sex = '';
        if (row.sex == 1) {
            sex = "Nam";
        } else {
            sex = "Nữ"
        }
        tableBody.insertAdjacentHTML(`beforeend`, `
                    <tr>
                    <td>${row.id}</td>
                    <td>${row.fullName}</td>
                    <td>${row.dob}</td>
                    <td>${sex}</td>
                    <td>${row.address}</td>
                    <td>${row.phoneNumber}</td>
                    <td>${createAt}</td>
                    <td>${expirationDate}</td>
                    <td>
                        <span class='sua-btn' data=${row.id}><i class="fas fa-edit" data-toggle="modal" data-target="#editModal"></i></span>
                        <span class='xoa-btn' data='${row.id}' > <i class="fas fa-trash ml-2" data-toggle="modal" data-target="#deleteModal" ></i><span>
                    </td>
                </tr>
               `);
    });

    const deleteBtn = document.querySelectorAll('.xoa-btn')
    const editBtn = document.querySelectorAll('.sua-btn')
    const idUser = document.querySelector('.modal-body__idUser')

    deleteBtn.forEach(btn => {
        btn.addEventListener('click', function () {
            const id = btn.getAttribute('data')
            const btnDeleteDone = document.querySelector('.btn-delete-done');
            idUser.innerHTML = `Bạn muốn xóa hồ sơ có Mã Số HS: HS ${id}?`
            deleteRecord(+id, btnDeleteDone)
            console.log(btnDeleteDone);
        })
    })

    editBtn.forEach(btn => {
        // console.log(btn)
        btn.addEventListener('click', function () {
            const id = btn.getAttribute('data')
            const btnEditDone = document.querySelector('.btn-edit-done');
            editRecord(id, btnEditDone)
        })
    })
}

function setPagination(paginationPages) {
    paginationPages?.forEach((page) => {
        page.addEventListener('click', (e) => {
            e.preventDefault();
            paginationPages.forEach(items => items.classList.remove("pagination-active"))
            page.classList.add("pagination-active")
            fetch(`http://localhost:8080/medicalrecords?page=${page.innerText - 1}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            })
                .then(response => response.json())
                .then(data => {
                    //xoa record sau khi pagination
                    while (tableBody.hasChildNodes()) {
                        tableBody.removeChild(tableBody.childNodes[0])
                    }
                    renderMedicalRecords(data)
                })
        })
    })
}


const getMedicalRecords = async () => {
    const data = await fetch('http://localhost:8080/medicalrecords', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    }
    ).then(response => response.json())
        .then(data => {
            for (let index = 1; index <= data.totalPages; index++) {
                if (index == 1) {
                    pagination.insertAdjacentHTML(`beforeend`,
                        `
                    <li class="pagination-active" id="pagination-page">${index}</li>
                `)
                } else {
                    pagination.insertAdjacentHTML(`beforeend`,
                        `
                    <li id="pagination-page">${index}</li>
                `)
                }
            }
            renderMedicalRecords(data)
        });
    const paginationPages = document.querySelectorAll('#pagination-page');
    setPagination(paginationPages);

}
function deleteRecord(id, btnDeleteDone) {
    // console.log(btnDeleteDone);
    const idUser = id
    btnDeleteDone.addEventListener('click', () => {
        fetch(`http://localhost:8080/medicalrecords/${idUser}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }).then(response => {
            if (response.ok) {
                $('#deleteModal').modal('hide')
                console.log("Xóa thành công")
            } else {
                console.log("Thất bại")
            }
        })
    })
}
const editRecord = async (id, btnEditDone) => {
    const dataUser = await fetch(`http://localhost:8080/medicalrecords/${+id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })
        .then(response => response.json())
        .then(data => data)
    idInputEdit.value = dataUser.id
    fullNameInputEdit.value = dataUser.fullName
    dobInputEdit.value = dataUser.dob
    addressInputEdit.value = dataUser.address
    phoneInputEdit.value = dataUser.phoneNumber
    sexInputEdit.value = dataUser.sex

    btnEditDone.addEventListener('click', () => {
        fetch(`http://localhost:8080/medicalrecords`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({
                id: dataUser.id,
                fullName: fullNameInputEdit.value,
                dob: dobInputEdit.value,
                address: addressInputEdit.value,
                phoneNumber: phoneInputEdit.value,
                sex: sexInputEdit.value
            })
        }).then(response => {
            if (response.ok) {
                $('#editModal').modal('hide')
                console.log("Edit thành công")
                // con live share ne
            } else {
                console.log("Thất bại")
            }
        })
    })
}

addMedicalRecordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var accessToken = sessionStorage.getItem('accessToken');
    fetch('http://localhost:8080/medicalrecords', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify({
            fullName: fullNameInputAdd.value,
            dob: dobInputAdd.value,
            address: addressInputAdd.value,
            phoneNumber: phoneInputAdd.value,
            sex: sexInputAdd.value
        })
    }).then(response => {
        if (response.ok) {
            $('#addModal').modal('hide')

        } else {
            console.log("Thất bại")
        }
    })
})

getMedicalRecords();
// setPagination();