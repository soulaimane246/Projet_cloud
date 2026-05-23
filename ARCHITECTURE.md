# 🏗️ Architecture et Patterns TeamTask

## 📐 Vue d'Ensemble

TeamTask utilise une **architecture microservices** avec les patterns suivants :

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Postman)                        │
└────┬────────────────────────────────────────────────────────────┘
     │
     │ HTTP REST
     │
     ├─→ Auth Service (3000)
     ├─→ Project Service (3001)
     ├─→ Task Service (3002)
     └─→ History Service (3003)
          │       │
          │       └─→ REST Call → Project Service
          │
          └─→ RabbitMQ Event → History Service
                   │
                   └─→ MongoDB
```

## 🎯 Patterns d'Architecture

### 1. Microservices

Chaque service est **indépendant** et peut être :
- Développé séparément
- Déployé indépendamment
- Scalé horizontalement
- Écrit dans un langage différent

**Bénéfices** :
✅ Flexibilité
✅ Résilience
✅ Scalabilité

**Défis** :
⚠️ Complexité opérationnelle
⚠️ Latence réseau
⚠️ Consistance des données

### 2. Base de Données par Service

```
Auth Service    → MongoDB (auth)
Project Service → MongoDB (projects)
Task Service    → MongoDB (tasks)
History Service → MongoDB (history)
```

**Avantages** :
✅ Isolation des données
✅ Schéma optimisé par service
✅ Pas de dépendance BD

**Incohérences potentielles** :
⚠️ Pas de transactions distribuées
⚠️ Synchronisation manuelle nécessaire

### 3. Communication Synchrone (REST/HTTP)

**Task Service → Project Service**

```javascript
// Vérifier qu'un projet existe
const response = await axios.get(
  `${PROJECT_SERVICE_URL}/api/projects/${projectId}`,
  { headers: { Authorization: token } }
);
```

**Cas d'usage** :
✅ Requêtes critiques
✅ Besoin de réponse immédiate
✅ Peu de latence acceptable

### 4. Communication Asynchrone (Message Queue)

**Task Service → RabbitMQ → History Service**

```javascript
// Publier un événement
await publishEvent({
  taskId, projectId, changedBy,
  oldStatus, newStatus, timestamp
});

// Consumer dans History Service
channel.consume('task.events', async (msg) => {
  const data = JSON.parse(msg.content.toString());
  await History.create(data);
  channel.ack(msg);
});
```

**Cas d'usage** :
✅ Opérations non-critiques
✅ Découplage entre services
✅ Haute disponibilité

## 🔐 Patterns de Sécurité

### 1. JWT (JSON Web Tokens)

**Flux d'authentification** :

```
1. Client envoie email + password
   ↓
2. Auth Service vérifie et génère JWT
   ↓
3. Client inclut JWT dans Authorization header
   ↓
4. Chaque service valide le JWT
```

**Payload JWT** :
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "role": "manager",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### 2. RBAC (Role-Based Access Control)

**Rôles** :
- `manager` : Privilèges complets
- `member` : Accès limité

**Middleware checkRole** :
```javascript
router.post('/api/projects',
  verifyToken,
  checkRole('manager'),  // Seulement managers
  controller.createProject
);
```

### 3. Password Hashing (bcrypt)

```javascript
// Enregistrement
const hashedPassword = await bcrypt.hash(password, 10);
await User.create({ password: hashedPassword });

// Connexion
const match = await bcrypt.compare(password, user.password);
```

## 📦 Patterns d'Intégration

### 1. Event Sourcing Partiel

Au lieu d'une base de données d'historique traditionnelle, on utilise **RabbitMQ comme source de vérité** pour les changements :

```
Événement publié
    ↓
Queue RabbitMQ
    ↓
Consumer enregistre dans BD
```

**Avantages** :
✅ Audit trail complète
✅ Rejeu possible
✅ Découplage services

### 2. Saga Pattern (Implificite)

Bien qu'implicite, le pattern saga est respecté :

```
Task Status Update
    ↓
1. Vérifier projet (REST sync)
    ↓
2. Mettre à jour tâche (local)
    ↓
3. Publier événement (async)
    ↓
4. History service reçoit
    ↓
Cohérence finale atteinte
```

### 3. Circuit Breaker (Potential)

À ajouter pour une robustesse accrue :

```javascript
// Actuellement : appel direct
const project = await axios.get(projectUrl);

// Avec circuit breaker :
const project = await circuitBreaker.execute(() =>
  axios.get(projectUrl)
);
// Fallback si le service est down
```

## 🔄 Patterns de Flux de Données

### 1. Request-Response

```
Client → Service → DB → Service → Client
         (sync)        (response)
```

### 2. Event-Driven

```
Service A → Event → Message Queue → Service B
           (publish)               (consume)
