# ✅ Checklist d'Installation et de Vérification

Utilisez cette checklist pour vérifier que le projet TeamTask est correctement installé et configuré.

## 🔍 Pré-Installation

- [ ] **Docker installé** : `docker --version` retourne v20+
- [ ] **Docker Compose installé** : `docker-compose --version` retourne v1.29+
- [ ] **Git installé** : `git --version`
- [ ] **Node.js installé** (optionnel pour dev local) : `node --version` retourne v18+
- [ ] **Espace disque** : Au moins 2 GB disponibles
- [ ] **Ports disponibles** : 3000-3003, 5672, 15672, 27017-27020

### Vérifier les Ports

```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

## 📦 Installation

- [ ] Cloner ou télécharger le projet TeamTask
- [ ] Naviguer au répertoire racine
- [ ] Vérifier présence du fichier `docker-compose.yml`
- [ ] Vérifier présence des 4 répertoires de services

## 🚀 Lancement avec Docker

- [ ] Exécuter `docker-compose up --build`
- [ ] Attendre le message "Service d'authentification lancé sur le port 3000"
- [ ] Attendre le message "Service de projets lancé sur le port 3001"
- [ ] Attendre le message "Service de tâches lancé sur le port 3002"
- [ ] Attendre le message "Service d'historique lancé sur le port 3003"

### Vérifier RabbitMQ

```bash
docker-compose logs rabbitmq | grep "ready to accept"
```

## 🧪 Tests de Connectivité

### 1. Auth Service

```bash
curl http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123","role":"member"}'
```

✅ Doit retourner : `{"token":"...","user":{...}}`

- [ ] Endpoint accessible
- [ ] Response 201
- [ ] Token généré

### 2. Project Service

```bash
curl http://localhost:3001/api/projects
```

✅ Doit retourner : `{"error":"Token absent"}` (car pas d'auth)

- [ ] Endpoint accessible
- [ ] Response 401

### 3. Task Service

```bash
curl http://localhost:3002/api/tasks/project/test
```

✅ Doit retourner : `{"error":"Token absent"}`

- [ ] Endpoint accessible
- [ ] Response 401

### 4. History Service

```bash
curl http://localhost:3003/api/history
```

✅ Doit retourner : `{"history":[]}`

- [ ] Endpoint accessible
- [ ] Response 200

## 🗄️ Vérification des Bases de Données

### Vérifier MongoDB Auth

```bash
docker exec mongo-auth mongosh --eval "db.version()"
```

- [ ] MongoDB lancé
- [ ] Version 6.x

### Vérifier les Collections

```bash
docker exec mongo-auth mongosh --eval "db.users.find()"
```

- [ ] Collection accessibles

## 🐰 Vérification de RabbitMQ

### Interface de Gestion

Accéder à : http://localhost:15672

- [ ] Interface accessible
- [ ] Identifiants : guest/guest
- [ ] Queue `task.events` visible

### Vérifier la Queue

```bash
docker logs history-service | grep "consumer RabbitMQ démarré"
```

- [ ] Consumer enregistré

## 📝 Scénario de Test Complet

### Étape 1 : Enregistrement Manager

```bash
TOKEN_MANAGER=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Manager","email":"m@test.com","password":"123","role":"manager"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo $TOKEN_MANAGER
```

- [ ] Token généré et sauvegardé

### Étape 2 : Enregistrement Member

```bash
TOKEN_MEMBER=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Member","email":"m2@test.com","password":"123","role":"member"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

MEMBER_ID=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Member","email":"m3@test.com","password":"123","role":"member"}' \
  | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

echo $MEMBER_ID
```

- [ ] Member ID obtenu
- [ ] Token member généré

### Étape 3 : Créer un Projet

```bash
PROJECT_ID=$(curl -s -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer $TOKEN_MANAGER" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","members":["'$MEMBER_ID'"]}' \
  | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

