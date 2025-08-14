const inputProducto = document.querySelector("#txtProducto");
const inputDescripcion = document.querySelector("#txtDescripcion");
const inputUnidadMedida = document.querySelector("#txtUnidadMedida"); // Fixed selector
const btnGuardar = document.querySelector("#btnGuardar");
const inputsRequeridos = document.querySelectorAll("input[required]");

function validar() {
    let error = false;
    
    inputsRequeridos.forEach(input => {
        if (input.value.trim() === "") {
            input.classList.add("error");
            error = true;
        } else {
            input.classList.remove("error");
        }
    });

    if (!error) {
        registrarMateriales();
    }
}

function registrarMateriales() {
    const datosMateriales = {
        producto: inputProducto.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        unidadmedida: inputUnidadMedida.value.trim()
    };

    fetch("http://localhost:3000/materiales", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Fixed case
        },
        body: JSON.stringify(datosMateriales)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("No se puede registrar el artículo");
        }
        return response.json();
    })
    .then(data => {
        console.log("Artículo registrado", data);
        // Optional: Reset form or show success message
        // document.querySelector("form").reset();
    })
    .catch(error => {
        console.error("Error:", error);
        // Optional: Show error message to user
    });
}

btnGuardar.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    validar();
});