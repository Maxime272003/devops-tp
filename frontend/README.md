# Frontend pour l'application Todo List

Ce dossier contient l'application frontend React pour la Todo List.

## 🚀 Fonctionnalités

- ✅ Interface utilisateur moderne et responsive
- ✅ Gestion complète des tâches (CRUD)
- ✅ Filtrage des tâches (toutes, en cours, terminées)
- ✅ Statistiques en temps réel
- ✅ Indicateur de connexion à l'API
- ✅ Design Material avec animations

## 📦 Technologies utilisées

- **React 18** - Framework frontend
- **Axios** - Client HTTP pour les appels API
- **CSS3** - Styles personnalisés avec animations
- **Nginx** - Serveur web pour la production

## 🛠️ Développement local

### Installation des dépendances

```bash
cd frontend
npm install
```

### Démarrage en mode développement

```bash
npm start
```

L'application sera accessible sur http://localhost:3000

### Build pour la production

```bash
npm run build
```

## 🐳 Docker

### Construction de l'image

```bash
docker build -t todo-frontend .
```

### Exécution du conteneur

```bash
docker run -p 80:80 todo-frontend
```

## 📁 Structure du projet

```
frontend/
├── public/
│   └── index.html          # Page HTML principale
├── src/
│   ├── components/         # Composants React
│   │   ├── TodoForm.js     # Formulaire d'ajout/édition
│   │   ├── TodoItem.js     # Item de tâche individuel
│   │   └── TodoList.js     # Liste de tâches
│   ├── services/
│   │   └── api.js          # Client API
│   ├── App.js              # Composant principal
│   ├── App.css             # Styles principaux
│   ├── index.js            # Point d'entrée
│   └── index.css           # Styles globaux
├── Dockerfile              # Image Docker multi-stage
├── nginx.conf              # Configuration Nginx
└── package.json            # Dépendances npm
```

## 🌐 Endpoints API utilisés

- `GET /api/health` - Vérification de l'état de l'API
- `GET /api/todos` - Récupérer toutes les tâches
- `GET /api/todos/:id` - Récupérer une tâche
- `POST /api/todos` - Créer une tâche
- `PUT /api/todos/:id` - Mettre à jour une tâche
- `DELETE /api/todos/:id` - Supprimer une tâche

## 🎨 Caractéristiques de l'interface

- **Design responsive** - Adapté aux mobiles, tablettes et ordinateurs
- **Animations fluides** - Transitions CSS pour une meilleure UX
- **Indicateurs visuels** - État de connexion à l'API en temps réel
- **Statistiques** - Nombre total, en cours et terminées
- **Filtres** - Affichage selon l'état des tâches
- **Mode édition** - Modification in-line des tâches
