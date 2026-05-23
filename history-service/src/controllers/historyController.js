// Contrôleur pour la récupération de l'historique
const History = require('../models/History');

// Récupérer tout l'historique
const getAllHistory = async (req, res) => {
  try {
    const history = await History.find().sort({ timestamp: -1 });

    res.status(200).json({
      history,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer l'historique d'une tâche
const getHistoryByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const history = await History.find({ taskId }).sort({ timestamp: -1 });

    res.status(200).json({
      history,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer l'historique d'un projet
const getHistoryByProject = async (req, res) => {
  try {
    const { pid } = req.params;

    const history = await History.find({ projectId: pid }).sort({
      timestamp: -1,
    });

    res.status(200).json({
      history,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllHistory,
  getHistoryByTask,
  getHistoryByProject,
};
