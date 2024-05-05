# Public subnets config
resource "aws_subnet" "public_subnet_a" {
  # Once our vpc gets created we'll gain access to it's additional attributes like the id below.
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.vpc_public_subnets[0]
  availability_zone       = var.vpc_availability_zones[0]
  map_public_ip_on_launch = true # Launch our bastion ec2 instance within this subnet.
  tags                    = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-public-1a" }))
}

resource "aws_subnet" "public_subnet_c" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.vpc_public_subnets[1]
  availability_zone       = var.vpc_availability_zones[1]
  map_public_ip_on_launch = true
  tags                    = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-public-1c" }))

}

# Private subnets config
resource "aws_subnet" "private_subnet_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.vpc_private_subnets[0]
  availability_zone = var.vpc_availability_zones[0]
  tags              = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-private-1a" }))
}

resource "aws_subnet" "private_subnet_c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.vpc_private_subnets[1]
  availability_zone = var.vpc_availability_zones[1]
  tags              = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-private-1c" }))
}