# Utiliser une image Node.js officielle
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY src ./src

# Exposer le port de l'application
EXPOSE 3000

# Définir la commande de démarrage
CMD ["node", "src/server.js"]
