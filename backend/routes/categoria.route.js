const express = require("express");
const router = express.Router();
const Categoria = require("../models/categoria.model");

// Ruta POST para crear una nueva categoría
router.post("/", async (req, res) => {
    const { categoria, activa } = req.body;

    // Validación de datos
    if (!categoria || typeof categoria !== "string") {
        return res.status(400).json({ msj: "El campo 'Nombre a agregar' es obligatorio" });
    }

    // Manejo de errores
    try {
        const nuevaCategoria = new Categoria({ categoria, activa });
        await nuevaCategoria.save();
        res.status(201).json({ msj: "Categoría creada exitosamente", categoria: nuevaCategoria }); // Categoria creada exitosamente
    } catch (error) {
        res.status(400).json({ msj: error.message }); // Error al crear la categoria
    }

});

// Ruta GET para obtener todas las categorías
router.get("/", async (req, res) => {

    try {
        const categorias = await Categoria.find();
        res.json(categorias); // Retorna todas las categorias
    } catch (error) {
        res.status(500).json({ msj: error.message }) // Error al obtener las categorias
    }

});

module.exports = router;

// Ruta DELETE para eliminar una categoría

// Ruta SET para actualizar el estado de una categoría