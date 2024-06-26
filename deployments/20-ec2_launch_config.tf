# Auto scaling group
resource "aws_launch_template" "asg_launch_configuration" {
  name          = "${local.prefix}-launch-config"
  image_id      = data.aws_ami.ec2_ami.id
  instance_type = var.ec2_instance_type
  key_name      = "chatappEC2KeyPair"
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_instance_profile.name
  }
  network_interfaces {
    network_card_index          = 0
    device_index                = 0
    associate_public_ip_address = false
    security_groups             = [aws_security_group.auto_scaling_group_sg.id]
  }

  user_data = filebase64("${path.module}/userdata/user-data.sh")
  lifecycle {
    create_before_destroy = true
  }
}

# resource "aws_launch_configuration" "asg_launch_configuration" {
#   name                        = "${local.prefix}-launch-config"
#   image_id                    = data.aws_ami.ec2_ami.id
#   instance_type               = var.ec2_instance_type
#   key_name                    = "chatappEC2KeyPair"
#   associate_public_ip_address = false
#   iam_instance_profile        = aws_iam_instance_profile.ec2_instance_profile.name
#   security_groups             = [aws_security_group.auto_scaling_group_sg.id]
#   user_data                   = filebase64("${path.module}/userdata/user-data.sh")
#   lifecycle {
#     create_before_destroy = true
#   }
# }