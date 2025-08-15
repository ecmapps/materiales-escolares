const express = require('express');
const router = express.Router();
const Lista = require('../models/lista');
const auth = require('../middleware/auth'); // Asumiendo que tienes este middleware

// Middleware de validación mejorado
const validarLista = (req, res, next) => {
  const { nombre, nivelEducativo, materiales } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' });
  }
  
  if (!nivelEducativo) {
    return res.status(400).json({ error: 'El nivel educativo es requerido' });
  }
  
  if (!materiales || materiales.length === 0) {
    return res.status(400).json({ error: 'Debe seleccionar al menos un material' });
  }
  
  next();
};

// Crear lista (POST) - Ahora protegida
router.post('/', auth, validarLista, async (req, res) => {
  try {
    const lista = new Lista({
      ...req.body,
      docente: req.usuario._id
    });

    await lista.save();
    
    const listaConDatos = await Lista.findById(lista._id)
      .populate('nivelEducativo docente materiales.material');

    res.status(201).json(listaConDatos);
    
  } catch (error) {
    // Manejo de errores mejorado
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(el => el.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Ya existe una lista con este nombre para este docente'
      });
    }
    
    console.error('Error al crear lista:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todas las listas (GET)
router.get('/', async (req, res) => {
  try {
    const listas = await Lista.find()
      .populate('nivelEducativo docente materiales.material');
    
    res.json(listas || []);
    
  } catch (error) {
    console.error('Error al obtener listas:', error);
    res.status(500).json({ error: 'Error al recuperar las listas' });
  }
});

module.exports = router;