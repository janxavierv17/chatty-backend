terraform {
  backend "s3" {
    bucket  = "jan-app-terraform-state"
    key     = "develop/app.tfstate"
    region  = "ap-southeast-2"
    encrypt = true # Encrypt our state
  }
}

# Reusing variables
locals {
  # If we don't specify a workspace it'll use the default workspace
  # We'll be creating a workspace for each environment at our CI/CD pipelines
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Jan Xavier"
  }
}

