variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "bucket_name" {
  description = "Name for the S3 bucket to host the frontend"
  type        = string
} 