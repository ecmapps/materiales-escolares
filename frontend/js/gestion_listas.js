// Elementos del DOM
const inputNombreLista = document.getElementById("nombreLista");
const selectNivelEducativo = document.getElementById("nivelEducativo");
const btnGuardarLista = document.getElementById("btnGuardarLista");
const btnAgregarMaterial = document.getElementById("btnAgregarMaterial");
const btnCancelarLista = document.getElementById("btnCancelar");
const tablaListas = document.getElementById("tblListas")?.querySelector("tbody");

// Variables de estado
let modoEdicion = false;
let listaIdEnEdicion = null;
let listas = [];

// ==================== FUNCIONES PRINCIPALES ====================

// Validar campos requeridos
function validarCamposLista() {
    if (!inputNombreLista.value || !selectNivelEducativo.value) {
        alert("Por favor complete todos los campos requeridos");
        return false;
    }
    return true;
}

// Registrar nueva lista
async function registrarLista() {
    if (!validarCamposLista()) return;

    const materiales = obtenerMaterialesFormulario();
    const data = {
        nombre: inputNombreLista.value,
        nivelEducativo: selectNivelEducativo.value,
        materiales: materiales
    };

    try {
        const response = await fetch("http://localhost:3000/api/listas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al registrar");
        
        mostrarMensaje("Lista registrada exitosamente", "success");
        limpiarFormularioLista();
        obtenerListas();
    } catch (error) {
        mostrarMensaje("Error al registrar la lista", "error");
        console.error(error);
    }
}

// Actualizar lista existente
async function actualizarLista() {
    if (!validarCamposLista()) return;

    const materiales = obtenerMaterialesFormulario();
    const data = {
        nombre: inputNombreLista.value,
        nivelEducativo: selectNivelEducativo.value,
        materiales: materiales
    };

    try {
        const response = await fetch(`http://localhost:3000/api/listas/${listaIdEnEdicion}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al actualizar");
        
        mostrarMensaje("Lista actualizada exitosamente", "success");
        cancelarEdicionLista();
        obtenerListas();
    } catch (error) {
        mostrarMensaje("Error al actualizar la lista", "error");
        console.error(error);
    }
}

// Obtener todas las listas
async function obtenerListas() {
    try {
        const response = await fetch("http://localhost:3000/api/listas");
        if (!response.ok) throw new Error("Error al obtener listas");
        
        listas = await response.json();
        renderizarTablaListas();
    } catch (error) {
        mostrarMensaje("Error al cargar las listas", "error");
        console.error(error);
    }
}

// Renderizar tabla de listas
function renderizarTablaListas() {
    if (!tablaListas) return;

    tablaListas.innerHTML = listas.map(lista => `
        <tr>
            <td><input type="checkbox" data-id="${lista._id}"></td>
            <td>${lista.nombre}</td>
            <td>${lista.nivelEducativo?.nombre || 'No especificado'}</td>
            <td>${lista.materiales.length} materiales</td>
        </tr>
    `).join("");
}

    /**
     * Obtiene los materiales seleccionados en el formulario
     * @returns {string[]} Array con los nombres de los materiales seleccionados (ej: ["Lápiz", "Regla"])
     */
    function obtenerMaterialesFormulario() {
        return Array.from(
            document.querySelectorAll('#materialesContainer input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);
    }

    // --- Ejemplo de uso al enviar el formulario ---
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault(); // Evita el envío real para demostración
        
        const materiales = obtenerMaterialesFormulario();
        
        if (materiales.length === 0) {
            alert('⚠️ Selecciona al menos un material');
            return;
        }
        
        console.log('Materiales seleccionados:', materiales);
        // Aquí puedes agregar tu lógica de envío (AJAX, etc.)
    });

// Ejemplo de uso:
const materiales = obtenerMaterialesFormulario();
console.log(materiales); // ["Lápiz", "Regla", "Borrador", "Lapicero"]

// Obtener listas seleccionadas
function obtenerListasSeleccionadas() {
    const checkboxes = document.querySelectorAll('#tblListas input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(checkbox => checkbox.getAttribute('data-id'));
}

// Eliminar listas seleccionadas
async function eliminarListas() {
    const listasSeleccionadas = obtenerListasSeleccionadas();
    
    if (listasSeleccionadas.length === 0) {
        mostrarMensaje("Por favor seleccione al menos una lista", "warning");
        return;
    }
    
    if (!confirm(`¿Está seguro de eliminar ${listasSeleccionadas.length} lista(s)?`)) return;

    try {
        const resultados = await Promise.all(
            listasSeleccionadas.map(id => 
                fetch(`http://localhost:3000/api/listas/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                })
            )
        );

        const errores = resultados.filter(r => !r.ok);
        if (errores.length > 0) throw new Error("Algunas listas no se pudieron eliminar");
        
        mostrarMensaje("Listas eliminadas exitosamente", "success");
        obtenerListas();
    } catch (error) {
        mostrarMensaje("Error al eliminar listas", "error");
        console.error(error);
    }
}

// Modificar lista seleccionada
function modificarLista() {
    const listasSeleccionadas = obtenerListasSeleccionadas();
    
    if (listasSeleccionadas.length !== 1) {
        mostrarMensaje("Por favor seleccione UNA lista para modificar", "warning");
        return;
    }
    
    const listaId = listasSeleccionadas[0];
    const lista = listas.find(l => l._id === listaId);
    
    if (lista) {
        // Llenar formulario con datos de la lista
        inputNombreLista.value = lista.nombre;
        selectNivelEducativo.value = lista.nivelEducativo._id;
        // Llenar materiales
        
        modoEdicion = true;
        listaIdEnEdicion = listaId;
        btnGuardarLista.textContent = "Actualizar";
    }
}

// Cancelar edición
function cancelarEdicionLista() {
    modoEdicion = false;
    listaIdEnEdicion = null;
    btnGuardarLista.textContent = "Guardar";
    limpiarFormularioLista();
}

// Limpiar formulario
function limpiarFormularioLista() {
    inputNombreLista.value = "";
    selectNivelEducativo.value = "";
    // Limpiar materiales
}

// Mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo = "info") {
    // Implementar según tu sistema de notificaciones
    console.log(`${tipo.toUpperCase()}: ${mensaje}`);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", obtenerListas);
btnGuardarLista.addEventListener("click", () => {
    if (modoEdicion) actualizarLista();
    else registrarLista();
});
btnCancelarLista.addEventListener("click", cancelarEdicionLista);

// Implementar listeners para botones de eliminar/modificar según tu interfaz