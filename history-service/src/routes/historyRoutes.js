// Routes pour la récupération de l'historique
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const verifyToken = require('../middleware/verifyToken');

// GET - Récupérer tout l'historique
router.get('/api/history', verifyToken, historyController.getAllHistory);

// GET - Récupérer l'historique d'une tâche
router.get('/api/history/task/:taskId', verifyToken, historyController.getHistoryByTask);

// GET - Récupérer l'historique d'un projet
router.get('/api/history/project/:pid', verifyToken, historyController.getHistoryByProject);

module.exports = router;
