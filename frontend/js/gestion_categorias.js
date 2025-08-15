const inputCategoria = document.getElementById("txtCategoria");
const inputDescripcion = document.getElementById("txtDescripcion");
const btnAgregar = document.getElementById("btnAgregar");
const btnEliminar = document.getElementById("btnEliminar");
const btnModificar = document.getElementById("btnModificar");
const btnCancelar = document.getElementById("btnCancelar");

const inputRequeridos = document.querySelectorAll("input[required]"); // Selecciona todos los inputs requeridos

// Variables para manejar el modo de edición
let modoEdicion = false;
let categoriaIdEnEdicion = null;

// Validacion de los campos requeridos

function validarCamposRequeridos() {
    let error = false;
    for (const input of inputRequeridos) {
        if (input.value == "") {
            error = true;
        }
    }

    if (!error) {
        if (modoEdicion) {
            actualizarCategoria();
        } else {
            registrarCategoria();
        }
    }
}

// Guardar los datos en la base de datos
function registrarCategoria() {
    const data = {
        categoria: inputCategoria.value,
        descripcion: inputDescripcion.value
    };

    fetch("http://localhost:3000/categorias", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            console.log("No se puede registrar la categoria");
        } else {
            console.log("Categoria registrada exitosamente");
            limpiarFormulario();
            obtenerCategorias(); // Actualizar la tabla
        }
    }).catch(error => {
        console.error(error);
    });
}

// Función para actualizar una categoría
function actualizarCategoria() {
    const data = {
        categoria: inputCategoria.value,
        descripcion: inputDescripcion.value
    };

    fetch(`http://localhost:3000/categorias/${categoriaIdEnEdicion}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            console.log("No se puede actualizar la categoria");
        } else {
            console.log("Categoria actualizada exitosamente");
            cancelarEdicion();
            obtenerCategorias(); // Actualizar la tabla
        }
    }).catch(error => {
        console.error(error);
    });
}

const tablaCategorias = document.getElementById("tblCategorias").querySelector("tbody");

async function obtenerCategorias() {
    fetch("http://localhost:3000/categorias", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json())
        .then(data => {
            tablaCategorias.innerHTML = ""; // Limpiar la tabla antes de agregar los datos
            data.forEach(categoria => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                <td><input type="checkbox" data-id="${categoria._id}"></td>
                <td>${categoria.categoria}</td>
                <td>${categoria.descripcion || ''}</td>
                `;
                tablaCategorias.appendChild(fila);
            });
        })
}

// Llamada a la funcion para obtener las categorias
obtenerCategorias();

// Función para obtener las categorías seleccionadas
function obtenerCategoriasSeleccionadas() {
    const checkboxes = document.querySelectorAll('#tblCategorias input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.getAttribute('data-id'));
}

// Función para eliminar categorías
function eliminarCategorias() {
    const categoriasSeleccionadas = obtenerCategoriasSeleccionadas();
    
    if (categoriasSeleccionadas.length === 0) {
        alert("Por favor selecciona al menos una categoría para eliminar");
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar ${categoriasSeleccionadas.length} categoría(s)?`)) {
        const promesas = categoriasSeleccionadas.map(id => 
            fetch(`http://localhost:3000/categorias/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        );
        
        Promise.all(promesas)
            .then(() => {
                console.log("Categorías eliminadas exitosamente");
                obtenerCategorias(); // Actualizar la tabla
            })
            .catch(error => {
                console.error("Error al eliminar categorías:", error);
            });
    }
}

// Función para modificar una categoría
function modificarCategoria() {
    const categoriasSeleccionadas = obtenerCategoriasSeleccionadas();
    
    if (categoriasSeleccionadas.length === 0) {
        alert("Por favor selecciona una categoría para modificar");
        return;
    }
    
    if (categoriasSeleccionadas.length > 1) {
        alert("Por favor selecciona solo una categoría para modificar");
        return;
    }
    
    const categoriaId = categoriasSeleccionadas[0];
    
    // Obtener los datos de la categoría seleccionada
    fetch(`http://localhost:3000/categorias`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        const categoria = data.find(cat => cat._id === categoriaId);
        if (categoria) {
            // Llenar el formulario con los datos de la categoría
            inputCategoria.value = categoria.categoria;
            inputDescripcion.value = categoria.descripcion || '';
            
            // Activar modo edición
            modoEdicion = true;
            categoriaIdEnEdicion = categoriaId;
            btnAgregar.textContent = "Actualizar";
            
            // Desmarcar todos los checkboxes
            const checkboxes = document.querySelectorAll('#tblCategorias input[type="checkbox"]');
            checkboxes.forEach(checkbox => checkbox.checked = false);
        }
    })
    .catch(error => {
        console.error("Error al obtener la categoría:", error);
    });
}

// Función para cancelar la edición
function cancelarEdicion() {
    modoEdicion = false;
    categoriaIdEnEdicion = null;
    btnAgregar.textContent = "Agregar";
    limpiarFormulario();
}

// Función para limpiar el formulario
function limpiarFormulario() {
    inputCategoria.value = "";
    inputDescripcion.value = "";
    
    // Desmarcar todos los checkboxes
    const checkboxes = document.querySelectorAll('#tblCategorias input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
}

// Event listeners para los botones
btnAgregar.addEventListener("click", validarCamposRequeridos);
btnEliminar.addEventListener("click", eliminarCategorias);
btnModificar.addEventListener("click", modificarCategoria);
btnCancelar.addEventListener("click", cancelarEdicion);