resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr_block
  instance_tenancy     = "default"                                                       # Let's try not to get charged as much as possible.
  enable_dns_hostnames = true                                                            # attach our dns to our launched instances
  tags                 = merge(local.common_tags, tomap({ "Name" = "${local.prefix}" })) # even though we named it as "locals" we have to access it as "local".
}