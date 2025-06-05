# CloudWatch Log Group for ECS Tasks
resource "aws_cloudwatch_log_group" "ecs_tasks" {
  name              = "/ecs/${var.project_name}-${var.environment}"
  retention_in_days = 30 # Retain logs for 30 days

  tags = {
    Name        = "/ecs/${var.project_name}-${var.environment}"
    Environment = var.environment
    Project     = var.project_name
  }
} 