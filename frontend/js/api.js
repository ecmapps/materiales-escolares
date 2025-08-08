document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:3000/api/usuarios';
    const registroForm = document.getElementById('registroForm');
    const mensajeDiv = document.getElementById('mensaje');
    const listaUsuarios = document.getElementById('listaUsuarios');

    // Manejar el envío del formulario
    registroForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            identificador: document.getElementById('identificador').value,
            correoElectronico: document.getElementById('correoElectronico').value,
            nombreCompleto: document.getElementById('nombreCompleto').value,
            claveAcceso: document.getElementById('claveAcceso').value
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                mostrarMensaje('Usuario registrado exitosamente', 'success');
                registroForm.reset();
                cargarUsuarios();
            } else {
                mostrarMensaje(data.mensaje || 'Error al registrar usuario', 'danger');
            }
        } catch (error) {
            mostrarMensaje('Error de conexión: ' + error.message, 'danger');
        }
    });

    // Función para mostrar mensajes
    function mostrarMensaje(texto, tipo) {
        mensajeDiv.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${texto}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Función para cargar y mostrar usuarios
    async function cargarUsuarios() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (response.ok) {
                if (data.datos && data.datos.length > 0) {
                    listaUsuarios.innerHTML = `
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Correo</th>
                                        <th>Fecha Registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.datos.map(usuario => `
                                        <tr>
                                            <td>${usuario.identificador}</td>
                                            <td>${usuario.nombreCompleto}</td>
                                            <td>${usuario.correoElectronico}</td>
                                            <td>${new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    listaUsuarios.innerHTML = '<p>No hay usuarios registrados</p>';
                }
            } else {
                listaUsuarios.innerHTML = '<p>Error al cargar usuarios</p>';
            }
        } catch (error) {
            listaUsuarios.innerHTML = '<p>Error de conexión</p>';
        }
    }

    // Cargar usuarios al iniciar
    cargarUsuarios();
});