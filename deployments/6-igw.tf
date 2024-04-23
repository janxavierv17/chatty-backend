# Internet gateway config
# Attaches our internet gateway to our vpc.
# - Allows public traffic
resource "aws_internet_gateway" "main_igw" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-vpc-igw" }))
}