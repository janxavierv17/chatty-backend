# ElastiCache config
# - We'll associate this to a NAT gateway config
resource "aws_eip" "elastic_ip" {
  depends_on = [aws_internet_gateway.main_igw]
  tags       = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-eip" }))
}

# Another elastic IP for our second availability zone (Optional)
# resource "aws_eip" "elastic_ip" {
#   depends_on = [ aws_internet_gateway.main_igw ]
#   tags = merge(local.common_tags, tomap({"Name" = "${local.prefix}-eip"}))
# }