# TeamTask - Plateforme de Gestion de Tâches en Équipe

TeamTask est une plateforme de gestion de tâches en équipe basée sur une **architecture microservices** avec Node.js, Express, MongoDB et RabbitMQ.

## 📋 Architecture Microservices

Le projet est composé de 4 services indépendants :

- **Auth Service** (Port 3000) : Gestion de l'authentification et des utilisateurs
- **Project Service** (Port 3001) : Gestion des projets
- **Task Service** (Port 3002) : Gestion des tâches
- **History Service** (Port 3003) : Historique des modifications de tâches

### Infrastructure

- **MongoDB** : 4 bases de données indépendantes (une par service)
- **RabbitMQ** : Communication asynchrone entre task-service et history-service

## 🚀 Démarrage du Projet

### Prérequis

- Docker et Docker Compose
- Node.js 18+ (pour développement local)

### Lancer l'ensemble du projet

```bash
docker-compose up --build
```

Cela va démarrer :
- RabbitMQ (port 5672, interface 15672)
- 4 instances MongoDB
- 4 services microservices

### Arrêter le projet

```bash
docker-compose down
```

## 📚 Scénario de Test Complet (avec Postman)

Suivez ces étapes dans l'ordre pour tester l'intégralité du flux :

### Étape 1 : Enregistrer un utilisateur Manager

**Endpoint** : `POST http://localhost:3000/api/auth/register`

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "name": "Alice Manager",
  "email": "alice@teamtask.com",
  "password": "password123",
  "role": "manager"
}
```

**Réponse** (sauvegarder le token) :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "650a1b2c3d4e5f6g7h8i9j0k",
    "name": "Alice Manager",
    "email": "alice@teamtask.com",
    "role": "manager"
  }
}
```

**Sauvegarde Postman** : Sauvegarder `manager_id` = `user.id` et `token_manager` = `token`

### Étape 2 : Enregistrer un utilisateur Member

**Endpoint** : `POST http://localhost:3000/api/auth/register`

**Body** :
```json
{
  "name": "Bob Member",
  "email": "bob@teamtask.com",
  "password": "password123",
  "role": "member"
}
```

**Réponse** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "650a1b2c3d4e5f6g7h8i9j0l",
    "name": "Bob Member",
    "email": "bob@teamtask.com",
    "role": "member"
  }
}
```

**Sauvegarde Postman** : Sauvegarder `member_id` = `user.id` et `token_member` = `token`

### Étape 3 : Se connecter en tant que Manager

**Endpoint** : `POST http://localhost:3000/api/auth/login`

**Body** :
```json
{
  "email": "alice@teamtask.com",
  "password": "password123"
}
```

**Réponse** : Vérifier que le token est identique

### Étape 4 : Se connecter en tant que Member

**Endpoint** : `POST http://localhost:3000/api/auth/login`

**Body** :
```json
{
  "email": "bob@teamtask.com",
  "password": "password123"
}
```

### Étape 5 : Créer un Projet (Manager)

**Endpoint** : `POST http://localhost:3001/api/projects`

**Headers** :
```
Authorization: Bearer {{token_manager}}
Content-Type: application/json
```

**Body** :
```json
{
  "name": "Refonte du Site Web",
  "description": "Refactorisation complète du site web existant",
  "deadline": "2026-12-31T23:59:59Z",
  "members": ["{{member_id}}"]
}
```

**Réponse** :
```json
{
  "message": "Projet créé avec succès",
  "project": {
    "_id": "650a1b2c3d4e5f6g7h8i9j0m",
    "name": "Refonte du Site Web",
    "description": "Refactorisation complète du site web existant",
    "deadline": "2026-12-31T23:59:59.000Z",
    "createdBy": "650a1b2c3d4e5f6g7h8i9j0k",
    "members": ["650a1b2c3d4e5f6g7h8i9j0l"],
    "createdAt": "2026-05-23T10:30:00.000Z"
  }
}
```

**Sauvegarde Postman** : Sauvegarder `project_id` = `project._id`

### Étape 6 : Créer une Tâche (Manager)

**Endpoint** : `POST http://localhost:3002/api/tasks`

**Headers** :
```
Authorization: Bearer {{token_manager}}
Content-Type: application/json
```

**Body** :
```json
{
  "title": "Concevoir la page d'accueil",
  "description": "Créer les maquettes et prototypes de la page d'accueil",
  "projectId": "{{project_id}}",
  "assignedTo": "{{member_id}}"
}
```

**Réponse** :
```json
{
  "message": "Tâche créée avec succès",
  "task": {
    "_id": "650a1b2c3d4e5f6g7h8i9j0n",
    "title": "Concevoir la page d'accueil",
    "description": "Créer les maquettes et prototypes de la page d'accueil",
    "projectId": "650a1b2c3d4e5f6g7h8i9j0m",
    "assignedTo": "650a1b2c3d4e5f6g7h8i9j0l",
    "status": "todo",
    "createdBy": "650a1b2c3d4e5f6g7h8i9j0k",
    "createdAt": "2026-05-23T10:35:00.000Z",
    "updatedAt": "2026-05-23T10:35:00.000Z"
  }
}
```

