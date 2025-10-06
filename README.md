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

## Option 1 : Avec Docker Compose (Recommandé pour tester localement)

```bash
# 1. Cloner le dépôt
git clone https://github.com/Maxime272003/devops-tp.git
cd devops-tp

# 2. Démarrer l'application
docker-compose up -d

# 3. Tester l'API
curl http://localhost:3000/api/health

# 4. Créer une tâche
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Ma première tâche","description":"Test de l API"}'

# 5. Arrêter l'application
docker-compose down
```

### Option 2 : Avec Minikube (Pour Kubernetes)

```bash
# 1. Démarrer Minikube
minikube start

# 2. Exécuter le script de déploiement
chmod +x deploy.sh
./deploy.sh

# 3. Accéder à l'application
minikube service backend-service -n devops-tp

# 4. Pour nettoyer
./cleanup.sh

```

## 📝 Tests de l'API

### Créer une tâche

```bash
curl -X POST http://localhost:[PORT]/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Ma première tâche","description":"Test de l API"}'
```

### Lister toutes les tâches

```bash
curl http://localhost:[PORT]/api/todos
```

### Récupérer une tâche par ID

```bash
curl http://localhost:[PORT]/api/todos/[ID_DE_LA_TACHE]
```

### Mettre à jour une tâche

```bash
curl -X PUT http://localhost:[PORT]/api/todos/[ID_DE_LA_TACHE] \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

### Supprimer une tâche

```bash
curl -X DELETE http://localhost:[PORT]/api/todos/[ID_DE_LA_TACHE]
```

## 🔍 Commandes utiles Kubernetes

```bash
# Voir les pods
kubectl get pods -n devops-tp

# Voir les logs du backend
kubectl logs -f deployment/backend-deployment -n devops-tp

# Voir les logs de MongoDB
kubectl logs -f deployment/mongodb-deployment -n devops-tp

# Redémarrer un déploiement
kubectl rollout restart deployment/backend-deployment -n devops-tp

# Obtenir des informations détaillées
kubectl describe pod [NOM_DU_POD] -n devops-tp
```

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
kubectl logs -f deployment/backend-deployment -n devops-tp

# Vérifier que MongoDB est bien démarré
kubectl get pods -n devops-tp -l app=mongodb
```

### Erreur de connexion à MongoDB

```bash
# Vérifier le service MongoDB
kubectl get svc -n devops-tp

# Tester la connectivité
kubectl exec -it deployment/backend-deployment -n devops-tp -- sh
# Puis dans le conteneur:
# ping mongodb-service
```

### Reconstruire l'image Docker

```bash
# Sous Minikube
eval $(minikube docker-env)
docker build -t todo-backend:latest ./backend

# Redémarrer le déploiement
kubectl rollout restart deployment/backend-deployment -n devops-tp
```
