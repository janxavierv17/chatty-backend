resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-private-RT" }))
}

resource "aws_route" "private_nat_gw" {
  route_table_id         = aws_route_table.private_route_table.id
  destination_cidr_block = var.global_destination_cidr_block
  nat_gateway_id         = aws_nat_gateway.nat_gateway.id
  # gateway_id = aws_internet_gateway.main_igw.id # Since this is a private network we won't be needing this.

}

# Specifies the allowed ip address
resource "aws_route_table_association" "private_subnet_1_association" {
  route_table_id = aws_route_table.private_route_table.id
  subnet_id      = aws_subnet.private_subnet_a.id
}

resource "aws_route_table_association" "private_subnet_2_association" {
  route_table_id = aws_route_table.private_route_table.id
  subnet_id      = aws_subnet.private_subnet_c.id
}