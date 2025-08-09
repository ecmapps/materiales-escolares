require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const aplicacion = express();
const nivelesRoutes = require('./routes/nivelEducativo.route');
// Importación de rutas
// const usuarioRoute = require("./routes/usuario.route");
// const productoRoute = require("./routes/producto.route");
const nivelEducativoRoute = require("./routes/nivelEducativo.route");

const app = express(); // Usamos 'app' para mayor consistencia

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Atlas conectado'))
.catch(error => console.log('❌ Error al conectar con MongoDB: ', error));

// Rutas
// app.use("/usuarios", usuarioRoute);
// app.use("/productos", productoRoute);
app.use('/api/niveles', nivelesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor en funcionamiento 🚀');
});

// Puerto
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});

// proyecto real
