document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("nivelForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const descripcion = document.getElementById("descripcion").value.trim();

            if (!nombre || !descripcion) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            try {
                const respuesta = await fetch('http://localhost:3000/api/niveles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, descripcion })
                });

                if (!respuesta.ok) {
                    const error = await respuesta.json();
                    throw new Error(error.msj || "Error al guardar");
                }

                alert("✅ Nivel educativo registrado con éxito.");
                form.reset();


                if (window.cargarNiveles) {
                    await window.cargarNiveles();
                }
            } catch (error) {
                console.error(" Error al enviar:", error.message);

            }
        });
    } else {
        console.error("Formulario con id 'nivelForm' no encontrado");
    }
});