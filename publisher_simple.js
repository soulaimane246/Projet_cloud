const amqp = require('amqplib');

(async () => {
  try {
    const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
    const ch = await conn.createChannel();
    const routingKey = 'task.events';
    
    // Message avec exactement les champs requis
    const msg = JSON.stringify({ 
      taskId: 'TASK-999',
      projectId: 'PROJ-001',
      changedBy: 'admin-test'
    });
    
    ch.publish('', routingKey, Buffer.from(msg));
    console.log('✅ Message simple publié:', msg);
    
    await ch.close();
    await conn.close();
  } catch (err) {
    console.error('❌ Erreur:', err.message);
  }
})();
