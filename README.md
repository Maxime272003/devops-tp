# TP Introduction DevOps - Application Todo List

## Membres du binôme

- ROUSSEAU Maxime
- RASOAMIARAMANANA Hery ny aina

## Description de l'application

Cette application est une API REST de gestion de tâches (Todo List) développée avec Node.js et Express, utilisant MongoDB comme base de données persistante.

> **💡 Note pour Windows** : Les scripts `.sh` nécessitent Git Bash ou WSL. Les instructions PowerShell sont fournies dans la section Kubernetes.

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

### Structure du projet

```plaintext
devops-tp/
├── .github/              # Configuration GitHub Actions
│   ├── workflows/        # Workflows CI/CD
│   │   ├── build-backend.yml
│   │   └── build-frontend.yml
│   └── CI-CD.md         # Documentation CI/CD
├── backend/              # Code source de l'API Node.js
│   ├── src/
│   │   ├── server.js     # Point d'entrée
│   │   ├── models/       # Modèles Mongoose
│   │   └── routes/       # Routes API
│   ├── Dockerfile        # Image Docker du backend
│   └── package.json      # Dépendances Node.js
├── frontend/             # Code source du frontend React
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── k8s/                  # Manifestes Kubernetes
│   ├── namespace.yaml
│   ├── mongodb-*.yaml
│   ├── backend-*.yaml
│   └── frontend-*.yaml
├── docker-compose.yml    # Configuration Docker Compose
├── deploy.sh            # Script de déploiement K8s
└── cleanup.sh           # Script de nettoyage K8s
```

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

## CI/CD - Intégration Continue

Ce projet utilise **GitHub Actions** pour automatiquement builder et publier les images Docker sur GitHub Container Registry à chaque push sur la branche `master`.

### 🔄 Workflow CI/CD

```
┌─────────────────┐
│  Git Push       │
│  (backend/* ou  │
│   frontend/*)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│ - Build image   │
│ - Run tests     │
│ - Push to ghcr  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ghcr.io       │
│  (Registre)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ./deploy.sh    │
│ - Pull images   │
│ - Deploy to K8s │
└─────────────────┘
```

**Caractéristiques :**

- 📦 Les images sont automatiquement buildées lors de modifications dans `backend/` ou `frontend/`
- 🚀 Les images sont publiées sur `ghcr.io/maxime272003/todo-backend` et `ghcr.io/maxime272003/todo-frontend`
- 🔄 Le script `deploy.sh` télécharge automatiquement les dernières images
- 🏷️ Chaque image est taggée avec le SHA du commit + `latest`

> 📖 Pour plus de détails sur la configuration CI/CD, consultez [.github/CI-CD.md](.github/CI-CD.md)  
> ⚙️ Pour configurer les permissions GitHub, consultez [.github/SETUP.md](.github/SETUP.md)

## Déploiement

```bash
# 1. Cloner le dépôt
git clone https://github.com/Maxime272003/devops-tp.git
cd devops-tp

# 2. Démarrer Minikube
minikube start

# 3. Déployer l'application (télécharge les images depuis ghcr.io)
./deploy.sh

# 4. Arrêter et nettoyer
./cleanup.sh
```

> **💡 Avantage** : Plus besoin de builder les images localement ! Le script télécharge directement les images pré-buildées par GitHub Actions, ce qui accélère considérablement le déploiement.

## 📝 Tests de l'API

> **Note** : Remplacez `[PORT]` par :
>
> - `3000` si vous utilisez Docker Compose
> - Le port retourné par `minikube service backend-service -n devops-tp` pour Kubernetes (généralement 30000)

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

### Forcer le rechargement des images

```bash
# Forcer Kubernetes à télécharger la dernière version
kubectl rollout restart deployment/backend-deployment -n devops-tp
kubectl rollout restart deployment/frontend-deployment -n devops-tp

# Ou redéployer complètement
./cleanup.sh
./deploy.sh
```

### Les images ne se téléchargent pas

Si les images Docker sont privées sur GitHub Container Registry :

```bash
# Authentification Docker avec GitHub
docker login ghcr.io
# Username: votre-username-github
# Password: votre-personal-access-token

# Puis redéployer
./deploy.sh
```

> 📖 Voir [.github/SETUP.md](.github/SETUP.md) pour configurer les permissions GitHub
