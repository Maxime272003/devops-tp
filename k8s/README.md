# Manifestes Kubernetes - Guide d'utilisation

Ce dossier contient tous les manifestes Kubernetes nécessaires pour déployer l'application Todo List.

> **💡 Conseil** : Pour un déploiement rapide, utilisez les scripts `deploy.sh` ou `cleanup.sh` à la racine du projet (Linux/Mac/WSL). Pour Windows PowerShell, suivez les instructions de déploiement manuel ci-dessous.

## 📁 Fichiers disponibles

1. **namespace.yaml** - Crée le namespace `devops-tp`
2. **mongodb-pvc.yaml** - PersistentVolumeClaim pour MongoDB (1Gi)
3. **mongodb-deployment.yaml** - Déploiement MongoDB (1 réplica)
4. **mongodb-service.yaml** - Service ClusterIP pour MongoDB
5. **backend-deployment.yaml** - Déploiement du backend Node.js (2 réplicas)
6. **backend-service.yaml** - Service NodePort pour le backend (port 30000)

## 🚀 Ordre de déploiement

### Méthode 1 : Avec le script (Linux/Mac/WSL)

```bash
cd ..  # Retour à la racine du projet
./deploy.sh
```

### Méthode 2 : Déploiement manuel (PowerShell/Bash)

> **💡 Note** : Les commandes `kubectl` fonctionnent de la même manière sous Windows PowerShell et Linux/Mac

```bash
# 1. Se placer dans le dossier k8s
cd k8s

# 2. Créer le namespace
kubectl apply -f namespace.yaml

# 3. Déployer la couche de persistance (MongoDB)
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

# 4. Attendre que MongoDB soit prêt
kubectl wait --for=condition=ready pod -l app=mongodb -n devops-tp --timeout=120s

# 5. Déployer le backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# 6. Attendre que le backend soit prêt
kubectl wait --for=condition=ready pod -l app=backend -n devops-tp --timeout=120s
```

## 🌐 Accès à l'application

### Avec Minikube

```bash
# Obtenir l'URL complète (ouvre automatiquement le navigateur)
minikube service backend-service -n devops-tp

# Ou obtenir juste l'URL
minikube service backend-service -n devops-tp --url
```

### Avec kubectl port-forward

```bash
kubectl port-forward service/backend-service 3000:3000 -n devops-tp
# Puis accéder à: http://localhost:3000/api/health
```

### Avec NodePort direct

```bash
# Obtenir l'IP de Minikube
minikube ip
# Puis accéder à: http://<MINIKUBE_IP>:30000/api/health
```

## 🔍 Vérification du déploiement

```bash
# Voir tous les objets dans le namespace
kubectl get all -n devops-tp

# Voir les pods en détail
kubectl get pods -n devops-tp -o wide

# Voir les logs du backend
kubectl logs -f deployment/backend-deployment -n devops-tp

# Voir les logs de MongoDB
kubectl logs -f deployment/mongodb-deployment -n devops-tp

# Voir les événements du namespace
kubectl get events -n devops-tp --sort-by='.lastTimestamp'
```

## 📊 Caractéristiques du déploiement

### MongoDB

- **Réplicas**: 1
- **Image**: mongo:7.0
- **Port**: 27017
- **Type de service**: ClusterIP (interne au cluster)
- **Stockage**: PVC de 1Gi
- **Ressources**:
  - Requests: 256Mi RAM, 250m CPU
  - Limits: 512Mi RAM, 500m CPU

### Backend

- **Réplicas**: 2 (haute disponibilité)
- **Image**: todo-backend:latest
- **Port**: 3000
- **Type de service**: NodePort (accessible depuis l'extérieur)
- **NodePort**: 30000
- **Ressources**:
  - Requests: 128Mi RAM, 100m CPU
  - Limits: 256Mi RAM, 200m CPU
- **Probes**:
  - Liveness: GET /api/health (démarrage après 30s)
  - Readiness: GET /api/health (démarrage après 10s)

## 🛠️ Modification des manifestes

### Changer le type de service

Pour utiliser LoadBalancer au lieu de NodePort :

```yaml
# Dans backend-service.yaml
spec:
  type: LoadBalancer
  ports:
    - port: 3000
      targetPort: 3000
      protocol: TCP
```

### Augmenter le nombre de réplicas

```yaml
# Dans backend-deployment.yaml
spec:
  replicas: 3 # Au lieu de 2
```

## 🔐 Sécurité et bonnes pratiques

### Ajouter des secrets pour MongoDB

```bash
# Créer un secret pour le mot de passe MongoDB
kubectl create secret generic mongodb-secret \
  --from-literal=password=votreMotDePasse \
  -n devops-tp

# Puis modifier mongodb-deployment.yaml pour utiliser le secret
```

### Limiter les ressources réseau

Créer une NetworkPolicy pour isoler les pods :

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: mongodb-network-policy
  namespace: devops-tp
spec:
  podSelector:
    matchLabels:
      app: mongodb
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend
      ports:
        - protocol: TCP
          port: 27017
```

## 🧹 Nettoyage

### Option A : Avec le script (Linux/Mac/WSL)

```bash
cd ..  # Retour à la racine du projet
./cleanup.sh
```

### Option B : Nettoyage manuel

```bash
# Depuis le dossier k8s
kubectl delete -f .

# Ou supprimer le namespace entier (recommandé - supprime tout)
kubectl delete namespace devops-tp
```

> **⚠️ Note** : La suppression du namespace supprime automatiquement tous les objets qu'il contient (pods, services, PVC, etc.).
