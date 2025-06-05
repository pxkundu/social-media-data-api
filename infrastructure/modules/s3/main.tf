# S3 Bucket for Frontend Static Files
resource "aws_s3_bucket" "frontend" {
  bucket = var.bucket_name

  tags = {
    Name        = var.bucket_name
    Environment = var.environment
    Project     = var.project_name
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls   = true
  block_public_policy = true
  ignore_public_acls  = true
  restrict_public_buckets = true
}

# S3 Bucket Policy for CloudFront OAI (if using S3 origin)
/*
resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid    = "AllowCloudFrontOAI",
        Effect = "Allow",
        Principal = {
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity <YOUR_OAI_ID>"
        },
        Action   = "s3:GetObject",
        Resource = [
          "${aws_s3_bucket.frontend.arn}/*",
          "${aws_s3_bucket.frontend.arn}"
        ]
      }
    ]
  })
}
*/

# S3 Bucket for Terraform State (if not using dedicated bucket outside this module)
/*
resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.project_name}-${var.environment}-terraform-state"

  tags = {
    Name        = "${var.project_name}-${var.environment}-terraform-state"
    Environment = var.environment
    Project     = var.project_name
  }
}

# S3 Bucket Versioning (for state bucket)
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# DynamoDB Table for Terraform State Locking (if not using dedicated table outside this module)
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "${var.project_name}-${var.environment}-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-terraform-locks"
    Environment = var.environment
    Project     = var.project_name
  }
}
*/ 