**Sauvegarde Postman** : Sauvegarder `task_id` = `task._id`

### Étape 7 : Changer le statut de la tâche en "in_progress" (Member)

**Endpoint** : `PATCH http://localhost:3002/api/tasks/{{task_id}}/status`

**Headers** :
```
Authorization: Bearer {{token_member}}
Content-Type: application/json
```

**Body** :
```json
{
  "status": "in_progress"
}
```

**Réponse** :
```json
{
  "message": "Statut de la tâche mis à jour",
  "task": {
    "_id": "650a1b2c3d4e5f6g7h8i9j0n",
    "title": "Concevoir la page d'accueil",
    "description": "Créer les maquettes et prototypes de la page d'accueil",
    "projectId": "650a1b2c3d4e5f6g7h8i9j0m",
    "assignedTo": "650a1b2c3d4e5f6g7h8i9j0l",
    "status": "in_progress",
    "createdBy": "650a1b2c3d4e5f6g7h8i9j0k",
    "createdAt": "2026-05-23T10:35:00.000Z",
    "updatedAt": "2026-05-23T10:40:00.000Z"
  }
}
```

**Note** : Un événement est publié dans RabbitMQ pour enregistrer ce changement

### Étape 8 : Changer le statut de la tâche en "done" (Member)

**Endpoint** : `PATCH http://localhost:3002/api/tasks/{{task_id}}/status`

**Headers** :
```
Authorization: Bearer {{token_member}}
Content-Type: application/json
```

**Body** :
```json
{
  "status": "done"
}
```

### Étape 9 : Récupérer l'historique de la tâche

**Endpoint** : `GET http://localhost:3003/api/history/task/{{task_id}}`

**Headers** :
```
Content-Type: application/json
```

**Réponse** : Devrait contenir 2 entrées (todo → in_progress, puis in_progress → done)

```json
{
  "history": [
    {
      "_id": "650a1b2c3d4e5f6g7h8i9j0p",
      "taskId": "650a1b2c3d4e5f6g7h8i9j0n",
      "projectId": "650a1b2c3d4e5f6g7h8i9j0m",
      "changedBy": "650a1b2c3d4e5f6g7h8i9j0l",
      "oldStatus": "todo",
      "newStatus": "in_progress",
      "timestamp": "2026-05-23T10:40:00.000Z"
    },
    {
      "_id": "650a1b2c3d4e5f6g7h8i9j0q",
      "taskId": "650a1b2c3d4e5f6g7h8i9j0n",
      "projectId": "650a1b2c3d4e5f6g7h8i9j0m",
      "changedBy": "650a1b2c3d4e5f6g7h8i9j0l",
      "oldStatus": "in_progress",
      "newStatus": "done",
      "timestamp": "2026-05-23T10:45:00.000Z"
    }
  ]
}
```

### Étape 10 : Récupérer les tâches assignées à l'utilisateur

**Endpoint** : `GET http://localhost:3002/api/tasks/user/{{member_id}}`

**Headers** :
```
Authorization: Bearer {{token_member}}
```

**Réponse** : Récupère toutes les tâches assignées à Bob

```json
{
  "tasks": [
    {
      "_id": "650a1b2c3d4e5f6g7h8i9j0n",
      "title": "Concevoir la page d'accueil",
      "description": "Créer les maquettes et prototypes de la page d'accueil",
      "projectId": "650a1b2c3d4e5f6g7h8i9j0m",
      "assignedTo": "650a1b2c3d4e5f6g7h8i9j0l",
      "status": "done",
      "createdBy": "650a1b2c3d4e5f6g7h8i9j0k",
      "createdAt": "2026-05-23T10:35:00.000Z",
      "updatedAt": "2026-05-23T10:45:00.000Z"
    }
  ]
}
```

## 🔐 Modèle de Sécurité

### Authentification
- **JWT (JSON Web Tokens)** avec secret partagé
- Token expirant après 7 jours
- Extrait du header `Authorization: Bearer <token>`

### Autorisation (Contrôle d'accès basé sur les rôles)

**Rôles** :
- `manager` : Peut créer/mettre à jour/supprimer projets et tâches
- `member` : Peut voir et mettre à jour le statut de ses tâches

**Restrictions par endpoint** :

| Endpoint | Manager | Member | Non-authentifié |
|----------|---------|--------|-----------------|
| POST /api/projects | ✅ | ❌ | ❌ |
| GET /api/projects | ✅ | ✅ | ❌ |
| POST /api/tasks | ✅ | ❌ | ❌ |
| PATCH /api/tasks/:id/status | ✅ (tout) | ✅ (assignée à lui) | ❌ |
| DELETE /api/tasks | ✅ | ❌ | ❌ |

## 🏗️ Architecture des Services

### 1. Auth Service (Authentification)

**Routes** :
- `POST /api/auth/register` : Enregistrement
- `POST /api/auth/login` : Connexion
- `GET /api/auth/me` : Profil utilisateur

**Modèle** : User (name, email, password, role, createdAt)

### 2. Project Service (Projets)

