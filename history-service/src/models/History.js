// Modèle d'historique
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  changedBy: {
    type: String,
    required: true,
  },
  oldStatus: {
    type: String,
  },
  newStatus: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', historySchema);
