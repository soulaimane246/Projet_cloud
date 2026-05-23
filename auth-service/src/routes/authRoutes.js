// Routes pour l'authentification
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// POST - Enregistrer un nouvel utilisateur
router.post('/api/auth/register', authController.register);

// POST - Connexion utilisateur
router.post('/api/auth/login', authController.login);

// GET - Récupérer les infos de l'utilisateur connecté
router.get('/api/auth/me', verifyToken, authController.me);

module.exports = router;
