# Étape 1 - Build de l'app Vite
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# L'environnement de build est "production"
ENV NODE_ENV=production

RUN npm run build

# Étape 2 - Serveur web statique
FROM nginx:alpine

# Copie les fichiers compilés
COPY --from=build /app/dist /usr/share/nginx/html

# Copie la configuration NGINX personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Expose le port utilisé
EXPOSE 80
