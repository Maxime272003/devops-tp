# Manifestes Kubernetes - Guide d'utilisation

Ce dossier contient tous les manifestes Kubernetes nécessaires pour déployer l'application Todo List.

## 📁 Structure des fichiers

### Fichiers de base (requis)

1. **namespace.yaml** - Crée le namespace `devops-tp`
2. **mongodb-pvc.yaml** - PersistentVolumeClaim pour MongoDB (1Gi)
3. **mongodb-deployment.yaml** - Déploiement MongoDB (1 réplica)
4. **mongodb-service.yaml** - Service ClusterIP pour MongoDB
5. **backend-deployment.yaml** - Déploiement du backend Node.js (2 réplicas)
6. **backend-service.yaml** - Service NodePort pour le backend (port 30000)

### Fichiers optionnels (bonus)

7. **configmap.yaml** - ConfigMap pour la configuration du backend
8. **ingress.yaml** - Ingress pour exposer l'application avec un nom de domaine

## 🚀 Ordre de déploiement

### Déploiement de base

```bash
# 1. Créer le namespace
kubectl apply -f namespace.yaml

# 2. Déployer la couche de persistance (MongoDB)
kubectl apply -f mongodb-pvc.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-service.yaml

# 3. Attendre que MongoDB soit prêt
kubectl wait --for=condition=ready pod -l app=mongodb -n devops-tp --timeout=120s

# 4. Déployer le backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# 5. Attendre que le backend soit prêt
kubectl wait --for=condition=ready pod -l app=backend -n devops-tp --timeout=120s
```

### Déploiement avec ConfigMap (optionnel)

```bash
# Avant de déployer le backend, créer la ConfigMap
kubectl apply -f configmap.yaml

# Puis modifier backend-deployment.yaml pour utiliser envFrom au lieu de env
# (voir exemple ci-dessous)
```

### Déploiement avec Ingress (optionnel)

```bash
# 1. Installer l'Ingress Controller (si pas déjà fait)
# Pour Minikube:
minikube addons enable ingress

# Pour un cluster standard:
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# 2. Déployer l'Ingress
kubectl apply -f ingress.yaml

# 3. Ajouter l'entrée dans /etc/hosts (ou C:\Windows\System32\drivers\etc\hosts)
# Obtenir l'IP de Minikube:
minikube ip

# Ajouter dans hosts:
# <MINIKUBE_IP> todo.local

# 4. Accéder à l'application
# http://todo.local
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

### Utiliser une ConfigMap pour les variables d'environnement

Modifier `backend-deployment.yaml` :

```yaml
spec:
  containers:
    - name: backend
      envFrom:
        - configMapRef:
            name: backend-config
      # Supprimer la section env:
```

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

```bash
# Supprimer tous les objets
kubectl delete -f .

# Ou supprimer le namespace entier
kubectl delete namespace devops-tp
```

## 📝 Notes importantes

1. **ImagePullPolicy**: Le backend utilise `IfNotPresent` car l'image est construite localement avec Minikube
2. **PersistentVolumeClaim**: Utilise le StorageClass par défaut du cluster
3. **Probes**: Assurent que le backend est prêt avant de recevoir du trafic
4. **Resources**: Les limites empêchent les pods de consommer trop de ressources
5. **Namespace**: Tout est isolé dans le namespace `devops-tp`
