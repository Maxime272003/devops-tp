#!/bin/bash

# Script de nettoyage du déploiement Kubernetes

echo "🧹 Nettoyage du déploiement Todo sur Kubernetes"
echo "==============================================="

# Supprimer tous les déploiements
echo "🗑️  Suppression des déploiements..."
kubectl delete -f k8s/backend-service.yaml --ignore-not-found=true
kubectl delete -f k8s/backend-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/mongodb-service.yaml --ignore-not-found=true
kubectl delete -f k8s/mongodb-deployment.yaml --ignore-not-found=true
kubectl delete -f k8s/mongodb-pvc.yaml --ignore-not-found=true

# Attendre que les pods soient supprimés
echo "⏳ Attente de la suppression des pods..."
sleep 5

# Supprimer le namespace
echo "📦 Suppression du namespace..."
kubectl delete namespace devops-tp --ignore-not-found=true

echo ""
echo "✅ Nettoyage terminé !"
