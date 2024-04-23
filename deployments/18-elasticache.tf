resource "aws_elasticache_subnet_group" "elasticache_subnet_group" {
  name = "${local.prefix}-subnet-elasticache-group"
  # We need at least two subnets
  subnet_ids = [aws_subnet.private_subnet_a.id, aws_subnet.private_subnet_c.id]
}

resource "aws_elasticache_replication_group" "chattapp_redis_cluster" {
  automatic_failover_enabled = true # Automatically use a replica if main goes down.
  replication_group_id       = "${local.prefix}-redis"
  node_type                  = var.elasticache_node_type # t2.micro. Let's avoid getting charged alot.
  # replication_group_description = "Redis elasticache replication group"
  # number_cache_clusters = 2 # One primary and one replica
  num_cache_clusters   = 2 # One primary and one replica
  parameter_group_name = var.elasticache_parameter_group_name
  port                 = 6379
  multi_az_enabled     = true
  subnet_group_name    = aws_elasticache_subnet_group.elasticache_subnet_group.name
  security_group_ids   = [aws_security_group.elasticache_sg.id]
  depends_on           = [aws_security_group.elasticache_sg]
  tags                 = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-elasticache" }))

  # Runs a script at the time of creation/deletion
  provisioner "local-exec" {
    command = file("./userdata/update-env-file.sh")

    # env name we have access to for our script
    environment = {
      ELASTICACHE_ENDPOINT = self.primary_endpoint_address # Redist host of our cluster
    }
  }
}