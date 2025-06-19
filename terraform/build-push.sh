#!/bin/bash

set -e

# Variables
ACR_NAME="labrentalacr"
RESOURCE_GROUP="rg-lab-rental"

# Récupérer le login server
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query loginServer --output tsv)

# Connexion à ACR
az acr login --name $ACR_NAME

# Build et push back
docker build -t $ACR_LOGIN_SERVER/backend:latest ../api
docker push $ACR_LOGIN_SERVER/backend:latest

# Build et push front
docker build -t $ACR_LOGIN_SERVER/frontend:latest ../front
docker push $ACR_LOGIN_SERVER/frontend:latest

# Build et push mongo
docker build -t $ACR_LOGIN_SERVER/mongo:latest ../mongo
docker push $ACR_LOGIN_SERVER/mongo:latest

echo "✔️ Images pushed to ACR: $ACR_LOGIN_SERVER"