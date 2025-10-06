# Architecture Technique du Projet

## Vue d'ensemble

Cette application suit une architecture microservices conteneurisée, composée de deux services principaux :

1. **Backend API** (Node.js + Express)
2. **Base de données** (MongoDB)

## Stack Technique

### Backend

- **Runtime**: Node.js 18 (Alpine Linux)
- **Framework**: Express.js 4.x
- **ODM**: Mongoose 8.x
- **Middleware**: CORS, express.json()
- **Gestion des erreurs**: Centralisée avec try/catch et middleware

### Base de données

- **SGBD**: MongoDB 7.0
- **Driver**: Mongoose (ODM)
- **Persistance**: PersistentVolumeClaim (1Gi)

### Conteneurisation

- **Docker**: Multi-stage builds non utilisé (image de base Alpine légère)
- **Image de base Backend**: node:18-alpine (~150MB)
- **Image de base MongoDB**: mongo:7.0 (~700MB)
- **Registry**: Local (Minikube) ou Docker Hub pour production

### Orchestration Kubernetes

- **Distribution testée**: Minikube
- **Namespace**: devops-tp (isolation des ressources)
- **Contrôleur**: Deployment (pour backend et MongoDB)
- **Réplication**: 2 pods backend, 1 pod MongoDB
- **Services**:
  - ClusterIP pour MongoDB (communication interne)
  - NodePort pour Backend (accès externe)

## Composants détaillés

### 1. Backend Node.js

#### Structure du code

```
backend/
├── src/
│   ├── server.js           # Point d'entrée, configuration Express
│   ├── models/
│   │   └── Todo.js         # Modèle Mongoose
│   └── routes/
│       └── todos.js        # Routes API REST
├── Dockerfile              # Construction de l'image
├── package.json            # Dépendances npm
└── .dockerignore          # Exclusions Docker
```

#### Fonctionnalités clés

- **Retry Logic**: Reconnexion automatique à MongoDB en cas d'échec
- **Health Check**: Endpoint `/api/health` pour les probes Kubernetes
- **Graceful Shutdown**: Gestion propre du signal SIGTERM
- **Validation**: Validation des données via Mongoose schemas
- **Logging**: Logs console structurés

#### Variables d'environnement

| Variable      | Description              | Valeur par défaut                |
| ------------- | ------------------------ | -------------------------------- |
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb://mongodb:27017/tododb` |
| `PORT`        | Port d'écoute du serveur | `3000`                           |

### 2. MongoDB

#### Configuration

- **Port**: 27017
- **Base de données**: tododb
- **Collections**: todos
- **Indexes**: \_id (automatique)

#### Persistance

- **Type**: PersistentVolumeClaim
- **Taille**: 1Gi
- **AccessMode**: ReadWriteOnce
- **StorageClass**: Default du cluster

#### Schéma de données

```javascript
{
  _id: ObjectId,        // Index unique automatique
  title: String,        // Index texte possible pour recherche
  description: String,
  completed: Boolean,
  createdAt: Date,      // Index pour tri chronologique
  updatedAt: Date
}
```

## Déploiement Kubernetes

### Architecture des ressources

```
devops-tp (Namespace)
├── Deployments
│   ├── backend-deployment (2 replicas)
│   └── mongodb-deployment (1 replica)
├── Services
│   ├── backend-service (NodePort :30000)
│   └── mongodb-service (ClusterIP :27017)
├── PersistentVolumeClaims
│   └── mongodb-pvc (1Gi)
└── ConfigMaps (optionnel)
    └── backend-config
```

### Stratégie de déploiement

#### Backend

- **Type**: RollingUpdate (par défaut)
- **Max Unavailable**: 25%
- **Max Surge**: 25%
- **Avantage**: Zéro downtime lors des mises à jour

#### MongoDB

- **Type**: Recreate (recommandé pour les stateful)
- **Replicas**: 1 (pas de réplication MongoDB native)
- **Limitation**: Single point of failure

