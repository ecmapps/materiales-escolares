async function cargarNiveles() {
  try {
    const response = await fetch('http://localhost:3000/api/niveles');
    if (!response.ok) throw new Error('Error al obtener los niveles');

    const niveles = await response.json();
    const tbody = document.querySelector('#tblNiveles tbody');
    tbody.innerHTML = '';

    niveles.forEach(nivel => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${nivel.nombre}</td>
        <td>${nivel.descripcion}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarNivel('${nivel._id}', '${nivel.nombre}', '${nivel.descripcion}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarNivel('${nivel._id}')">🗑️ Eliminar</button>
        </td>
      
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('No se pudo cargar la lista:', error);
  }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', cargarNiveles);

// Hacer accesible la función para otros scripts
window.cargarNiveles = cargarNiveles;

async function eliminarNivel(id) {
  if (!confirm('¿Seguro que quieres eliminar este nivel?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/niveles/${id}`,  {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Error al eliminar');
    alert('✅ Nivel eliminado correctamente');
    cargarNiveles();
  } catch (err) {
    console.error(err);
  }
}

// Función para editar
function editarNivel(id, nombreActual, descripcionActual) {
  const nombre = prompt('Nuevo nombre:', nombreActual);
  const descripcion = prompt('Nueva descripción:', descripcionActual);

  if (!nombre || !descripcion) {
    alert('Los campos no pueden quedar vacíos');
    return;
  }

  fetch(`http://localhost:3000/api/niveles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, descripcion })
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al actualizar');
      alert('✅ Nivel actualizado correctamente');
      cargarNiveles();
    })
    .catch(err => console.error(err));
}