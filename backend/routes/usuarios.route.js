const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// Ruta de inicio de sesion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await Usuario.findOne({ email, password });
        if (!usuario || !usuario.activo) {
            return res.status(401).json({ message: 'Credenciales inválidas o usuario inactivo' });
        }
        // A futuro, establecer JWT aqui
        res.json({ message: 'Inicio de sesión exitoso', usuario });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Ruta de registro (para que el admin registre nuevos usuarios)
router.post('/register', async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    try {
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Email ya registrado' });
        }
        const nuevoUsuario = new Usuario({ nombre, email, password, rol });
        await nuevoUsuario.save();
        res.status(201).json(nuevoUsuario);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener todos los usuarios (para gestión)
router.get('/users', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Desactivar usuario
router.put('/users/:id/deactivate', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Editar usuario (ejemplo, expandir según sea necesario)
router.put('/users/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;