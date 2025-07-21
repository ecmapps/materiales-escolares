const mongoose = require('mongoose');

const listaSchema = new mongoose.Schema({
  nivelEducativo: { type: mongoose.Schema.Types.ObjectId, ref: 'NivelEducativo', required: true },
  docente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materiales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
  nombre: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Lista', listaSchema);