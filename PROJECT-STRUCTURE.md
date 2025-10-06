# Structure du Projet DevOps TP

Ce document présente la structure complète du projet et le rôle de chaque fichier.

## 📁 Arborescence complète

```
devops-tp/
│
├── 📄 README.md                    # Documentation principale
├── 📄 API-DOCUMENTATION.md         # Documentation complète de l'API
├── 📄 ARCHITECTURE.md              # Documentation technique et architecture
├── 📄 PROJECT-STRUCTURE.md         # Ce fichier (structure du projet)
│
├── 📄 .gitignore                   # Fichiers à ignorer par Git
├── 📄 docker-compose.yml           # Configuration Docker Compose
│
├── 📜 deploy.sh                    # Script de déploiement Kubernetes (Linux/Mac)
├── 📜 cleanup.sh                   # Script de nettoyage (Linux/Mac)
├── 📜 test-api.sh                  # Script de test de l'API (Linux/Mac)
├── 📜 init-git.sh                  # Script d'initialisation Git (Linux/Mac)
│
├── 📂 backend/                     # Code source du backend
│   ├── 📂 src/                     # Sources JavaScript
│   │   ├── 📄 server.js            # Point d'entrée du serveur Express
│   │   ├── 📂 models/              # Modèles Mongoose
│   │   │   └── 📄 Todo.js          # Modèle Todo
│   │   └── 📂 routes/              # Routes API
│   │       └── 📄 todos.js         # Routes CRUD pour les todos
│   │
│   ├── 📄 package.json             # Dépendances Node.js
│   ├── 📄 Dockerfile               # Construction de l'image Docker
│   ├── 📄 .dockerignore            # Fichiers à ignorer par Docker
│   └── 📄 .env.example             # Exemple de variables d'environnement
│
└── 📂 k8s/                         # Manifestes Kubernetes (OBLIGATOIRES)
    ├── 📄 README.md                # Guide d'utilisation des manifestes
    │
    ├── 📄 namespace.yaml           # Namespace devops-tp
    │
    ├── 📄 mongodb-pvc.yaml         # PersistentVolumeClaim MongoDB
    ├── 📄 mongodb-deployment.yaml  # Déploiement MongoDB
    ├── 📄 mongodb-service.yaml     # Service MongoDB (ClusterIP)
    │
    ├── 📄 backend-deployment.yaml  # Déploiement Backend
    ├── 📄 backend-service.yaml     # Service Backend (NodePort)
    │
    ├── 📄 configmap.yaml           # ConfigMap (optionnel, bonus)
    └── 📄 ingress.yaml             # Ingress (optionnel, bonus)
```

## 📋 Fichiers par catégorie

1. **README.md** - Documentation principale

   - Noms des membres du binôme
   - Description de l'application
   - Instructions d'utilisation
   - Instructions de déploiement Kubernetes

2. **Sources de l'application**

   - `backend/src/server.js`
   - `backend/src/models/Todo.js`
   - `backend/src/routes/todos.js`
   - `backend/package.json`

3. **Fichiers Docker**

   - `backend/Dockerfile`
   - `docker-compose.yml` (optionnel mais recommandé)

4. **Manifestes Kubernetes** (tous dans `k8s/`)
   - `namespace.yaml`
   - `mongodb-pvc.yaml`
   - `mongodb-deployment.yaml`
   - `mongodb-service.yaml`
   - `backend-deployment.yaml`
   - `backend-service.yaml`

- **Documentation avancée**

  - `API-DOCUMENTATION.md` - Documentation complète de l'API
  - `ARCHITECTURE.md` - Architecture technique
  - `k8s/README.md` - Guide des manifestes Kubernetes

- **Manifestes Kubernetes avancés**

  - `k8s/configmap.yaml` - ConfigMap pour configuration
  - `k8s/ingress.yaml` - Ingress pour exposition HTTP

- **Scripts d'automatisation**

  - `deploy.sh` - Déploiement automatisé
  - `cleanup.sh` - Nettoyage automatisé
  - `test-api.sh` - Tests automatisés
  - `init-git.sh` - Initialisation Git

- **Configuration**
  - `.gitignore` - Fichiers à ignorer
  - `backend/.dockerignore` - Exclusions Docker
  - `backend/.env.example` - Exemple de configuration

## 🔍 Détail des fichiers

### Documentation

#### README.md

**Rôle** : Documentation principale du projet
**Contenu** :

- Noms des membres du binôme
- Description de l'application et ses fonctionnalités
- Technologies utilisées
- Instructions de déploiement Docker Compose
- Instructions de déploiement Kubernetes
- Exemples d'utilisation de l'API

#### API-DOCUMENTATION.md

**Rôle** : Documentation complète de l'API REST
**Contenu** :

