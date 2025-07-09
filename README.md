# NodeJS - M1
Projet réservation matériel labo - Express MongoDB VueJS

## Déploiement sur Azure via Terraform

### Dans le repertoire ```/terraform``` :

1. Connexion à Azure CLI avec ```az login```

2. Initialisation du répertoire de travail Terraform :
   
```terraform init```

3. Création du groupe de ressources et du container registry sur Azure : 

```terraform apply -target="azurerm_resource_group.rg" -target="azurerm_container_registry.acr"```

4. Compilation et envoi des images docker sur le container registry :

```./build-push.sh```

5. Déploiement complet des conteneurs sur Azure :

```terraform apply```

6. Suppression des ressources déployées :

```terraform destroy```