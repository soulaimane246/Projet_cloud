// Configuration de RabbitMQ pour la communication asynchrone
const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Déclarer la queue durable pour les événements de tâche
    await channel.assertQueue('task.events', { durable: true });

    console.log('RabbitMQ connecté et queue déclarée');
  } catch (error) {
    console.error('Erreur de connexion RabbitMQ:', error.message);
    // Retry après 5 secondes
    setTimeout(connectRabbitMQ, 5000);
  }
};

// Publier un événement dans la queue
const publishEvent = async (data) => {
  try {
    if (!channel) {
      console.error('Channel RabbitMQ non disponible');
      return;
    }

    const message = JSON.stringify(data);
    channel.sendToQueue('task.events', Buffer.from(message), { persistent: true });
    console.log('Événement publié:', data);
  } catch (error) {
    console.error('Erreur lors de la publication d\'événement:', error.message);
  }
};

module.exports = {
  connectRabbitMQ,
  publishEvent,
};
