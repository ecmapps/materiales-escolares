//require('dotenv').config({path:'env'});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); //Permite interpretar los datos que vienen en la peticion en formto json
//const rutasUsuarios = require(''); //folder de rutas
require('dotenv').config();

const aplicacion = express();

//Importacion de las rutas (*ASOCIADO)
// const usuarioRoute = require("./routes/usuario.route");
// const productoRoute = require("./routes/producto.route");
//const categoriaRoute = require("./routes/categoria.route");

// Middle
aplicacion.use(express.json());
aplicacion.use(bodyParser.urlencoded({extended:true}));
aplicacion.use(bodyParser.json());//Habilita el analisis de JSON en las peticiones 
aplicacion.use(cors());

//Conexion al Servidor
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log('MongoDB Atlas conectado'))
.catch(error => console.log('Ocurrio un error al conectarse con MongoDB: ', error));

//Rutas (*ASOCIADO)
// app.use("/usuarios", usuarioRoute);
// app.use("/productos", productoRoute);
//app.use("/categorias", categoriaRoute);

//Mensaje de conexione exitosa
aplicacion.get('/', (req,res)=> {
    res.send('Servidor en funcionamiento');
});

const PUERTO = process.env.PORT || 3000;
aplicacion.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});