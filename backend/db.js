require('dotenv').config({path:'env'});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const rutasUsuarios = require(''); //folder de rutas

const aplicacion = express();

// Middle
aplicacion.use(express.json());
console.log('Valor de mongodbURL: '+ process.env.MONGODB_URI);
// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conexión exitosa a MongoDB'))
.catch(err => console.error('Error al conectar con MongoDB:', err));

// Manejo de errores
aplicacion.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    exito: false,
    mensaje: 'Error interno del servidor'
  });
});

const PUERTO = process.env.PORT || 3000;
aplicacion.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});