document.getElementById("id-btn").addEventListener("click",(e)=>{
    e.preventDefault();
    const id = document.getElementById("identidad").value;
    const btnId = document.getElementById("id-btn");
    btnId.innerHTML = "Buscando..."
    if(id=="") return; //ID en blanco

    fetch(`https://apis.gometa.org/cedulas/${id}`).then(resp =>{
        if(resp.ok){
            return resp.json();
        }
        else{
            console.log("Error "+resp.status+" | "+resp.statusText);
        }
    }).then(data => {
        btnId.innerHTML = "Buscar"
        document.getElementById("name").value=data.nombre;
    });
})