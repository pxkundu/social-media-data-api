# IAM Roles and Policies (Example: ECS Task Role Policy to access S3 and RDS)

# This is just an example. You should define specific policies based on your application's needs.
/*
resource "aws_iam_policy" "ecs_task_policy" {
  name        = "${var.project_name}-${var.environment}-ecs-task-policy"
  description = "IAM policy for ECS tasks to access required AWS services"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ],
        Resource = [
          "arn:aws:s3:::${var.frontend_bucket_name}",
          "arn:aws:s3:::${var.frontend_bucket_name}/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "rds-db:connect"
        ],
        Resource = [
          "arn:aws:rds:*:*:dbuser:${var.db_instance_identifier}/${var.db_username}"
        ]
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-ecs-task-policy"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_attach_policy" {
  role       = var.ecs_task_role_name
  policy_arn = aws_iam_policy.ecs_task_policy.arn
}
*/ 