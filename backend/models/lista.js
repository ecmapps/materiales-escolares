const mongoose = require('mongoose');

const listaSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre de la lista es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  nivelEducativo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'NivelEducativo', 
    required: [true, 'El nivel educativo es requerido'] 
  },
  docente: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'El docente es requerido'] 
  },
  materiales: [{
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      required: [true, 'El material es requerido']
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es requerida'],
      min: [1, 'La cantidad mínima es 1']
    }
  }],
  estado: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validación para evitar listas duplicadas por docente
listaSchema.index({ nombre: 1, docente: 1 }, { unique: true });

// Populate automático para consultas
listaSchema.pre('find', function() {
  this.populate('nivelEducativo docente materiales.material');
});

module.exports = mongoose.model('Lista', listaSchema);