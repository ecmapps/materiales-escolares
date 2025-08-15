const express = require("express");
const router = express.Router();
const Categoria = require("../models/categoria.model");

// Ruta POST para crear una nueva categoría
router.post("/", async (req, res) => {
    const { categoria, descripcion } = req.body;

    // Validación de datos
    if (!categoria || typeof categoria !== "string") {
        return res.status(400).json({ msj: "El campo 'Nombre a agregar' es obligatorio" });
    }

    // Manejo de errores
    try {
        const nuevaCategoria = new Categoria({ categoria, descripcion });
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

// Ruta DELETE para eliminar una categoría
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaEliminada = await Categoria.findByIdAndDelete(id);
        
        if (!categoriaEliminada) {
            return res.status(404).json({ msj: "Categoría no encontrada" });
        }
        
        res.json({ msj: "Categoría eliminada exitosamente", categoria: categoriaEliminada });
    } catch (error) {
        res.status(500).json({ msj: error.message });
    }
});

// Ruta PUT para actualizar una categoría
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, descripcion } = req.body;
        
        // Validación de datos
        if (!categoria || typeof categoria !== "string") {
            return res.status(400).json({ msj: "El campo 'categoria' es obligatorio" });
        }
        
        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            id, 
            { categoria, descripcion }, 
            { new: true, runValidators: true }
        );
        
        if (!categoriaActualizada) {
            return res.status(404).json({ msj: "Categoría no encontrada" });
        }
        
        res.json({ msj: "Categoría actualizada exitosamente", categoria: categoriaActualizada });
    } catch (error) {
        res.status(400).json({ msj: error.message });
    }
});

module.exports = router;