const mongoose = require('mongoose');

// Definición del esquema para la colección de categorías
const categoriaSchema = new mongoose.Schema({

    categoria: {
        type: String,
        required: true,
        unique: true,
    },
    descripcion: {
        type: String,
        required: false,
    }

});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;