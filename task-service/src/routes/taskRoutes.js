// Routes pour la gestion des tâches
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// POST - Créer une nouvelle tâche (manager seulement)
router.post(
  '/api/tasks',
  verifyToken,
  checkRole('manager'),
  taskController.createTask
);

// GET - Récupérer les tâches d'un projet
router.get(
  '/api/tasks/project/:pid',
  verifyToken,
  taskController.getTasksByProject
);

// GET - Récupérer les tâches d'un utilisateur
router.get(
  '/api/tasks/user/:uid',
  verifyToken,
  taskController.getTasksByUser
);

// PATCH - Mettre à jour le statut d'une tâche
router.patch(
  '/api/tasks/:id/status',
  verifyToken,
  taskController.updateTaskStatus
);

// DELETE - Supprimer une tâche (manager seulement)
router.delete(
  '/api/tasks/:id',
  verifyToken,
  checkRole('manager'),
  taskController.deleteTask
);

module.exports = router;
