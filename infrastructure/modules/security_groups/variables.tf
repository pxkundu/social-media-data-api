variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 8000
}

# These variables are needed to allow ingress from specific security groups
variable "alb_security_group_id" {
  description = "ID of the ALB security group"
  type        = string
}

variable "ecs_security_group_id" {
  description = "ID of the ECS tasks security group"
  type        = string
}

variable "rds_security_group_id" {
  description = "ID of the RDS security group"
  type        = string
} 