**Routes** :
- `POST /api/projects` : Créer un projet
- `GET /api/projects` : Lister tous les projets
- `GET /api/projects/:id` : Détails d'un projet
- `PUT /api/projects/:id` : Mettre à jour
- `DELETE /api/projects/:id` : Supprimer

**Modèle** : Project (name, description, deadline, createdBy, members, createdAt)

### 3. Task Service (Tâches)

**Routes** :
- `POST /api/tasks` : Créer une tâche
- `GET /api/tasks/project/:pid` : Tâches d'un projet
- `GET /api/tasks/user/:uid` : Tâches d'un utilisateur
- `PATCH /api/tasks/:id/status` : Changer le statut
- `DELETE /api/tasks/:id` : Supprimer

**Modèle** : Task (title, description, projectId, assignedTo, status, createdBy, createdAt, updatedAt)

**Événements RabbitMQ** (émis) :
```json
{
  "taskId": "...",
  "projectId": "...",
  "changedBy": "...",
  "oldStatus": "todo",
  "newStatus": "in_progress",
  "timestamp": "2026-05-23T10:40:00.000Z"
}
```

### 4. History Service (Historique)

**Routes** :
- `GET /api/history` : Tout l'historique
- `GET /api/history/task/:taskId` : Historique d'une tâche
- `GET /api/history/project/:pid` : Historique d'un projet

**Modèle** : History (taskId, projectId, changedBy, oldStatus, newStatus, timestamp)

**RabbitMQ** : Consomme les événements de task-service

## 📊 Flux de Communication

```
Client (Postman)
  ↓
┌─────────────────────────────────────────────────────┐
│                 Auth Service (3000)                 │
│  JWT → User Registration, Login, Profil            │
└────────────────────────┬────────────────────────────┘
                         │ JWT Validation
                         ↓
┌─────────────────────────────────────────────────────┐
│              Project Service (3001)                 │
│  Project CRUD (manager only)                        │
└────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│               Task Service (3002)                   │
│  Task CRUD, Status Update                          │
│  → Valide projet via REST (Project Service)        │
│  → Publie événement RabbitMQ                       │
└────────────────┬────────────────┬──────────────────┘
                 │                │
                 │ RabbitMQ       │ MongoDB (tasks)
                 │ task.events    │
                 ↓                │
┌──────────────────────────────────────────────────────┐
│              History Service (3003)                  │
│  Consomme événements RabbitMQ                       │
│  Sauvegarde l'historique des changements           │
│  ← MongoDB (history)                                │
└──────────────────────────────────────────────────────┘
```

## 🗄️ Bases de Données

Chaque service a sa propre instance MongoDB indépendante :

- **mongo-auth** : Collections User
- **mongo-projects** : Collections Project
- **mongo-tasks** : Collections Task
- **mongo-history** : Collections History

## 🔗 RabbitMQ (Message Queue)

**Queue** : `task.events` (durable)

**Message** :
```json
{
  "taskId": "...",
  "projectId": "...",
  "changedBy": "...",
  "oldStatus": "...",
  "newStatus": "...",
  "timestamp": "..."
}
```

**Flow** :
1. Task Service publie un événement quand le statut change
2. History Service le consomme et crée une entrée d'historique

## 🛠️ Développement Local

### Installer les dépendances

```bash
cd auth-service && npm install
cd ../project-service && npm install
cd ../task-service && npm install
cd ../history-service && npm install
```

### Lancer un service en développement

```bash
cd auth-service
npm run dev
```

Le serveur redémarrera automatiquement lors de modifications (nodemon)

### Variables d'environnement

Copier les fichiers `.env.example` en `.env` dans chaque service et adapter si nécessaire.

## 📝 Codes de Réponse HTTP

| Code | Description |
|------|-------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token absent ou invalide |
| 403 | Forbidden - Accès refusé (rôle insuffisant ou token expiré) |
| 404 | Not Found - Ressource inexistante |
| 500 | Internal Server Error - Erreur serveur |

## 🚦 Gestion des Erreurs

Tous les contrôleurs utilisent `try/catch` et retournent des réponses d'erreur au format JSON :

```json
{
  "error": "Description de l'erreur"
}
```

## 📦 Dépendances Principales

- **Express** : Framework web
- **Mongoose** : ODM MongoDB
- **JWT** : Authentification
- **bcryptjs** : Hashage des mots de passe
- **axios** : Appels HTTP inter-services
- **amqplib** : Client RabbitMQ
- **dotenv** : Variables d'environnement

## 🎯 Prochains Développements

- [ ] Websockets pour notifications en temps réel
- [ ] Cache Redis pour optimiser les requêtes
- [ ] Tests unitaires et d'intégration
- [ ] API Gateway avec Kong ou Traefik
- [ ] Monitoring avec Prometheus et Grafana
- [ ] Logging centralisé avec ELK Stack
- [ ] CI/CD avec GitHub Actions
- [ ] Documentation OpenAPI/Swagger

## 📄 Licence

ISC

## ✉️ Support

Pour toute question ou problème, veuillez créer une issue dans le référentiel.