### Health Checks

#### Backend - Liveness Probe

```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30 # Temps de démarrage
  periodSeconds: 10 # Vérification toutes les 10s
  timeoutSeconds: 5
  failureThreshold: 3 # 3 échecs = redémarrage
```

#### Backend - Readiness Probe

```yaml
readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3 # 3 échecs = retrait du service
```

### Ressources et limites

#### Backend

```yaml
resources:
  requests:
    memory: "128Mi" # Minimum garanti
    cpu: "100m" # 0.1 CPU
  limits:
    memory: "256Mi" # Maximum autorisé
    cpu: "200m" # 0.2 CPU
```

#### MongoDB

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Scalabilité

### Horizontal Scaling

#### Backend

```bash
# Augmenter le nombre de replicas
kubectl scale deployment backend-deployment --replicas=5 -n devops-tp

# Autoscaling basé sur CPU
kubectl autoscale deployment backend-deployment \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n devops-tp
```

#### MongoDB

- **Limitation actuelle**: Single instance
- **Solution**: Implémenter MongoDB Replica Set ou utiliser un operator

### Vertical Scaling

```bash
# Augmenter les ressources allouées
kubectl set resources deployment backend-deployment \
  --limits=cpu=500m,memory=512Mi \
  --requests=cpu=200m,memory=256Mi \
  -n devops-tp
```

## Monitoring et Observabilité

### Logs

```bash
# Logs du backend
kubectl logs -f deployment/backend-deployment -n devops-tp

# Logs de MongoDB
kubectl logs -f deployment/mongodb-deployment -n devops-tp

# Logs agrégés
kubectl logs -l app=backend -n devops-tp --tail=100
```

### Métriques

Le cluster Kubernetes expose automatiquement :

- CPU usage
- Memory usage
- Network I/O
- Disk I/O

## Disaster Recovery

### Backup MongoDB

```bash
# Backup manuel
kubectl exec deployment/mongodb-deployment -n devops-tp -- \
  mongodump --archive=/tmp/backup.archive --gzip

# Copier le backup
kubectl cp devops-tp/[POD_NAME]:/tmp/backup.archive ./backup.archive
```

### Restore MongoDB

```bash
# Copier le backup dans le pod
kubectl cp ./backup.archive devops-tp/[POD_NAME]:/tmp/backup.archive

# Restaurer
kubectl exec deployment/mongodb-deployment -n devops-tp -- \
  mongorestore --archive=/tmp/backup.archive --gzip
```

## CI/CD

### Proposition de pipeline

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKER_USERNAME }}/todo-backend:${{ github.sha }} ./backend

      - name: Push to Docker Hub
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push ${{ secrets.DOCKER_USERNAME }}/todo-backend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend-deployment \
            backend=${{ secrets.DOCKER_USERNAME }}/todo-backend:${{ github.sha }} \
            -n devops-tp
```

## Performance

### Optimisations possibles

1. **Caching**: Ajouter Redis pour les requêtes fréquentes
2. **Connection Pooling**: MongoDB connection pool (déjà géré par Mongoose)
3. **Compression**: Activer gzip sur Express
4. **CDN**: Pour les assets statiques
5. **Database Indexing**: Index sur `completed` et `createdAt`

### Benchmarks attendus

- **Latence API**: < 50ms (GET)
- **Throughput**: ~1000 req/s par pod backend
- **Temps de démarrage**: ~10s (backend), ~30s (MongoDB)

## Dépendances externes

| Package  | Version | Licence | Utilisation       |
| -------- | ------- | ------- | ----------------- |
| express  | ^4.18.2 | MIT     | Framework web     |
| mongoose | ^8.0.0  | MIT     | ODM MongoDB       |
| cors     | ^2.8.5  | MIT     | CORS middleware   |
| dotenv   | ^16.3.1 | BSD-2   | Config management |
