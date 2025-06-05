variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

# Example variables - adjust as needed for your policies
/*
variable "frontend_bucket_name" {
  description = "Name of the S3 bucket for the frontend"
  type        = string
}

variable "db_instance_identifier" {
  description = "Identifier of the RDS instance"
  type        = string
}

variable "db_username" {
  description = "Database master username"
  type        = string
}

variable "ecs_task_role_name" {
  description = "Name of the ECS task role"
  type        = string
}
*/ 