echo $PROJECT_ID
```

- [ ] Project créé
- [ ] Project ID obtenu

### Étape 4 : Créer une Tâche

```bash
TASK_ID=$(curl -s -X POST http://localhost:3002/api/tasks \
  -H "Authorization: Bearer $TOKEN_MANAGER" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","projectId":"'$PROJECT_ID'","assignedTo":"'$MEMBER_ID'"}' \
  | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

echo $TASK_ID
```

- [ ] Tâche créée
- [ ] Task ID obtenu

### Étape 5 : Mettre à Jour le Statut

```bash
curl -X PATCH http://localhost:3002/api/tasks/$TASK_ID/status \
  -H "Authorization: Bearer $TOKEN_MEMBER" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

- [ ] Response 200
- [ ] Statut mis à jour

### Étape 6 : Vérifier l'Historique

```bash
sleep 2  # Attendre que RabbitMQ traite
curl http://localhost:3003/api/history/task/$TASK_ID
```

- [ ] Historique contient 1 entrée
- [ ] Transition todo → in_progress visible

## 🔐 Vérification de la Sécurité

### Tester l'Authentification

```bash
# Sans token
curl http://localhost:3001/api/projects
```

- [ ] Response 401 "Token absent"

### Tester l'Autorisation

```bash
# Essayer d'accéder avec un token member
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer $TOKEN_MEMBER" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

- [ ] Response 403 "rôle insuffisant"

## 📊 Logs et Monitoring

### Vérifier les Logs

```bash
# Tous les logs
docker-compose logs

# Log spécifique
docker-compose logs auth-service

# Logs en temps réel
docker-compose logs -f
```

- [ ] Pas d'erreurs critiques
- [ ] Tous les services "Ready"

### Vérifier les Conteneurs

```bash
docker-compose ps
```

✅ Tous les conteneurs doivent avoir le statut `Up`

- [ ] auth-service : Up
- [ ] project-service : Up
- [ ] task-service : Up
- [ ] history-service : Up
- [ ] rabbitmq : Up (healthy)
- [ ] mongo-auth : Up
- [ ] mongo-projects : Up
- [ ] mongo-tasks : Up
- [ ] mongo-history : Up

## 🧹 Nettoyage

### Arrêter tous les services

```bash
docker-compose down
```

- [ ] Commande exécutée sans erreur

### Supprimer les volumes (optional)

```bash
docker-compose down -v
```

- [ ] Les données MongoDB sont supprimées

### Supprimer les images

```bash
docker-compose down -v --rmi all
```

- [ ] Les images Docker sont supprimées

## 📈 Performance (Optionnel)

### Benchmark de latence

```bash
# Créer 100 tâches
for i in {1..100}; do
  curl -X POST http://localhost:3002/api/tasks \
    -H "Authorization: Bearer $TOKEN_MANAGER" \
    -H "Content-Type: application/json" \
    -d '{"title":"Task'$i'","projectId":"'$PROJECT_ID'"}'
done
```

- [ ] Aucune erreur
- [ ] Temps < 50ms par requête

## ✅ Résumé

Une fois toutes les cases cochées :

✅ **Installation réussie**
✅ **Services actifs**
✅ **Bases de données fonctionnelles**
✅ **Communication inter-services fonctionnelle**
✅ **Sécurité en place**
✅ **Prêt pour la production**

## 🆘 Troubleshooting

| Erreur | Solution |
|--------|----------|
| "Port already in use" | Arrêter les services actifs sur ces ports |
| "Cannot connect to Docker daemon" | Vérifier que Docker est lancé |
| "No space left on device" | Nettoyer les conteneurs : `docker system prune` |
| "Connection refused" | Attendre quelques secondes, les services peuvent prendre du temps |
| "Authentication failed" | Vérifier le JWT_SECRET dans les .env |

## 📞 Ressources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [README.md](README.md) - Documentation complète
