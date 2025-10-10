#!/bin/bash

# Script de déploiement complet sur Kubernetes

set -e

echo "🚀 Déploiement de l'application Todo sur Kubernetes"
echo "=================================================="

# Vérifier que kubectl est installé
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl n'est pas installé"
    exit 1
fi

# Vérifier que minikube est démarré (optionnel)
if command -v minikube &> /dev/null; then
    if ! minikube status &> /dev/null; then
        echo "⚠️  Minikube n'est pas démarré. Démarrage..."
        minikube start
    fi
    
    # Utiliser le Docker daemon de Minikube
    echo "🔧 Configuration de l'environnement Docker de Minikube"
    eval $(minikube docker-env)
fi

# Construire les images Docker
echo "🏗️  Construction de l'image Docker du backend..."
docker build -t todo-backend:latest ./backend

echo "🏗️  Construction de l'image Docker du frontend..."
docker build -t todo-frontend:latest ./frontend

# Créer le namespace
echo "📦 Création du namespace..."
kubectl apply -f k8s/namespace.yaml

# Déployer MongoDB
echo "🗄️  Déploiement de MongoDB..."
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

# Attendre que MongoDB soit prêt
echo "⏳ Attente du démarrage de MongoDB..."
kubectl wait --for=condition=ready pod -l app=mongodb -n devops-tp --timeout=120s

# Déployer le Backend
echo "🔧 Déploiement du Backend..."
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Attendre que le backend soit prêt
echo "⏳ Attente du démarrage du Backend..."
kubectl wait --for=condition=ready pod -l app=backend -n devops-tp --timeout=120s

# Déployer le Frontend
echo "🎨 Déploiement du Frontend..."
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Attendre que le frontend soit prêt
echo "⏳ Attente du démarrage du Frontend..."
kubectl wait --for=condition=ready pod -l app=frontend -n devops-tp --timeout=120s

# Afficher le statut
echo ""
echo "✅ Déploiement terminé !"
echo ""
echo "📊 Statut des pods:"
kubectl get pods -n devops-tp

echo ""
echo "🌐 Services:"
kubectl get services -n devops-tp

echo ""
echo "🔗 Accès à l'application:"
if command -v minikube &> /dev/null; then
    echo "   Frontend: minikube service frontend -n devops-tp"
    echo "   Backend: minikube service backend -n devops-tp"
else
    echo "   Frontend: kubectl port-forward service/frontend 8080:80 -n devops-tp"
    echo "   Backend: kubectl port-forward service/backend 3000:3000 -n devops-tp"
    echo "   Puis accédez à: http://localhost:8080"
fi
