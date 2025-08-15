document.addEventListener('DOMContentLoaded', function() {
    // Verificar que todos los elementos del DOM existan antes de inicializar
    if (!document.getElementById('formLista') || !document.getElementById('tblListas')) {
        console.error('Elementos críticos del DOM no encontrados');
        return;
    }

    initEvents();
    cargarListas();
});

function initEvents() {
    try {
        // Eventos para checkboxes de materiales
        const checkboxes = document.querySelectorAll('#materialesContainer input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const cantidadInput = this.closest('.row')?.querySelector('.cantidad-material');
                if (cantidadInput) {
                    cantidadInput.disabled = !this.checked;
                    if (!this.checked) cantidadInput.value = 1;
                }
            });
        });

        // Evento para guardar lista - versión más robusta
        const form = document.getElementById('formLista');
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            try {
                await guardarLista();
            } catch (error) {
                console.error('Error en submit:', error);
                mostrarAlerta('Error al procesar el formulario', 'danger');
            }
        });

    } catch (error) {
        console.error('Error inicializando eventos:', error);
    }
}

function obtenerMaterialesSeleccionados() {
    const materiales = [];
    try {
        document.querySelectorAll('#materialesContainer input[type="checkbox"]:checked').forEach(checkbox => {
            const cantidadInput = checkbox.closest('.row')?.querySelector('.cantidad-material');
            const cantidad = cantidadInput ? parseInt(cantidadInput.value) || 1 : 1;
            
            materiales.push({
                nombre: checkbox.value,
                cantidad: cantidad
            });
        });
    } catch (error) {
        console.error('Error obteniendo materiales:', error);
    }
    return materiales;
}

async function cargarListas() {
    const tbody = document.querySelector('#tblListas tbody');
    if (!tbody) return;

    try {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2 text-muted">Cargando listas...</p>
                </td>
            </tr>
        `;

        const response = await fetch('/api/listas');
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const listas = await response.json();

        if (!Array.isArray(listas)) {
            throw new Error('Formato de datos inválido');
        }

        renderizarListas(listas);
    } catch (error) {
        console.error('Error al cargar listas:', error);
        mostrarAlerta('Error al cargar listas: ' + error.message, 'danger');
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-danger py-4">
                    Error al cargar las listas
                </td>
            </tr>
        `;
    }
}

function renderizarListas(listas) {
    const tbody = document.querySelector('#tblListas tbody');
    if (!tbody) return;

    if (listas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    No hay listas disponibles
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = listas.map(lista => `
        <tr>
            <td>${escapeHTML(lista.nombre) || 'Sin nombre'}</td>
            <td>${escapeHTML(lista.nivelEducativo) || 'No especificado'}</td>
            <td>${lista.materiales?.map(m => `${escapeHTML(m.nombre)} (${m.cantidad})`).join(', ') || 'Sin materiales'}</td>
            <td>
                <button class="btn btn-sm btn-danger btn-eliminar" data-id="${lista._id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // Agregar eventos a botones eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', eliminarLista);
    });
}

async function guardarLista() {
    const nombreInput = document.getElementById('nombreLista');
    const nivelEducativoSelect = document.getElementById('nivelEducativo');
    
    if (!nombreInput || !nivelEducativoSelect) {
        mostrarAlerta('Error en el formulario', 'danger');
        return;
    }

    try {
        const nombre = nombreInput.value.trim();
        const nivelEducativo = nivelEducativoSelect.value;
        const materiales = obtenerMaterialesSeleccionados();

        // Validaciones mejoradas
        if (!nombre) {
            mostrarAlerta('El nombre de la lista es obligatorio', 'warning');
            nombreInput.focus();
            return;
        }

        if (!nivelEducativo) {
            mostrarAlerta('Seleccione un nivel educativo', 'warning');
            nivelEducativoSelect.focus();
            return;
        }

        if (materiales.length === 0) {
            mostrarAlerta('Seleccione al menos un material', 'warning');
            return;
        }

        // Mostrar carga durante el envío
        const submitBtn = document.getElementById('btnGuardarLista');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Guardando...
        `;

        const response = await fetch('/api/listas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre,
                nivelEducativo,
                materiales
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al guardar la lista');
        }

        const result = await response.json();
        console.log('Lista guardada:', result);

        // Cerrar modal y actualizar
        const modal = bootstrap.Modal.getInstance(document.getElementById('listaModal'));
        if (modal) modal.hide();
        
        document.getElementById('formLista').reset();
        mostrarAlerta('Lista guardada correctamente', 'success');
        await cargarListas();
        
    } catch (error) {
        console.error('Error al guardar lista:', error);
        mostrarAlerta('Error: ' + (error.message || 'Error desconocido'), 'danger');
    } finally {
        const submitBtn = document.getElementById('btnGuardarLista');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="bi bi-save"></i> Guardar Lista`;
        }
    }
}

async function eliminarLista(event) {
    if (!confirm('¿Está seguro de eliminar esta lista?')) return;

    const button = event.currentTarget;
    if (!button) return;

    try {
        const id = button.getAttribute('data-id');
        if (!id) throw new Error('ID no válido');

        button.disabled = true;
        button.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Eliminando...
        `;

        const response = await fetch(`/api/listas/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(await response.text() || 'Error al eliminar');
        }

        mostrarAlerta('Lista eliminada correctamente', 'success');
        await cargarListas();
    } catch (error) {
        console.error('Error al eliminar lista:', error);
        mostrarAlerta('Error: ' + (error.message || 'Error al eliminar'), 'danger');
    } finally {
        button.disabled = false;
        button.innerHTML = `<i class="bi bi-trash"></i> Eliminar`;
    }
}

function mostrarAlerta(mensaje, tipo = 'info') {
    let alerta = document.getElementById('alerta-flotante');
    if (!alerta) {
        alerta = document.createElement('div');
        alerta.id = 'alerta-flotante';
        alerta.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1100;
            min-width: 300px;
        `;
        document.body.appendChild(alerta);
    }
    
    alerta.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alerta.querySelector('.alert'));
        bsAlert.close();
    }, 5000);
}

// Función auxiliar para seguridad XSS
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}