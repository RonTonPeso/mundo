terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "mundo-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "mundo-terraform-locks"
  }
}

provider "aws" {
  region = "us-east-1"
}

# Tags to be applied to all resources
locals {
  common_tags = {
    Project     = "Mundo"
    Environment = "production"
    ManagedBy   = "terraform"
  }
} 