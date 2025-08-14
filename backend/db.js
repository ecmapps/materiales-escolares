//require('dotenv').config({path:'env'});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser'); //Permite interpretar los datos que vienen en la peticion en formto json
//const rutasUsuarios = require(''); //folder de rutas
require('dotenv').config();

const aplicacion = express();

//Importacion de las rutas (*ASOCIADO)
 const usuarioRoute = require("./routes/usuarios.route");
 const categoriaRoute = require("./routes/categoria.route");
 const listasRoute = require("./routes/lista.routes")
 const nivelesRoutes = require('./routes/nivelEducativo.route');

// Middle
aplicacion.use(express.json());
aplicacion.use(bodyParser.urlencoded({extended:true}));
aplicacion.use(bodyParser.json());//Habilita el analisis de JSON en las peticiones 
aplicacion.use(cors());
// aplicacion.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));

//Conexion al Servidor
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=> console.log('MongoDB Atlas conectado'))
.catch(error => console.log('Ocurrio un error al conectarse con MongoDB: ', error));

//Rutas (*ASOCIADO)
 aplicacion.use("/usuarios", usuarioRoute);
 aplicacion.use("/categorias", categoriaRoute);
 aplicacion.use("/api/listas", listasRoute);
 aplicacion.use('/api/niveles', nivelesRoutes);

//Mensaje de conexione exitosa
aplicacion.get('/', (req,res)=> {
    res.send('Servidor en funcionamiento');
});

const PUERTO = process.env.PORT || 3000;
aplicacion.listen(PUERTO, () => {
  console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
});