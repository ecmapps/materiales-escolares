const express = require('express');
const router = express.Router();
const Lista = require('../models/lista');
const auth = require('../middleware/auth'); // Si usas autenticación

// Crear lista (POST)
router.post('/', auth, async (req, res) => {
  try {
    const lista = new Lista({
      ...req.body,
      creadoPor: req.usuario._id // Asigna el usuario logueado
    });
    await lista.save();
    res.status(201).send(lista);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtener todas las listas (GET)
router.get('/', async (req, res) => {
  try {
    const listas = await Lista.find().populate('materiales');
    res.send(listas);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;