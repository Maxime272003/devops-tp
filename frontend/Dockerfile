# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copier les fichiers build
COPY --from=builder /app/build /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
