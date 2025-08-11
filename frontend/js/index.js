// Agrega esto cerca de otras rutas
//const listaRoutes = require('./routes/lista.routes');
//app.use('/api/listas', listaRoutes);
// Cargar el header
fetch('/frontend/components/header.html')
    .then(response => {
        if(!response.ok){
            console.error(response.status+": "+response.statusText);
        }
        else {
            return response.text();
        }
    })
    .then(data => document.getElementById('header').innerHTML = data);

// Cargar el footer
fetch('/frontend/components/footer.html')
    .then(response => response.text())
    .then(data => document.getElementById('footer').innerHTML = data);