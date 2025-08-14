const inputProducto = document.querySelector("#txtProducto");
const inputDescripcion = document.querySelector("#txtDescripcion");
const inputUnidadMedida = document.getElementById("txtUnidadMedida");
const btnGuardar = document.querySelector("#btnGuardar");

const inputsRequeridos = document.querySelectorAll("input[required]");
// Validar los campos


function validar() {

    let error = false;
    for (let i = 0; i < inputsRequeridos.length; i++) {
        if (inputsRequeridos[i].value == "") {
            error = true;
        }
    }

    if (error == false) {
        registrarMateriales();
    }

}

// Toma los datos HTML y los guada en la DB
function registrarMateriales() {
    const datosMateriales = {
        producto: inputProducto.value,
        descripcion: inputDescripcion.value
        unidadmedida: inputUnidadMedida.value
    };

    //Enviar datos al servidor
    fetch("http://localhost:3000/materiales", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(datosMateriales)
    }).then(response => {
        if (!response.ok) {
            console.log("No se puede registrar el articulo");
        } else {
            console.log("Articulo registrado");
        }
    }).catch(error => {
        console.log(error);
    });
}

btnGuardar.addEventListener("click", validar);