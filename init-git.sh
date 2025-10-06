#!/bin/bash

# Script d'initialisation Git

echo "🎯 Initialisation du dépôt Git"
echo "==============================="
echo ""

# Vérifier que git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé"
    echo "   Installez-le avec : sudo apt-get install git (Ubuntu/Debian)"
    exit 1
fi

# Initialiser le dépôt Git
if [ -d ".git" ]; then
    echo "⚠️  Le dépôt Git existe déjà"
else
    echo "📦 Initialisation du dépôt Git..."
    git init
    echo "✅ Dépôt Git initialisé"
fi

# Configurer Git (si pas déjà fait)
USER_NAME=$(git config user.name)
USER_EMAIL=$(git config user.email)

if [ -z "$USER_NAME" ]; then
    echo ""
    echo "⚙️  Configuration de Git"
    read -p "Entrez votre nom : " name
    git config user.name "$name"
fi

if [ -z "$USER_EMAIL" ]; then
    read -p "Entrez votre email : " email
    git config user.email "$email"
fi

echo ""
echo "📝 Ajout des fichiers..."
git add .

echo ""
echo "💾 Création du commit initial..."
git commit -m "Initial commit: Application Todo List avec Node.js et MongoDB

- Backend Node.js avec Express
- Base de données MongoDB
- Conteneurisation Docker
- Manifestes Kubernetes complets
- Documentation détaillée"

echo ""
echo "✅ Dépôt Git initialisé avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Créez un dépôt sur GitHub ou GitLab"
echo "   2. Exécutez ces commandes :"
echo ""
echo "      git remote add origin [URL_DU_DEPOT]"
echo "      git branch -M main"
echo "      git push -u origin main"
echo ""
echo "   3. Vérifiez que le dépôt est public"
echo "   4. Envoyez le lien par email à : stephane.talbot@univ-savoie.fr"
