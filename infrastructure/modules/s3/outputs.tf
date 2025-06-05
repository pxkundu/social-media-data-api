output "frontend_bucket_id" {
  description = "ID of the S3 bucket for the frontend"
  value       = aws_s3_bucket.frontend.id
}

output "frontend_bucket_arn" {
  description = "ARN of the S3 bucket for the frontend"
  value       = aws_s3_bucket.frontend.arn
}

output "frontend_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket for the frontend"
  value       = aws_s3_bucket.frontend.bucket_regional_domain_name
} 