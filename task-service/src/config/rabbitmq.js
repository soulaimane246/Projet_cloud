// Configuration de RabbitMQ pour la communication asynchrone
const amqp = require('amqplib');

let channel;
let connectionPromise;

const connectRabbitMQ = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    if (connectionPromise) {
      return connectionPromise;
    }

    connectionPromise = amqp.connect(rabbitmqUrl).then(async (connection) => {
      channel = await connection.createChannel();

      // Déclarer la queue durable pour les événements de tâche
      await channel.assertQueue('task.events', { durable: true });

      console.log('RabbitMQ connecté et queue déclarée');
      return channel;
    });

    await connectionPromise;
  } catch (error) {
    connectionPromise = undefined;
    console.error('Erreur de connexion RabbitMQ:', error.message);
    // Retry après 5 secondes
    setTimeout(connectRabbitMQ, 5000);
  }
};

// Publier un événement dans la queue
const publishEvent = async (data) => {
  try {
    if (!channel && !connectionPromise) {
      await connectRabbitMQ();
    } else if (!channel && connectionPromise) {
      await connectionPromise;
    }

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