```

### 3. CQRS (Command Query Responsibility Segregation)

Implicite dans la structure :
- **Commands** : `POST`, `PUT`, `PATCH`, `DELETE` (Task Service)
- **Queries** : `GET` (History Service)

## 🗂️ Structure de Dossiers

```
service/
├── src/
│   ├── config/
│   │   ├── db.js              # Connexion MongoDB
│   │   └── rabbitmq.js        # (si applicable)
│   ├── models/
│   │   └── Entity.js          # Schéma Mongoose
│   ├── controllers/
│   │   └── entityController.js # Logique métier
│   ├── routes/
│   │   └── entityRoutes.js    # Endpoints
│   ├── middleware/
│   │   ├── verifyToken.js     # Auth
│   │   └── checkRole.js       # Authorization
│   └── app.js                 # Application Express
├── .env.example               # Variables d'env
├── Dockerfile                 # Container
└── package.json               # Dépendances
```

**Responsabilités** :

| Couche | Responsabilité |
|-------|-----------------|
| Routes | Mapping HTTP → Contrôleur |
| Controllers | Logique métier, validation |
| Models | Schéma de données |
| Middleware | Cross-cutting concerns |
| Config | Initialisation |

## 🔀 Flux de Requête

### Exemple : Mise à jour de Statut de Tâche

```
1. PATCH /api/tasks/:id/status
   ↓
2. verifyToken middleware
   → Valide JWT, attache req.user
   ↓
3. updateTaskStatus controller
   a) Récupérer tâche en BD
   b) Vérifier droits (manager ou assignedTo)
   c) Vérifier projet existe (REST sync)
   d) Mettre à jour status
   e) Publier événement RabbitMQ (async)
   f) Retourner réponse
   ↓
4. History Service
   a) Reçoit événement RabbitMQ
   b) Crée entrée d'historique
   c) Enregistre en BD
   ↓
5. Client reçoit réponse 200
```

## 🔗 Contrats de Services

### Auth Service API Contract

```typescript
POST /api/auth/register
Request: { name, email, password, role }
Response: { token: JWT, user: { id, name, email, role } }

POST /api/auth/login
Request: { email, password }
Response: { token: JWT, user: { id, name, email, role } }
```

### Project Service API Contract

```typescript
POST /api/projects
Headers: Authorization: Bearer JWT
Request: { name, description, deadline, members }
Response: { project: { _id, name, ..., createdBy } }

GET /api/projects/:id
Headers: Authorization: Bearer JWT
Response: { project: { ... } }
```

## 📊 Patterns de Gestion d'Erreur

### Hiérarchie d'Erreurs

```
ClientError (4xx)
├── ValidationError (400)
├── AuthenticationError (401)
└── AuthorizationError (403)

ServerError (5xx)
└── InternalServerError (500)
```

### Gestion Uniforme

```javascript
try {
  // Logique métier
  const result = await operation();
  res.status(200).json(result);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: error.message });
}
```

## 🚀 Patterns de Déploiement

### Docker Compose (Développement)

```yaml
services:
  auth-service:
    build: ./auth-service
    ports: [3000:3000]
    depends_on: [mongo-auth]
    environment: [MONGO_URI, JWT_SECRET]
```

### Production (Kubernetes recommandé)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  containers:
  - name: auth-service
    image: teamtask/auth-service:1.0
    ports: [3000]
    env:
    - name: MONGO_URI
      valueFrom:
        secretKeyRef:
          name: auth-secrets
          key: mongodb-uri
```

## 📈 Patterns de Scalabilité

### Horizontal Scaling

```
Load Balancer
    ↓
├─ Task Service Instance 1
├─ Task Service Instance 2
└─ Task Service Instance 3
    ↓
Shared MongoDB
Shared RabbitMQ
```

### Cache Layer (Futur)

```
Request → Redis Cache
         ↓ (miss)
         MongoDB
         ↓
         Cache + Return
```

## 🔄 Patterns de Resilience

### Retry Logic

```javascript
const connectWithRetry = async (fn, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${i+1} failed, retrying...`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
};
```

### Graceful Shutdown

```javascript
process.on('SIGTERM', async () => {
  console.log('SIGTERM reçu, fermeture gracieuse...');
  await mongoose.connection.close();
  process.exit(0);
});
```

## 📚 Patterns de Test

### Test Pyramid

```
       Unit Tests (Contrôleurs, Utils)
         ↙                    ↖
    Integration Tests (Service ↔ BD)
         ↙                    ↖
    E2E Tests (Client → Services)
```

### Exemple Unit Test

```javascript
describe('authController', () => {
  it('should hash password on registration', async () => {
    const password = 'test123';
    const user = await register({ password });
    expect(user.password).not.toBe(password);
    expect(await bcrypt.compare(password, user.password)).toBe(true);
  });
});
```

## 🎓 Conclusions

### Quand utiliser cette architecture

✅ **Bon pour** :
- Projets d'équipe moyens à grands
- Services avec cycles de vie différents
- Besoin de scalabilité indépendante
- Équipes séparées par service

❌ **Pas bon pour** :
- Prototypes ou MVP simples
- Applications monolithiques petites
- Teams très petites
- Pas d'infrastructure cloud

### Améliorations Futures

1. **API Gateway** (Kong, Traefik)
2. **Service Mesh** (Istio)
3. **Distributed Tracing** (Jaeger)
4. **Logging Centralisé** (ELK Stack)
5. **Monitoring** (Prometheus + Grafana)
6. **Secrets Management** (Vault)
7. **CI/CD Pipeline** (GitHub Actions)
8. **Infrastructure as Code** (Terraform)
