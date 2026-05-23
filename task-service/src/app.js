// Application Express principale du service de tâches
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Connexion à la base de données
connectDB();

// Connexion à RabbitMQ
connectRabbitMQ();

// Routes
app.use('/', taskRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Lancer le serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Service de tâches lancé sur le port ${PORT}`);
});

module.exports = app;
