// Configuration de la connexion MongoDB pour le service de tâches
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error.message);
    // Retry après 5 secondes
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
