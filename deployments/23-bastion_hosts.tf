resource "aws_instance" "bastion_host" {
  ami                         = data.aws_ami.ec2_ami
  instance_type               = var.bastion_host_type
  vpc_security_group_ids      = [aws_security_group.bastion_host_sg]
  subnet_id                   = aws_subnet.public_subnet_a.id
  key_name                    = "chatappEC2KeyPair"
  associate_public_ip_address = true
  tags                        = merge(local.common_tags, tomap({ "Name" = "${local.prefix}-bastion-host" }))
}