const mongoose = require('mongoose');

const nivelEducativoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: String,
}, { timestamps: true });

module.exports = mongoose.model('NivelEducativo', nivelEducativoSchema);