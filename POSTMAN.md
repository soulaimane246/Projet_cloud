# 📮 Guide Postman pour TeamTask

Ce guide explique comment configurer Postman pour tester facilement l'API TeamTask.

## 🚀 Installation de Postman

1. Télécharger Postman : https://www.postman.com/downloads/
2. Installer et lancer l'application
3. Créer un compte ou utiliser en mode offline

## 📂 Organisation de la Collection

### Structure recommandée

```
TeamTask
├── 🔐 Authentication
│   ├── Register Manager
│   ├── Register Member
│   ├── Login Manager
│   ├── Login Member
│   └── Get Current User
├── 📁 Projects
│   ├── Create Project
│   ├── Get All Projects
│   ├── Get Project by ID
│   ├── Update Project
│   └── Delete Project
├── ✅ Tasks
│   ├── Create Task
│   ├── Get Tasks by Project
│   ├── Get Tasks by User
│   ├── Update Task Status
│   └── Delete Task
└── 📜 History
    ├── Get All History
    ├── Get History by Task
    └── Get History by Project
```

## 🔧 Variables d'Environnement Postman

### Créer un Environnement

1. Cliquer sur **Environments** (icône d'engrenage)
2. Cliquer sur **Create**
3. Nommer l'environnement : `TeamTask Local`
4. Ajouter les variables suivantes :

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost` | `http://localhost` |
| `auth_port` | `3000` | `3000` |
| `project_port` | `3001` | `3001` |
| `task_port` | `3002` | `3002` |
| `history_port` | `3003` | `3003` |
| `token_manager` | `` | `` |
| `token_member` | `` | `` |
| `manager_id` | `` | `` |
| `member_id` | `` | `` |
| `project_id` | `` | `` |
| `task_id` | `` | `` |

### Utiliser les variables

Dans les URLs et headers, utiliser : `{{variable_name}}`

Exemple d'URL :
```
{{base_url}}:{{auth_port}}/api/auth/login
```

## 📝 Requêtes Détaillées

### 1️⃣ AUTHENTIFICATION

#### POST - Register Manager

**URL** : `{{base_url}}:{{auth_port}}/api/auth/register`

**Headers** :
```
Content-Type: application/json
```

**Body (raw JSON)** :
```json
{
  "name": "Alice Manager",
  "email": "alice@teamtask.com",
  "password": "password123",
  "role": "manager"
}
```

**Test Script** (onglet Tests) :
```javascript
if (pm.response.code === 201) {
    pm.environment.set("token_manager", pm.response.json().token);
    pm.environment.set("manager_id", pm.response.json().user.id);
    console.log("✓ Manager token et ID sauvegardés");
}
```

---

#### POST - Register Member

**URL** : `{{base_url}}:{{auth_port}}/api/auth/register`

**Body (raw JSON)** :
```json
{
  "name": "Bob Member",
  "email": "bob@teamtask.com",
  "password": "password123",
  "role": "member"
}
```

**Test Script** :
```javascript
if (pm.response.code === 201) {
    pm.environment.set("token_member", pm.response.json().token);
    pm.environment.set("member_id", pm.response.json().user.id);
    console.log("✓ Member token et ID sauvegardés");
}
```

---

#### POST - Login Manager

**URL** : `{{base_url}}:{{auth_port}}/api/auth/login`

**Body** :
```json
{
  "email": "alice@teamtask.com",
  "password": "password123"
}
```

---

#### POST - Login Member

**URL** : `{{base_url}}:{{auth_port}}/api/auth/login`

**Body** :
```json
{
  "email": "bob@teamtask.com",
  "password": "password123"
}
```

---

#### GET - Get Current User

**URL** : `{{base_url}}:{{auth_port}}/api/auth/me`

**Headers** :
```
Authorization: Bearer {{token_manager}}
```

---

### 2️⃣ PROJETS

#### POST - Create Project

**URL** : `{{base_url}}:{{project_port}}/api/projects`

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

**Test Script** :
```javascript
if (pm.response.code === 201) {
    pm.environment.set("project_id", pm.response.json().project._id);
    console.log("✓ Project ID sauvegardé");
}
```

---

#### GET - Get All Projects

**URL** : `{{base_url}}:{{project_port}}/api/projects`

**Headers** :
```
Authorization: Bearer {{token_manager}}
```

---

#### GET - Get Project by ID

**URL** : `{{base_url}}:{{project_port}}/api/projects/{{project_id}}`

**Headers** :
```
Authorization: Bearer {{token_manager}}
```

---

#### PUT - Update Project

**URL** : `{{base_url}}:{{project_port}}/api/projects/{{project_id}}`

**Headers** :
```
Authorization: Bearer {{token_manager}}
Content-Type: application/json
```

**Body** :
```json
{
  "name": "Refonte du Site Web - Phase 2",
  "description": "Avec nouvelles technologies"
}
```

---

#### DELETE - Delete Project

**URL** : `{{base_url}}:{{project_port}}/api/projects/{{project_id}}`

**Headers** :
```
Authorization: Bearer {{token_manager}}
```

---

### 3️⃣ TÂCHES

#### POST - Create Task

**URL** : `{{base_url}}:{{task_port}}/api/tasks`

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

**Test Script** :
```javascript
if (pm.response.code === 201) {
    pm.environment.set("task_id", pm.response.json().task._id);
    console.log("✓ Task ID sauvegardé");
}
```

---

#### GET - Get Tasks by Project

**URL** : `{{base_url}}:{{task_port}}/api/tasks/project/{{project_id}}`

**Headers** :
```
Authorization: Bearer {{token_manager}}
```

---

#### GET - Get Tasks by User

**URL** : `{{base_url}}:{{task_port}}/api/tasks/user/{{member_id}}`

**Headers** :
```
Authorization: Bearer {{token_member}}
```

---

#### PATCH - Update Task Status (to in_progress)

**URL** : `{{base_url}}:{{task_port}}/api/tasks/{{task_id}}/status`

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

---

#### PATCH - Update Task Status (to done)

**URL** : `{{base_url}}:{{task_port}}/api/tasks/{{task_id}}/status`

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

---

#### DELETE - Delete Task

**URL** : `{{base_url}}:{{task_port}}/api/tasks/{{task_id}}`

**Headers** :
```
Authorization: Bearer {{token_manager}}
```

---

### 4️⃣ HISTORIQUE

#### GET - Get All History

**URL** : `{{base_url}}:{{history_port}}/api/history`

---

#### GET - Get History by Task

**URL** : `{{base_url}}:{{history_port}}/api/history/task/{{task_id}}`

---

#### GET - Get History by Project

**URL** : `{{base_url}}:{{history_port}}/api/history/project/{{project_id}}`

---

## 🔄 Flow de Test Recommandé

1. ✅ **Register Manager** → Sauvegarde token et ID
2. ✅ **Register Member** → Sauvegarde token et ID
3. ✅ **Create Project** (Manager) → Sauvegarde project ID
4. ✅ **Create Task** (Manager) → Sauvegarde task ID
5. ✅ **Update Task Status** (Member, in_progress) → Crée événement RabbitMQ
6. ✅ **Update Task Status** (Member, done) → Crée événement RabbitMQ
7. ✅ **Get History by Task** → Vérifier 2 entrées
8. ✅ **Get Tasks by User** (Member) → Voir tâche assignée

## 💡 Astuces Postman

### Pre-request Script (Préparer la requête)

Ajouter avant d'exécuter une requête :

```javascript
// Vérifier que le token existe
if (!pm.environment.get("token_manager")) {
    console.warn("⚠️ Token manager non défini!");
}
```

### Test Script (Valider la réponse)

Ajouter après chaque requête :

```javascript
// Vérifier le code de statut
pm.test("Status code is " + [200, 201][0], function() {
    pm.response.to.have.status([200, 201][0]);
});

// Vérifier que la réponse est du JSON
pm.test("Response is JSON", function() {
    pm.response.to.be.json;
});

// Vérifier l'absence d'erreur
pm.test("No error in response", function() {
    pm.expect(pm.response.json()).to.not.have.property("error");
});
```

### Collection Runner

1. Sélectionner une collection
2. Cliquer sur l'icône **▶️ Run**
3. Configurer les paramètres
4. Cliquer sur **Run TeamTask**

## 📊 Exemple de Rapport de Test

Après avoir exécuté la collection :

```
TeamTask API Tests

✓ Register Manager (201)
✓ Register Member (201)
✓ Login Manager (200)
✓ Create Project (201)
✓ Create Task (201)
✓ Update Task Status (200)
✓ Get History by Task (200)
✓ Get Tasks by User (200)

Total: 8 tests
Passed: 8
Failed: 0
```

## 🔐 Sécurité dans Postman

### Masquer les Valeurs Sensibles

1. Dans les variables d'environnement
2. Cocher la case **Secret** pour le token
3. Cliquer sur l'icône 👁️ pour masquer

### Export de Collection

1. Cliquer sur **Export** (collection)
2. Choisir le format JSON
3. **Ne pas partager les secrets** (utiliser `.env` à la place)

## 📚 Ressources

- [Postman Documentation](https://learning.postman.com/)
- [Postman Collection Format](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/)
- [Postman Variables](https://learning.postman.com/docs/sending-requests/variables/)

## 🆘 Dépannage

### Les requêtes retournent 401 Unauthorized

✅ **Solution** : Vérifier que le token est toujours valide et le header Authorization est correct

### Les variables ne se mettent pas à jour

✅ **Solution** : Vérifier que les Test Scripts sont exécutés (consulter la console)

### La variable n'est pas disponible

✅ **Solution** : Vérifier que l'environnement est sélectionné (icône d'engrenage en haut à droite)

### Erreur de connexion

✅ **Solution** : Vérifier que les services sont en cours d'exécution avec `docker-compose ps`
