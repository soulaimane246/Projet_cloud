# ⚡ Démarrage Rapide TeamTask

## 📋 Vue d'Ensemble

TeamTask est une plateforme de gestion de tâches en équipe basée sur une architecture **microservices**. Le projet contient 4 services Node.js/Express indépendants, chacun avec sa propre base de données MongoDB, et utilise RabbitMQ pour la communication asynchrone.

## 🚀 Démarrage en 5 Minutes

### 1. Cloner/Télécharger le projet

```bash
cd teamtask
```

### 2. Lancer avec Docker Compose

```bash
docker-compose up --build
```

✅ Services lancés :
- Auth Service sur `http://localhost:3000`
- Project Service sur `http://localhost:3001`
- Task Service sur `http://localhost:3002`
- History Service sur `http://localhost:3003`

### 3. Tester avec Postman

1. Importer la collection Postman (voir POSTMAN.md)
2. Suivre le scénario de test étape par étape
3. Vérifier les variables d'environnement sont mises à jour

## 📚 Documentation

| Document | Contenu |
|----------|---------|
| [README.md](README.md) | Documentation complète et scénario Postman |
| [SETUP.md](SETUP.md) | Configuration et déploiement |
| [POSTMAN.md](POSTMAN.md) | Guide Postman détaillé |
| [CURL_TESTS.md](CURL_TESTS.md) | Exemples de tests avec cURL |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Patterns et design |

## 🏗️ Structure

```
teamtask/
├── auth-service/          # Authentification (port 3000)
├── project-service/       # Projets (port 3001)
├── task-service/          # Tâches (port 3002)
├── history-service/       # Historique (port 3003)
├── docker-compose.yml     # Orchestration
└── *.md                   # Documentation
```

## 🔧 Commandes Essentielles

### Docker

```bash
# Lancer tous les services
docker-compose up

# Lancer en arrière-plan
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f auth-service

# Reconstruire
docker-compose up --build
```

### Développement Local

```bash
# Terminal 1 - Auth Service
cd auth-service && npm install && npm run dev

# Terminal 2 - Project Service
cd project-service && npm install && npm run dev

# Terminal 3 - Task Service
cd task-service && npm install && npm run dev

# Terminal 4 - History Service
cd history-service && npm install && npm run dev
```

## 📝 Scénario de Test Rapide

### 1. Enregistrement

```bash
# Manager
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"123","role":"manager"}'

# Member
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob","email":"bob@test.com","password":"123","role":"member"}'
```

### 2. Créer un Projet

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer TOKEN_MANAGER" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Test"}'
```

### 3. Créer une Tâche

```bash
curl -X POST http://localhost:3002/api/tasks \
  -H "Authorization: Bearer TOKEN_MANAGER" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","projectId":"PROJECT_ID","assignedTo":"MEMBER_ID"}'
```

### 4. Mettre à Jour le Statut

```bash
curl -X PATCH http://localhost:3002/api/tasks/TASK_ID/status \
  -H "Authorization: Bearer TOKEN_MEMBER" \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

### 5. Voir l'Historique

```bash
curl http://localhost:3003/api/history/task/TASK_ID
```

## 🔑 Points Importants

### Variables d'Environnement

Chaque service utilise un fichier `.env` (voir `.env.example` dans chaque service).

**JWT_SECRET** doit être **identique** dans tous les services !

### Ports

| Service | Port |
|---------|------|
| Auth | 3000 |
| Project | 3001 |
| Task | 3002 |
| History | 3003 |

### Authentification

- Tous les endpoints (sauf `/api/auth/register` et `/api/auth/login`) nécessitent un token JWT
- Format : `Authorization: Bearer <token>`
- Rôles : `manager` (accès complet) ou `member` (accès limité)

## 🐛 Dépannage Courant

| Problème | Solution |
|----------|----------|
| Port 3000 déjà utilisé | `lsof -i :3000` et tuer le processus |
| MongoDB ne démarre pas | Vérifier Docker : `docker ps` |
| Token invalide | Vérifier JWT_SECRET est identique partout |
| RabbitMQ ne démarre pas | Arrêter et relancer : `docker-compose down && docker-compose up` |

## 📞 Support

Voir les documentations détaillées :
- **Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)
- **Configuration** → [SETUP.md](SETUP.md)
- **Tests Postman** → [POSTMAN.md](POSTMAN.md)
- **Tests cURL** → [CURL_TESTS.md](CURL_TESTS.md)
- **Documentation complète** → [README.md](README.md)

## ✅ Checklist Pré-Production

- [ ] Changer JWT_SECRET
- [ ] Configurer CORS
- [ ] Activer HTTPS
- [ ] Mettre en place le monitoring
- [ ] Sauvegardes MongoDB activées
- [ ] Logs centralisés
- [ ] Tests d'intégration
- [ ] Documentation de déploiement
