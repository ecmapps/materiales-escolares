const express = require("express");
const router = express.Router();
const Materiales = require("../models/materiales.model");

//POST
router.post("/", async (req, res) => {
    const { producto, descripcion, unidadmedida } = req.body;

    if (!producto || !descripcion || !unidadmedida) {
        return res.status(400).json({ msj: "Todos los campos son obligatorios" });
    }

    try {
        const nuevoMateriales = new Materiales({ producto, descripcion, unidadmedida });
        await nuevoMateriales.save();
        res.status(201).json(nuevoMateriales);
    } catch (error) {
        res.status(400).json({ msj: error.message });
    }
});

router.get("/", async (req, res) => {

    try {
        const materiales = await Materiales.find();
        res.json(materiales);
    } catch (error) {
        res.status(500).json({ msj: error.message })
    }
});

module.exports = router;