- Tous les endpoints disponibles
- Format des requêtes et réponses
- Codes de statut HTTP
- Exemples avec curl, PowerShell, JavaScript, Python

#### ARCHITECTURE.md

**Rôle** : Documentation technique détaillée
**Contenu** :

- Architecture de l'application
- Stack technique
- Schémas d'infrastructure
- Stratégies de déploiement
- Performance et scalabilité

### Code source

#### backend/src/server.js

**Rôle** : Point d'entrée du serveur Express
**Fonctionnalités** :

- Configuration Express
- Connexion MongoDB avec retry logic
- Routes API
- Health check endpoint
- Gestion des erreurs

#### backend/src/models/Todo.js

**Rôle** : Modèle Mongoose pour les tâches
**Fonctionnalités** :

- Schéma de données
- Validation des champs
- Middleware de mise à jour des timestamps

#### backend/src/routes/todos.js

**Rôle** : Routes CRUD pour les tâches
**Endpoints** :

- GET /api/todos - Lister toutes les tâches
- GET /api/todos/:id - Récupérer une tâche
- POST /api/todos - Créer une tâche
- PUT /api/todos/:id - Mettre à jour une tâche
- DELETE /api/todos/:id - Supprimer une tâche

#### backend/package.json

**Rôle** : Configuration npm et dépendances
**Dépendances** :

- express - Framework web
- mongoose - ODM MongoDB
- cors - Gestion CORS
- dotenv - Variables d'environnement

### Conteneurisation

#### backend/Dockerfile

**Rôle** : Construction de l'image Docker du backend
**Étapes** :

1. Utilise node:18-alpine comme base
2. Copie package.json et installe les dépendances
3. Copie le code source
4. Expose le port 3000
5. Lance l'application

#### docker-compose.yml

**Rôle** : Configuration Docker Compose pour développement local
**Services** :

- mongodb - Base de données MongoDB
- backend - API Node.js
  **Réseau** : todo-network (bridge)
  **Volumes** : mongodb_data (persistance)

### Manifestes Kubernetes

#### k8s/namespace.yaml

**Rôle** : Créer un namespace isolé
**Ressource** : Namespace "devops-tp"

#### k8s/mongodb-pvc.yaml

**Rôle** : Demander un volume persistant pour MongoDB
**Ressource** : PersistentVolumeClaim
**Capacité** : 1Gi
**Mode d'accès** : ReadWriteOnce

#### k8s/mongodb-deployment.yaml

**Rôle** : Déployer MongoDB
**Ressource** : Deployment
**Replicas** : 1
**Image** : mongo:7.0
**Volume** : Monté depuis le PVC

#### k8s/mongodb-service.yaml

**Rôle** : Exposer MongoDB en interne
**Ressource** : Service
**Type** : ClusterIP (interne au cluster)
**Port** : 27017

#### k8s/backend-deployment.yaml

**Rôle** : Déployer le backend Node.js
**Ressource** : Deployment
**Replicas** : 2 (haute disponibilité)
**Image** : todo-backend:latest
**Probes** :

- Liveness : /api/health
- Readiness : /api/health

#### k8s/backend-service.yaml

**Rôle** : Exposer le backend à l'extérieur
**Ressource** : Service
**Type** : NodePort
**Port** : 3000
**NodePort** : 30000

#### k8s/configmap.yaml

**Rôle** : Centraliser la configuration
**Ressource** : ConfigMap
**Contenu** : Variables d'environnement du backend

#### k8s/ingress.yaml

**Rôle** : Exposer l'application via HTTP
**Ressource** : Ingress
**Host** : todo.local
**Backend** : backend-service:3000

### Scripts

#### deploy.sh

**Rôle** : Automatiser le déploiement Kubernetes
**Actions** :

1. Vérifier les prérequis (kubectl, minikube)
2. Démarrer Minikube si nécessaire
3. Construire l'image Docker
4. Appliquer tous les manifestes dans l'ordre
5. Attendre que les pods soient prêts
6. Afficher les instructions d'accès

#### cleanup.sh

**Rôle** : Nettoyer le déploiement Kubernetes
**Actions** :

1. Supprimer tous les manifestes
2. Supprimer le namespace
3. Confirmer la suppression

#### test-api.sh

**Rôle** : Tester automatiquement l'API
**Tests** :

1. Health check
2. Créer une tâche
3. Lister les tâches
4. Récupérer une tâche
5. Mettre à jour une tâche
6. Supprimer une tâche

#### init-git.sh

**Rôle** : Initialiser le dépôt Git
**Actions** :

1. Vérifier que Git est installé
2. Initialiser le dépôt
3. Configurer Git si nécessaire
4. Créer le commit initial
