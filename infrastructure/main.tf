terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "linkedin-analytics-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"

  project_name     = var.project_name
  environment      = var.environment
  vpc_cidr         = var.vpc_cidr
  azs              = var.availability_zones
  private_subnets  = var.private_subnet_cidrs
  public_subnets   = var.public_subnet_cidrs
  database_subnets = var.database_subnet_cidrs
}

# ECS Cluster
module "ecs" {
  source = "./modules/ecs"

  project_name    = var.project_name
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  public_subnets  = module.vpc.public_subnet_ids
}

# RDS Database
module "rds" {
  source = "./modules/rds"

  project_name    = var.project_name
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  db_name         = var.db_name
  db_username     = var.db_username
  db_password     = var.db_password
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"

  project_name    = var.project_name
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  public_subnets  = module.vpc.public_subnet_ids
  certificate_arn = var.certificate_arn
}

# CloudFront Distribution
module "cloudfront" {
  source = "./modules/cloudfront"

  project_name    = var.project_name
  environment     = var.environment
  domain_name     = var.domain_name
  certificate_arn = var.certificate_arn
}

# Route53 DNS
module "route53" {
  source = "./modules/route53"

  project_name  = var.project_name
  environment   = var.environment
  domain_name   = var.domain_name
  alb_dns_name  = module.alb.alb_dns_name
  cf_domain     = module.cloudfront.cf_domain
}

# S3 Bucket for Frontend
module "s3" {
  source = "./modules/s3"

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name
}

# CloudWatch Logs
module "cloudwatch" {
  source = "./modules/cloudwatch"

  project_name = var.project_name
  environment  = var.environment
}

# IAM Roles and Policies
module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  environment  = var.environment
}

# Security Groups
module "security_groups" {
  source = "./modules/security_groups"

  project_name    = var.project_name
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnet_ids
  public_subnets  = module.vpc.public_subnet_ids
} 