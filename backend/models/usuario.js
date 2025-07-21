const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'docente', 'padre'], required: true },
  nombre: { type: String, required: true },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);