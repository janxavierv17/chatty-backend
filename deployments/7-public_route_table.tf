resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main.id
  tags   = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-public-RT" }))
}

resource "aws_route" "public_igw_route" {
  route_table_id         = aws_route_table.public_route_table.id
  destination_cidr_block = var.global_destination_cidr_block # Allows public traffic
  gateway_id             = aws_internet_gateway.main_igw.id

  # This would mean that before this resource gets create the list in the array has to be created first.
  depends_on = [aws_route_table.public_route_table]
}

# Specifies the allowed ip address
resource "aws_route_table_association" "public_subnet_1_association" {
  route_table_id = aws_route_table.public_route_table.id
  subnet_id      = aws_subnet.public_subnet_a.id
}

resource "aws_route_table_association" "public_subnet_2_association" {
  route_table_id = aws_route_table.public_route_table.id
  subnet_id      = aws_subnet.public_subnet_c.id
}