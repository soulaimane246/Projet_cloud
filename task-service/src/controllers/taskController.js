// Contrôleur pour la gestion des tâches
const Task = require('../models/Task');
const axios = require('axios');
const { publishEvent } = require('../config/rabbitmq');

// Créer une nouvelle tâche
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo } = req.body;

    // Vérifier que le projet existe via REST API
    try {
      const projectServiceUrl = process.env.PROJECT_SERVICE_URL;
      const token = req.headers.authorization;

      await axios.get(`${projectServiceUrl}/api/projects/${projectId}`, {
        headers: { Authorization: token },
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'Projet introuvable' });
      }
      throw error;
    }

    const task = new Task({
      title,
      description,
      projectId,
      assignedTo,
      createdBy: req.user.id,
    });

    await task.save();

    res.status(201).json({
      message: 'Tâche créée avec succès',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les tâches d'un projet
const getTasksByProject = async (req, res) => {
  try {
    const { pid } = req.params;

    const tasks = await Task.find({ projectId: pid });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les tâches assignées à un utilisateur
const getTasksByUser = async (req, res) => {
  try {
    const { uid } = req.params;

    const tasks = await Task.find({ assignedTo: uid });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour le statut d'une tâche
const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Récupérer la tâche
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    // Vérifier les droits : manager OU assignedTo === req.user.id
    if (req.user.role !== 'manager' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé : droits insuffisants' });
    }

    // Vérifier que le projet existe via REST API
    try {
      const projectServiceUrl = process.env.PROJECT_SERVICE_URL;
      const token = req.headers.authorization;

      await axios.get(
        `${projectServiceUrl}/api/projects/${task.projectId}`,
        {
          headers: { Authorization: token },
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ error: 'Projet introuvable' });
      }
      throw error;
    }

    // Sauvegarder le statut précédent
    const oldStatus = task.status;

    // Mettre à jour la tâche
    task.status = status;
    task.updatedAt = Date.now();
    await task.save();

    // Publier l'événement dans RabbitMQ
    await publishEvent({
      taskId: task._id,
      projectId: task.projectId,
      changedBy: req.user.id,
      oldStatus,
      newStatus: status,
      timestamp: new Date(),
    });

    res.status(200).json({
      message: 'Statut de la tâche mis à jour',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une tâche
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    res.status(200).json({
      message: 'Tâche supprimée avec succès',
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTasksByUser,
  updateTaskStatus,
  deleteTask,
};
