    terraform {
    required_providers {
        azurerm = {
        source  = "hashicorp/azurerm"
        version = "~> 3.0"
        }
    }

    required_version = ">= 1.3.0"
    }

    provider "azurerm" {
    features {}
    }

    # Resource Group
    resource "azurerm_resource_group" "rg" {
    name     = "rg-lab-rental"
    location = "West Europe"
    }

    # Azure Container Registry
    resource "azurerm_container_registry" "acr" {
    name                = "labrentalacr"
    resource_group_name = azurerm_resource_group.rg.name
    location            = azurerm_resource_group.rg.location
    sku                 = "Basic"
    admin_enabled       = true
    }

    # Container Group - Mongo
    resource "azurerm_container_group" "mongo" {
    name                = "mongo"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    os_type             = "Linux"
    ip_address_type     = "Public"
    dns_name_label      = "mongo-lab"

    container {
        name   = "mongo"
        image  = "${azurerm_container_registry.acr.login_server}/mongo:latest"
        cpu    = "0.5"
        memory = "1.5"

        ports {
            port = 27017
        }

        environment_variables = {
            MONGO_INITDB_ROOT_USERNAME = "admin-lab"
            MONGO_INITDB_ROOT_PASSWORD = "9Kzas7rghm6bXeqnBEFD7Yjx7qaQFXzs6T5mc4fm"
        }
    }

    image_registry_credential {
        server   = azurerm_container_registry.acr.login_server
        username = azurerm_container_registry.acr.admin_username
        password = azurerm_container_registry.acr.admin_password
    }

    tags = {
        environment = "lab"
    }
    }

    # Container Group - Backend
    resource "azurerm_container_group" "backend" {
    name                = "backend"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    os_type             = "Linux"
    ip_address_type     = "Public"
    dns_name_label      = "backend-lab"

    container {
        name   = "backend"
        image  = "${azurerm_container_registry.acr.login_server}/backend:latest"
        cpu    = "0.5"
        memory = "1.5"

        ports {
        port = 5000
        }

        environment_variables = {
        PORT                                       = "5000"
        CLIENT_URL                                 = "http://frontend-lab.westeurope.azurecontainer.io"
        MONGO_URI                                  = "mongodb://admin-lab:9Kzas7rghm6bXeqnBEFD7Yjx7qaQFXzs6T5mc4fm@${azurerm_container_group.mongo.fqdn}:27017/lab-rental-service?authSource=admin"
        JWT_SECRET                                 = "secret_secret_secret"
        BREVO_LOGIN                                = "8b6c1c001@smtp-brevo.com"
        BREVO_EMAIL                                = "luigiaubrypouget@gmail.com"
        BREVO_API_KEY                              = "hdV9KPO2s6mvNpEH"
        RENTAL_DURATION_IN_DAYS                    = "30"
        REMINDER_BEFORE_RENTAL_ENDING_IN_DAYS      = "7"
        }
    }

    image_registry_credential {
        server   = azurerm_container_registry.acr.login_server
        username = azurerm_container_registry.acr.admin_username
        password = azurerm_container_registry.acr.admin_password
    }

    tags = {
        environment = "lab"
    }
    }

    # Container Group - Frontend
    resource "azurerm_container_group" "frontend" {
    name                = "frontend"
    location            = azurerm_resource_group.rg.location
    resource_group_name = azurerm_resource_group.rg.name
    os_type             = "Linux"
    ip_address_type     = "Public"
    dns_name_label      = "frontend-lab"

    container {
        name   = "frontend"
        image  = "${azurerm_container_registry.acr.login_server}/frontend:latest"
        cpu    = "0.5"
        memory = "1.5"

        ports {
        port = 80
        }
    }

    image_registry_credential {
        server   = azurerm_container_registry.acr.login_server
        username = azurerm_container_registry.acr.admin_username
        password = azurerm_container_registry.acr.admin_password
    }

    tags = {
        environment = "lab"
    }
    }

    output "frontend_url" {
    value = "http://${azurerm_container_group.frontend.fqdn}"
    }

    output "backend_url" {
    value = "http://${azurerm_container_group.backend.fqdn}"
    }