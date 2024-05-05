# NAT gateway config
# - For Availablility zone 1
# - Make sure to associate our NAT to an IP address to avoid getting charged
# - We'll only create one NAT (it's expensive).
resource "aws_nat_gateway" "nat_gateway" {
  subnet_id     = aws_subnet.public_subnet_a.id
  allocation_id = aws_eip.elastic_ip.id

  tags = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-nat-gw" }))
}

# We can create another NAT for our second availability zone (optional)
