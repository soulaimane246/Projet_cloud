// Application Express principale du service d'historique
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const express = require('express');
const connectDB = require('./config/db');
const { startConsumer } = require('./config/rabbitmq');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Connexion à la base de données
connectDB();

// Démarrer le consumer RabbitMQ
startConsumer();

// Routes
app.use('/', historyRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Lancer le serveur
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Service d'historique lancé sur le port ${PORT}`);
});

module.exports = app;
