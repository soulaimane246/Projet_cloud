// Routes pour la gestion des projets
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// POST - Créer un nouveau projet (manager seulement)
router.post(
  '/api/projects',
  verifyToken,
  checkRole('manager'),
  projectController.createProject
);

// GET - Récupérer tous les projets
router.get('/api/projects', verifyToken, projectController.getAllProjects);

// GET - Récupérer un projet par ID
router.get('/api/projects/:id', verifyToken, projectController.getProjectById);

// PUT - Mettre à jour un projet (manager seulement)
router.put(
  '/api/projects/:id',
  verifyToken,
  checkRole('manager'),
  projectController.updateProject
);

// DELETE - Supprimer un projet (manager seulement)
router.delete(
  '/api/projects/:id',
  verifyToken,
  checkRole('manager'),
  projectController.deleteProject
);

module.exports = router;
