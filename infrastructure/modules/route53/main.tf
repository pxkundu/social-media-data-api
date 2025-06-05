# Route53 Hosted Zone (assuming domain is already registered)
data "aws_route53_zone" "main" {
  name         = "${var.domain_name}."
  private_zone = false
}

# Route53 Record for ALB
resource "aws_route53_record" "alb" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Route53 Record for CloudFront
resource "aws_route53_record" "cloudfront" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.cf_domain
    zone_id                = var.cf_zone_id
    evaluate_target_health = false
  }

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
} 