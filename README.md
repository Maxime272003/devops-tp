# TP Introduction DevOps - Application Todo List

## Membres du binôme

- ROUSSEAU Maxime
- RASOAMIARAMANANA Hery ny aina

## Description de l'application

Cette application est une API REST de gestion de tâches (Todo List) développée avec Node.js et Express, utilisant MongoDB comme base de données persistante.

### Fonctionnalités

- Créer une nouvelle tâche
- Lister toutes les tâches
- Récupérer une tâche par son ID
- Mettre à jour une tâche
- Supprimer une tâche
- Marquer une tâche comme complétée

## Architecture

L'application est composée de deux conteneurs :

1. **Backend Node.js** : API REST exposée sur le port 3000
2. **MongoDB** : Base de données pour la persistance des données

## Utilisation de l'application

### Endpoints de l'API

- `GET /api/health` - Vérifier l'état de l'API
- `GET /api/todos` - Récupérer toutes les tâches
- `GET /api/todos/:id` - Récupérer une tâche par ID
- `POST /api/todos` - Créer une nouvelle tâche
  ```json
  {
    "title": "Ma tâche",
    "description": "Description de la tâche"
  }
  ```
- `PUT /api/todos/:id` - Mettre à jour une tâche
  ```json
  {
    "title": "Titre modifié",
    "description": "Description modifiée",
    "completed": true
  }
  ```
- `DELETE /api/todos/:id` - Supprimer une tâche

### Test avec curl ou Postman

```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Faire les courses","description":"Acheter du pain"}'

# Lister toutes les tâches
curl http://localhost:3000/api/todos
```

## Déploiement local avec Docker Compose

### Prérequis

- Docker
- Docker Compose

### Étapes

1. Cloner le dépôt :

```bash
git clone [URL_DU_DEPOT]
cd devops-tp
```

2. Construire et lancer les conteneurs :

```bash
docker-compose up --build
```

3. L'API sera accessible sur `http://localhost:3000`

4. Arrêter l'application :

```bash
docker-compose down
```

## Déploiement sur Kubernetes

### Prérequis

- kubectl installé et configuré
- Minikube (pour un cluster local) ou accès à un cluster Kubernetes

### Déploiement avec Minikube

1. Démarrer Minikube :

```bash
minikube start
```

2. Construire les images Docker dans l'environnement Minikube :

```bash
# Utiliser le daemon Docker de Minikube
eval $(minikube docker-env)

# Construire l'image du backend
docker build -t todo-backend:latest ./backend
```

3. Appliquer les manifestes Kubernetes :

```bash
# Créer le namespace
kubectl apply -f k8s/namespace.yaml

# Déployer MongoDB
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

# Déployer le Backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

4. Vérifier le déploiement :

```bash
# Vérifier les pods
kubectl get pods -n devops-tp

# Vérifier les services
kubectl get services -n devops-tp
```

5. Accéder à l'application :

```bash
# Avec Minikube
minikube service backend-service -n devops-tp

# Ou créer un tunnel
kubectl port-forward service/backend-service 3000:3000 -n devops-tp
```

### Déploiement sur un cluster public

Si vous utilisez un cluster public (GKE, EKS, AKS), vous devrez :

1. Pousser les images sur un registry public (Docker Hub, Google Container Registry, etc.) :

```bash
# Tag et push de l'image
docker tag todo-backend:latest [VOTRE_USERNAME]/todo-backend:latest
docker push [VOTRE_USERNAME]/todo-backend:latest
```

2. Modifier les fichiers de déploiement pour utiliser l'image du registry :

```yaml
image: [VOTRE_USERNAME]/todo-backend:latest
```

3. Appliquer les manifestes comme indiqué ci-dessus

### Commandes utiles

```bash
# Voir les logs d'un pod
kubectl logs -f <POD_NAME> -n devops-tp

# Obtenir des informations détaillées
kubectl describe pod <POD_NAME> -n devops-tp

# Supprimer le déploiement
kubectl delete -f k8s/ -n devops-tp

# Supprimer le namespace
kubectl delete namespace devops-tp
```

## Structure du projet

```
devops-tp/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Todo.js
│   │   ├── routes/
│   │   │   └── todos.js
│   │   └── server.js
│   ├── Dockerfile
│   └── package.json
├── k8s/
│   ├── namespace.yaml
│   ├── mongodb-pvc.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   ├── backend-deployment.yaml
│   └── backend-service.yaml
├── docker-compose.yml
└── README.md
```

## Tests

Pour tester que l'application fonctionne correctement :

1. Vérifier le health check :

```bash
curl http://localhost:3000/api/health
```

2. Créer quelques tâches et vérifier la persistance :

```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test de persistance"}'

# Redémarrer les pods
kubectl rollout restart deployment/backend-deployment -n devops-tp

# Vérifier que les données sont toujours présentes
curl http://localhost:3000/api/todos
```

## Licence

Ce projet est réalisé dans le cadre du TP Introduction DevOps.
