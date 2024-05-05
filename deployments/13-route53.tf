# We've manually created a route 53 hosted zone.
# - Get our already created hosted zone
data "aws_route53_zone" "main" {
  name         = var.main_api_server_domain
  private_zone = false # It's a public hosted zone.
}