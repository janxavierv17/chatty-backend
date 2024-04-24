# Security group
# - Accessing our bastion securely. No HTTP and or HTTPS.
resource "aws_security_group" "bastion_host_sg" {
  name        = "${local.prefix}-bastion-host-sg"
  description = "Allows SSH into bastion host instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "TCP"
    cidr_blocks = [var.bastion_host_cidr]
    description = "Only allow SSH into our bastion host instance"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-host-sg" }))
}

resource "aws_security_group" "alb_sg" {
  name        = "${local.prefix}-alb-sg"
  description = "Allows traffic through the application node balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80 # Port for HTTP
    to_port     = 80
    protocol    = "TCP"
    cidr_blocks = [var.global_destination_cidr_block]
    description = " Allow HTTP access to our load balancer"
  }

  ingress {
    from_port   = 443 # Port for HTTPS
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = [var.global_destination_cidr_block]
    description = " Allow HTTPS access to our load balancer"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-alb-sg" }))
}

# Our EC2 instances will come through our auto scaling group (ASG)
resource "aws_security_group" "auto_scaling_group_sg" {
  name        = "${local.prefix}-autoscaling-group-sg"
  description = "Allows internet access for instances launch with ASG"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 80 # Port for HTTP
    to_port         = 80
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allow HTTP traffic into our websever"
  }

  ingress {
    from_port       = 443 # Port for HTTPS
    to_port         = 443
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allow HTTPS traffic into our webserver"
  }

  ingress {
    from_port       = 22
    to_port         = 22
    protocol        = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id]
    description     = "Allow SSH into our auto scaling group."
  }

  ingress {
    from_port       = 3001
    to_port         = 3001
    protocol        = "TCP"
    security_groups = [aws_security_group.alb_sg.id]
    description     = "Allow access into our websserver through ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-asg-sg" }))
}

resource "aws_security_group" "elasticache_sg" {
  name        = "${local.prefix}-elasticache-sg"
  description = "Allow access to our elasticache service"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 6379 # Port for HTTP
    to_port         = 6379
    protocol        = "TCP"
    security_groups = [aws_security_group.bastion_host_sg.id]
    description     = "Allow access into our redis server through bastion host"
  }

  ingress {
    from_port       = 6379 # Port for HTTP
    to_port         = 6379
    protocol        = "TCP"
    security_groups = [aws_security_group.auto_scaling_group_sg.id]
    description     = "Allow access to redis server through ASG"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.global_destination_cidr_block]
  }

  tags = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-elasticache-sg" }))
}