// Application Express principale du service de projets
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');

const app = express();

// Middlewares
app.use(express.json());

// Connexion à la base de données
connectDB();

// Routes
app.use('/', projectRoutes);

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Lancer le serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Service de projets lancé sur le port ${PORT}`);
});

module.exports = app;
