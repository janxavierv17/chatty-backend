# EC2 instace for our load balancer target group
resource "aws_alb_target_group" "server_backend-tg" {
  name                 = "${local.prefix}-tg"
  vpc_id               = aws_vpc.main.id
  port                 = 3001 #Our backend local env port
  protocol             = "HTTP"
  deregistration_delay = 60 # The amount of time we have before we terminate our app and restart.

  health_check {
    path                = "/healthcheck"
    port                = "traffic-port"
    protocol            = "HTTP"
    healthy_threshold   = 2   # Number of consecutive health check successes required before considering a target healthy. The range is 2-10. Defaults to 3.
    unhealthy_threshold = 10  # Number of consecutive health check failures required before considering a target unhealthy.
    interval            = 120 # checks the healthcheck endpoint every 120ms
    timeout             = 100
    matcher             = "200"
  }

  stickiness {
    type        = "app_cookie"
    cookie_name = "session" # We can find this cookie name in our server setup.
  }

  tags = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-tg" }))
}