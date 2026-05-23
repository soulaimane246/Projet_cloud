# 📬 Tests API avec cURL

Ce fichier contient des exemples de commandes cURL pour tester l'API TeamTask.

## 🔐 Authentification

### 1. Enregistrer un utilisateur Manager

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Manager",
    "email": "alice@teamtask.com",
    "password": "password123",
    "role": "manager"
  }'
```

**Réponse** :
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

### 2. Enregistrer un utilisateur Member

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Member",
    "email": "bob@teamtask.com",
    "password": "password123",
    "role": "member"
  }'
```

### 3. Se connecter

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@teamtask.com",
    "password": "password123"
  }'
```

### 4. Récupérer le profil utilisateur

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📁 Gestion des Projets

### 1. Créer un projet (Manager)

```bash
curl -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Refonte du Site Web",
    "description": "Refactorisation complète du site web existant",
    "deadline": "2026-12-31T23:59:59Z",
    "members": ["650a1b2c3d4e5f6g7h8i9j0l"]
  }'
```

### 2. Récupérer tous les projets

```bash
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Récupérer un projet spécifique

```bash
curl -X GET http://localhost:3001/api/projects/650a1b2c3d4e5f6g7h8i9j0m \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Mettre à jour un projet (Manager)

```bash
curl -X PUT http://localhost:3001/api/projects/650a1b2c3d4e5f6g7h8i9j0m \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Refonte du Site Web - v2",
    "description": "Nouvelle version avec technologies modernes"
  }'
```

### 5. Supprimer un projet (Manager)

```bash
curl -X DELETE http://localhost:3001/api/projects/650a1b2c3d4e5f6g7h8i9j0m \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## ✅ Gestion des Tâches

### 1. Créer une tâche (Manager)

```bash
curl -X POST http://localhost:3002/api/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Concevoir la page d'\''accueil",
    "description": "Créer les maquettes et prototypes",
    "projectId": "650a1b2c3d4e5f6g7h8i9j0m",
    "assignedTo": "650a1b2c3d4e5f6g7h8i9j0l"
  }'
```

### 2. Récupérer les tâches d'un projet

```bash
curl -X GET http://localhost:3002/api/tasks/project/650a1b2c3d4e5f6g7h8i9j0m \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Récupérer les tâches d'un utilisateur

```bash
curl -X GET http://localhost:3002/api/tasks/user/650a1b2c3d4e5f6g7h8i9j0l \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Mettre à jour le statut d'une tâche

```bash
curl -X PATCH http://localhost:3002/api/tasks/650a1b2c3d4e5f6g7h8i9j0n/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

**Statuts disponibles** : `todo`, `in_progress`, `done`

### 5. Supprimer une tâche (Manager)

```bash
curl -X DELETE http://localhost:3002/api/tasks/650a1b2c3d4e5f6g7h8i9j0n \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 📜 Historique

### 1. Récupérer tout l'historique

```bash
curl -X GET http://localhost:3003/api/history
```

### 2. Récupérer l'historique d'une tâche

```bash
curl -X GET http://localhost:3003/api/history/task/650a1b2c3d4e5f6g7h8i9j0n
```

### 3. Récupérer l'historique d'un projet

```bash
curl -X GET http://localhost:3003/api/history/project/650a1b2c3d4e5f6g7h8i9j0m
```

## 🔧 Alias cURL Pratiques

Ajouter ces alias à votre `~/.bashrc` ou `~/.zshrc` pour simplifier les tests :

```bash
# Enregistrement
alias teamtask-register-manager='curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json"'
alias teamtask-register-member='curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json"'

# Connexion
alias teamtask-login='curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json"'

# Projets
alias teamtask-projects='curl -X GET http://localhost:3001/api/projects'
alias teamtask-create-project='curl -X POST http://localhost:3001/api/projects'

# Tâches
alias teamtask-tasks='curl -X GET http://localhost:3002/api/tasks'
alias teamtask-create-task='curl -X POST http://localhost:3002/api/tasks'

# Historique
alias teamtask-history='curl -X GET http://localhost:3003/api/history'
```

Utilisation :
```bash
teamtask-projects -H "Authorization: Bearer ..."
```

## 📊 Script de Test Complet

```bash
#!/bin/bash

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== TeamTask API Test ===${NC}"

# 1. Enregistrement Manager
echo -e "${BLUE}1. Enregistrement Manager...${NC}"
MANAGER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Manager",
    "email": "alice@test.com",
    "password": "password123",
    "role": "manager"
  }')

MANAGER_ID=$(echo $MANAGER_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
MANAGER_TOKEN=$(echo $MANAGER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Manager créé: $MANAGER_ID${NC}"

# 2. Enregistrement Member
echo -e "${BLUE}2. Enregistrement Member...${NC}"
MEMBER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Member",
    "email": "bob@test.com",
    "password": "password123",
    "role": "member"
  }')

MEMBER_ID=$(echo $MEMBER_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
MEMBER_TOKEN=$(echo $MEMBER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Member créé: $MEMBER_ID${NC}"

# 3. Créer un projet
echo -e "${BLUE}3. Création d'un projet...${NC}"
PROJECT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Projet de test",
    "members": ["'$MEMBER_ID'"]
  }')

PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Projet créé: $PROJECT_ID${NC}"

# 4. Créer une tâche
echo -e "${BLUE}4. Création d'une tâche...${NC}"
TASK_RESPONSE=$(curl -s -X POST http://localhost:3002/api/tasks \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "projectId": "'$PROJECT_ID'",
    "assignedTo": "'$MEMBER_ID'"
  }')

TASK_ID=$(echo $TASK_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Tâche créée: $TASK_ID${NC}"

# 5. Mettre à jour le statut
echo -e "${BLUE}5. Mise à jour du statut...${NC}"
curl -s -X PATCH http://localhost:3002/api/tasks/$TASK_ID/status \
  -H "Authorization: Bearer $MEMBER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}' > /dev/null
echo -e "${GREEN}✓ Statut mis à jour${NC}"

# 6. Récupérer l'historique
echo -e "${BLUE}6. Récupération de l'historique...${NC}"
HISTORY=$(curl -s -X GET http://localhost:3003/api/history/task/$TASK_ID)
COUNT=$(echo $HISTORY | grep -o '"taskId"' | wc -l)
echo -e "${GREEN}✓ Historique récupéré: $COUNT entrées${NC}"

echo -e "${GREEN}=== Test Complété ===${NC}"
```

Enregistrer le script en tant que `test-api.sh` et exécuter :
```bash
chmod +x test-api.sh
./test-api.sh
```

## ⚠️ Notes Importantes

- Remplacer les IDs et tokens par des valeurs réelles
- Les tokens expirent après 7 jours
- Les dates doivent être en format ISO 8601 : `YYYY-MM-DDTHH:MM:SSZ`
- Utiliser `-H "Content-Type: application/json"` pour les requêtes POST/PUT/PATCH
- Utiliser `-d @file.json` pour les payloads volumineux

## 🔍 Débogage

Ajouter `-v` pour voir les détails complets :
```bash
curl -v -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer ..."
```

Pour enregistrer la réponse dans un fichier :
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer ..." > response.json
```
