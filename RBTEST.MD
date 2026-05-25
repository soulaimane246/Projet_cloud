Test rapide RabbitMQ — TeamTask
But: donner des étapes simples et reproductibles pour vérifier que RabbitMQ fonctionne et que le service `history-service` consomme bien les événements `task.events`.
Pré-requis
Docker & Docker Compose
Accès à l'interface de management RabbitMQ (par défaut http://localhost:15672)
Identifiants RabbitMQ (ex : `guest:guest`) ou ceux définis dans vos `.env`
1) Démarrer les services
Lancer en arrière-plan :
```bash
docker-compose up --build -d
```
Vérifier que RabbitMQ et les services sont up :
```bash
docker ps --filter "publish=5672" --filter "publish=15672"
docker-compose logs -f rabbitmq
docker-compose logs -f history-service
```
2) Vérifier la présence de la queue `task.events`
Utiliser l'API Management (remplacez les credentials si besoin) :
```bash
curl -u guest:guest http://localhost:15672/api/queues
curl -u guest:guest http://localhost:15672/api/queues/%2F/task.events
```
Le second appel retourne un objet JSON avec `messages` (nombre de messages non consommés).
3) Publier un message de test
Option A — via l'API Management :
```bash
curl -u guest:guest -H "Content-Type: application/json" -X POST \
  -d '{"properties":{},"routing_key":"task.events","payload":"{\"type\":\"test\",\"taskId\":\"T123\"}","payload_encoding":"string"}' \
  http://localhost:15672/api/exchanges/%2F/amq.default/publish
```
Option B — depuis le container (rabbitmqadmin) :
```bash
docker exec -it <rabbit_container_name> rabbitmqadmin publish routing_key=task.events payload='{"type":"test","taskId":"T123"}'
```
Option C — script Node (exécuter depuis votre machine)
```javascript
// publisher.js
const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
  const ch = await conn.createChannel();
  const routingKey = 'task.events';
  const msg = JSON.stringify({ type: 'test', taskId: 'T123' });
  ch.publish('', routingKey, Buffer.from(msg));
  console.log('Message publié:', msg);
  await ch.close();
  await conn.close();
})();
```
Installer dépendance si nécessaire :
```bash
npm install amqplib
node publisher.js
```
4) Vérifier que le message est consommé par `history-service`
Surveiller le nombre de messages dans la queue :
```bash
curl -u guest:guest http://localhost:15672/api/queues/%2F/task.events | jq '.messages'
```
Surveiller les logs du service d'historique pour voir la consommation :
```bash
docker-compose logs -f history-service
# ou
docker logs -f <history_container_name>
```
Cherchez des lignes contenant `Événement sauvegardé`, `Saved event`, `Consumed` ou tout log que vous avez défini dans `history-service`.
5) Vérification optionnelle via rabbitmqctl
```bash
docker exec -it <rabbit_container_name> /bin/sh
rabbitmqctl list_queues
rabbitmqctl list_bindings
```
Remarques
Remplacez `guest:guest` et `<rabbit_container_name>` par vos valeurs réelles définies dans l'environnement ou `docker-compose.yml`.
Si votre projet utilise un vhost personnalisé, encodez-le dans les URLs (par exemple `/` => `%2F`).
Ce guide est volontairement court : pour une démonstration complète, suivez l'ordre des tests du fichier `TESTS_DEMONSTRATION.md`.
---
Fichier créé automatiquement pour aider les tests RabbitMQ.