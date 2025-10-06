# Documentation de l'API Todo List

## Base URL

- **Local (Docker Compose)**: `http://localhost:3000`
- **Kubernetes (Minikube)**: `http://<MINIKUBE_IP>:30000` ou via port-forward
- **Production**: `http://<DOMAIN>/api`

## Endpoints

### Health Check

Vérifier l'état de santé de l'API.

**Endpoint**: `GET /api/health`

**Exemple de requête**:

```bash
curl http://localhost:3000/api/health
```

**Réponse (200 OK)**:

```json
{
  "uptime": 12345.67,
  "message": "OK",
  "timestamp": 1699564823456,
  "mongodb": "connected"
}
```

---

### Lister toutes les tâches

Récupérer toutes les tâches (triées par date de création décroissante).

**Endpoint**: `GET /api/todos`

**Exemple de requête**:

```bash
curl http://localhost:3000/api/todos
```

**Réponse (200 OK)**:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "654a1b2c3d4e5f6g7h8i9j0k",
      "title": "Faire les courses",
      "description": "Acheter du pain et du lait",
      "completed": false,
      "createdAt": "2024-11-08T10:30:00.000Z",
      "updatedAt": "2024-11-08T10:30:00.000Z"
    },
    {
      "_id": "654a1b2c3d4e5f6g7h8i9j0l",
      "title": "Réviser le cours DevOps",
      "description": "Revoir Kubernetes et Docker",
      "completed": true,
      "createdAt": "2024-11-08T09:15:00.000Z",
      "updatedAt": "2024-11-08T11:00:00.000Z"
    }
  ]
}
```

---

### Récupérer une tâche par ID

Obtenir les détails d'une tâche spécifique.

**Endpoint**: `GET /api/todos/:id`

**Paramètres**:

- `id` (string, required): L'identifiant MongoDB de la tâche

**Exemple de requête**:

```bash
curl http://localhost:3000/api/todos/654a1b2c3d4e5f6g7h8i9j0k
```

**Réponse (200 OK)**:

```json
{
  "success": true,
  "data": {
    "_id": "654a1b2c3d4e5f6g7h8i9j0k",
    "title": "Faire les courses",
    "description": "Acheter du pain et du lait",
    "completed": false,
    "createdAt": "2024-11-08T10:30:00.000Z",
    "updatedAt": "2024-11-08T10:30:00.000Z"
  }
}
```

**Réponse d'erreur (404 Not Found)**:

```json
{
  "success": false,
  "error": "Tâche non trouvée"
}
```

---

### Créer une nouvelle tâche

Créer une nouvelle tâche dans la liste.

**Endpoint**: `POST /api/todos`

**Corps de la requête**:

```json
{
  "title": "string (required, max 100 caractères)",
  "description": "string (optional, max 500 caractères)"
}
```

**Exemple de requête**:

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Finir le TP DevOps",
    "description": "Compléter tous les manifestes Kubernetes"
  }'
```

**Réponse (201 Created)**:

```json
{
  "success": true,
  "message": "Tâche créée avec succès",
  "data": {
    "_id": "654a1b2c3d4e5f6g7h8i9j0m",
    "title": "Finir le TP DevOps",
    "description": "Compléter tous les manifestes Kubernetes",
    "completed": false,
    "createdAt": "2024-11-08T12:00:00.000Z",
    "updatedAt": "2024-11-08T12:00:00.000Z"
  }
}
```

**Réponse d'erreur (400 Bad Request)**:

```json
{
  "success": false,
  "error": "Le titre est obligatoire"
}
```

---

### Mettre à jour une tâche

Modifier une tâche existante.

**Endpoint**: `PUT /api/todos/:id`

**Paramètres**:

- `id` (string, required): L'identifiant MongoDB de la tâche

**Corps de la requête** (tous les champs sont optionnels):

```json
{
  "title": "string (optional, max 100 caractères)",
  "description": "string (optional, max 500 caractères)",
  "completed": "boolean (optional)"
}
```

**Exemple de requête** (marquer comme complétée):

```bash
curl -X PUT http://localhost:3000/api/todos/654a1b2c3d4e5f6g7h8i9j0k \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

**Exemple de requête** (modifier le titre et la description):

```bash
curl -X PUT http://localhost:3000/api/todos/654a1b2c3d4e5f6g7h8i9j0k \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Faire les courses (urgent)",
    "description": "Acheter du pain, lait et œufs"
  }'
```

**Réponse (200 OK)**:

```json
{
  "success": true,
  "message": "Tâche mise à jour avec succès",
  "data": {
    "_id": "654a1b2c3d4e5f6g7h8i9j0k",
    "title": "Faire les courses (urgent)",
    "description": "Acheter du pain, lait et œufs",
    "completed": false,
    "createdAt": "2024-11-08T10:30:00.000Z",
    "updatedAt": "2024-11-08T12:15:00.000Z"
  }
}
```

**Réponse d'erreur (404 Not Found)**:

```json
{
  "success": false,
  "error": "Tâche non trouvée"
}
```

---

### Supprimer une tâche

Supprimer définitivement une tâche.

**Endpoint**: `DELETE /api/todos/:id`

**Paramètres**:

- `id` (string, required): L'identifiant MongoDB de la tâche

**Exemple de requête**:

```bash
curl -X DELETE http://localhost:3000/api/todos/654a1b2c3d4e5f6g7h8i9j0k
```

**Réponse (200 OK)**:

```json
{
  "success": true,
  "message": "Tâche supprimée avec succès",
  "data": {
    "_id": "654a1b2c3d4e5f6g7h8i9j0k",
    "title": "Faire les courses",
    "description": "Acheter du pain et du lait",
    "completed": false,
    "createdAt": "2024-11-08T10:30:00.000Z",
    "updatedAt": "2024-11-08T10:30:00.000Z"
  }
}
```

**Réponse d'erreur (404 Not Found)**:

```json
{
  "success": false,
  "error": "Tâche non trouvée"
}
```

---

## Codes de statut HTTP

| Code | Description                            |
| ---- | -------------------------------------- |
| 200  | OK - Requête réussie                   |
| 201  | Created - Ressource créée avec succès  |
| 400  | Bad Request - Données invalides        |
| 404  | Not Found - Ressource non trouvée      |
| 500  | Internal Server Error - Erreur serveur |

---

## Exemples avec différents outils

### cURL

```bash
# Créer une tâche
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Description"}'

# Lister les tâches
curl http://localhost:3000/api/todos

# Mettre à jour
curl -X PUT http://localhost:3000/api/todos/[ID] \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Supprimer
curl -X DELETE http://localhost:3000/api/todos/[ID]
```

---

## Schéma de données

### Modèle Todo

```javascript
{
  _id: ObjectId,           // Généré automatiquement par MongoDB
  title: String,           // Requis, max 100 caractères
  description: String,     // Optionnel, max 500 caractères
  completed: Boolean,      // Par défaut: false
  createdAt: Date,         // Généré automatiquement
  updatedAt: Date          // Mis à jour automatiquement
}
```

---

## Notes importantes

1. **Validation**: Le titre est obligatoire et ne peut dépasser 100 caractères
2. **Timestamps**: Les champs `createdAt` et `updatedAt` sont gérés automatiquement
3. **ObjectId**: MongoDB génère automatiquement un `_id` unique pour chaque tâche
4. **CORS**: L'API accepte les requêtes de toutes origines (configuré pour le développement)
5. **Format JSON**: Toutes les requêtes et réponses utilisent le format JSON
