// Configuration de RabbitMQ pour la consommation des événements
const amqp = require('amqplib');
const History = require('../models/History');

let channel;

const startConsumer = async () => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    const connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    // Déclarer la queue durable pour les événements de tâche
    await channel.assertQueue('task.events', { durable: true });

    console.log('Consumer RabbitMQ démarré, en attente de messages...');

    // Consommer les messages
    channel.consume('task.events', async (msg) => {
      try {
        if (msg) {
          const data = JSON.parse(msg.content.toString());

          // Créer une entrée d'historique
          const history = new History(data);
          await history.save();

          console.log('Événement sauvegardé dans l\'historique:', data);

          // Reconnaître le message
          channel.ack(msg);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message:', error.message);
        // Rejeter le message et le remettre dans la queue
        channel.nack(msg, false, true);
      }
    });
  } catch (error) {
    console.error('Erreur du consumer RabbitMQ:', error.message);
    // Retry après 5 secondes
    setTimeout(startConsumer, 5000);
  }
};

module.exports = {
  startConsumer,
};
