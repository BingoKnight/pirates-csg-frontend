terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.8"
    }
  }

  backend "s3" {
    region               = "us-east-1"
    bucket               = "nathan-terraform-state"
    key                  = "terraform.tfstate"
    workspace_key_prefix = "pirates-csg-frontend"
    profile              = "pirates-csg-admin"
  }
}
