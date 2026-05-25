const amqp = require('amqplib');

(async () => {
  try {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const ch = await conn.createChannel();
    const routingKey = 'task.events';
    const msg = JSON.stringify({ 
      type: 'task.updated',
      taskId: 'T123',
      projectId: 'P001',
      changedBy: 'test-user',
      timestamp: new Date().toISOString(),
      description: 'Test de publication RabbitMQ'
    });
    ch.publish('', routingKey, Buffer.from(msg));
    console.log('✅ Message publié:', msg);
    await ch.close();
    await conn.close();
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
})();
