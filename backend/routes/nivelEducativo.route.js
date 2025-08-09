const express = require('express');
const router = express.Router();
const NivelEducativo = require('../models/nivelEducativo');



// POST
router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ msj: "Todos los campos son obligatorios" });
  }

  try {
    const nuevoNivel = new NivelEducativo({ nombre, descripcion });
    const nivelGuardado = await nuevoNivel.save();
    res.status(201).json(nivelGuardado);
  } catch (error) {
    res.status(400).json({ msj: error.message });
  }
});

// GET
router.get("/", async (req, res) => {
  try {
    const niveles = await NivelEducativo.find();
    res.json(niveles);
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});


router.put("/:id", async (req, res) => {
    console.log("ID recibido:", req.params.id);
  console.log("Body recibido:", req.body);
  const { nombre, descripcion } = req.body;
  if (!nombre || !descripcion) {
    return res.status(400).json({ msj: "Todos los campos son obligatorios" });
  }
  try {
    const nivel = await NivelEducativo.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion },
      { new: true }
    );
    res.json(nivel);
  } catch (error) {
    res.status(400).json({ msj: error.message });
  }
});

// DELETE - eliminar nivel
router.delete("/:id", async (req, res) => {
  try {
    await NivelEducativo.findByIdAndDelete(req.params.id);
    res.json({ msj: "Nivel eliminado" });
  } catch (error) {
    res.status(500).json({ msj: error.message });
  }
});

module.exports = router;
