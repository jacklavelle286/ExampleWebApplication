terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.18.0"
    }
  }

  backend "s3" {
    bucket         = "783764584115-us-east-1-backend-infra-tf-yt"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "783764584115-us-east-1-backend-infra-tf-yt-lock"
  }
}