$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $('#hidden-text').toggle();
        $('#title').toggleClass('mb-3');
    });
});

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

const getDoctors = async () => {
    // const request = new XMLHttpRequest()
    const data = await fetch('http://localhost:8080/doctors').then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#table-medical-record > tbody");
            // console.log(tableBody);
            // let tr = ''
            data?.items?.forEach((row) => {
                // console.log(row)
                tableBody.insertAdjacentHTML(`beforeend`, `
                    <tr>
                    <td>${row.id}</td>
                    <td>${row.fullName}</td>
                    <td>50</td>
                    <td>50</td>
                    <td>${row.phoneNumber}</td>
                    <td>50</td>
                    <td>50</td>
                    <td>
                        <span class='sua-btn' data=${row.id}><i class="fas fa-edit" data-toggle="modal" data-target="#editModal"></i></span>
                        <span class='xoa-btn' data='${row.id}' > <i class="fas fa-trash ml-2" data-toggle="modal" data-target="#deleteModal" ></i><span>
                    </td>
                </tr>
               `)
            });
        });

    const deleteBtn = document.querySelectorAll('.xoa-btn')
    const editBtn = document.querySelectorAll('.sua-btn')
    const idUser = document.querySelector('.modal-body__idUser')
   
    deleteBtn.forEach(btn => {
        // console.log(btn)
        btn.addEventListener('click', function () {
            const id = this.getAttribute('data')
            // console.log(this.getAttribute('data'))
            idUser.innerHTML = `Bạn muốn xóa hồ sơ có Mã Số HS: HS ${id}?`
        })
    })
    
    editBtn.forEach(btn => {
        // console.log(btn)
        btn.addEventListener('click', function () {
            const id = this.getAttribute('data')
            // console.log(id)
            // console.log(this.getAttribute('data'))
            // get API doctors/${id}
            // đổ dữ liệu vào cái Edit modal
        })
    })
}

getDoctors();