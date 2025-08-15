const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    unidadmedida: {
        type: String,
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Material', materialSchema);