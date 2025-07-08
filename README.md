# nodejs-m1
Projet réservation matériel labo - Express MongoDB VueJS

## Déploiement sur Azure via Terraform

### Dans le repertoire ```/terraform``` :

Création du groupe de ressources et du container registry sur Azure : 

```terraform apply -target="azurerm_resource_group.rg" -target="azurerm_container_registry.acr"```

Compilation et envoi des images docker sur le container registry :

```./build-push.sh```

Déploiement complet des conteneurs sur Azure :

```terraform apply```