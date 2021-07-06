const getDoctors = async () => {
    const request = new XMLHttpRequest()
    const data = await fetch('http://localhost:8080/doctors').then(response => response.json())
    .then(data=>console.log(data));
}

getDoctors();