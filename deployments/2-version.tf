# Terraform provider & their versions
terraform {
  required_version = "~> 1.8.1"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0" # At least use a version that is 3.0 or higher.
    }
  }
}

provider "aws" {
  region = var.aws_region
}