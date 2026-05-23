# 🚀 Guide de Configuration du Projet TeamTask

## Structure du Projet

```
teamtask/
├── auth-service/          # Service d'authentification
├── project-service/       # Service de projets
├── task-service/          # Service de tâches
├── history-service/       # Service d'historique
├── docker-compose.yml     # Configuration Docker
└── README.md             # Documentation
```

## 📋 Configuration Initiale

### 1. Variables d'Environnement Communes

Toutes les variables d'environnement sont définies dans le fichier `docker-compose.yml`.

Si vous lancez les services **en local** (sans Docker), vous devez créer un fichier `.env` dans chaque service.

### 2. Fichiers .env pour Chaque Service

#### auth-service/.env
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth
JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=7d
```

#### project-service/.env
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/projects
JWT_SECRET=supersecretkey123
```

#### task-service/.env
```
PORT=3002
MONGO_URI=mongodb://localhost:27017/tasks
JWT_SECRET=supersecretkey123
RABBITMQ_URL=amqp://localhost:5672
PROJECT_SERVICE_URL=http://localhost:3001
```

#### history-service/.env
```
PORT=3003
MONGO_URI=mongodb://localhost:27017/history
RABBITMQ_URL=amqp://localhost:5672
```

### 3. Démarrage avec Docker

```bash
# Construire et lancer tous les services
docker-compose up --build

# Lancer en arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f auth-service
```

### 4. Démarrage en Local (Développement)

#### Prérequis
- Node.js 18+
- MongoDB local
- RabbitMQ local (ou Docker)

#### Démarrer MongoDB (Docker)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6
```

#### Démarrer RabbitMQ (Docker)
```bash
docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq rabbitmq:3-management
```

#### Démarrer chaque service
```bash
# Terminal 1 - Auth Service
cd auth-service
npm install
npm run dev

# Terminal 2 - Project Service
cd project-service
npm install
npm run dev

# Terminal 3 - Task Service
cd task-service
npm install
npm run dev

# Terminal 4 - History Service
cd history-service
npm install
npm run dev
```

## 🔒 Sécurité

### JWT Secret

Le secret JWT doit être **identique** dans tous les services :
- `auth-service` : pour signer les tokens
- `project-service` : pour valider les tokens
- `task-service` : pour valider les tokens
- `history-service` : peut être vide (pas de validation JWT)

**⚠️ Important** : En production, utiliser un secret très long et aléatoire :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Communication Inter-Services

- **Task Service** appelle **Project Service** via HTTP pour vérifier les projets
- **Project Service** ne vérifie pas les tâches (pas d'appel inverse)
- **History Service** écoute **Task Service** via RabbitMQ

## 📊 Ports Utilisés

| Service | Port | Description |
|---------|------|-------------|
| Auth Service | 3000 | Authentification |
| Project Service | 3001 | Gestion des projets |
| Task Service | 3002 | Gestion des tâches |
| History Service | 3003 | Historique |
| MongoDB Auth | 27017 | Base de données auth |
| MongoDB Projects | 27018 | Base de données projects |
| MongoDB Tasks | 27019 | Base de données tasks |
| MongoDB History | 27020 | Base de données history |
| RabbitMQ | 5672 | Message broker |
| RabbitMQ Management | 15672 | Interface web |

## 🐛 Dépannage

### Les services ne se connectent pas à MongoDB

**Solution** :
```bash
# Vérifier que MongoDB est en cours d'exécution
docker ps | grep mongo

# Vérifier la connexion
mongosh mongodb://localhost:27017
```

### RabbitMQ ne démarre pas

**Solution** :
```bash
# Arrêter le conteneur RabbitMQ
docker stop rabbitmq

# Supprimer le conteneur
docker rm rabbitmq

# Relancer Docker Compose
docker-compose up
```

### Les tokens ne fonctionnent pas

**Vérifier** :
- ✅ Le JWT_SECRET est identique dans tous les services
- ✅ Le token n'a pas expiré
- ✅ Le header Authorization est au bon format : `Bearer <token>`

### L'historique n'est pas sauvegardé

**Vérifier** :
- ✅ RabbitMQ est en cours d'exécution
- ✅ History Service est en cours d'exécution
- ✅ Les logs ne montrent pas d'erreur

```bash
docker-compose logs history-service
```

## 📈 Scalabilité

### Pour mettre à l'échelle (Docker Swarm/Kubernetes)

1. **Utiliser un gestionnaire de configuration** (Consul, Etcd)
2. **Utiliser un API Gateway** (Kong, Traefik)
3. **Mettre en place du load balancing**
4. **Centraliser les logs** (ELK Stack, Loki)
5. **Ajouter du monitoring** (Prometheus, Grafana)

## 📚 Ressources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Docker Documentation](https://docs.docker.com/)

## ✅ Checklist Pré-Production

- [ ] Changer le JWT_SECRET par une valeur aléatoire
- [ ] Configurer les CORS pour les domaines de production
- [ ] Activer HTTPS/TLS
- [ ] Mettre en place le monitoring
- [ ] Configurer les sauvegardes MongoDB
- [ ] Activer la journalisation centralisée
- [ ] Tester la résilience et la récupération
- [ ] Documenter les procédures d'incident
- [ ] Mettre en place un CI/CD
