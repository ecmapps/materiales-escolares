const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true },
  descripcion: String,
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);