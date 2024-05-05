# When we reach a certain treshold we'll scale our app.
resource "aws_autoscaling_policy" "asg_scale_out_policy" {
  name                   = "ASG-SCALE-OUT-POLICY"
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling_group
  adjustment_type        = "ChangeInCapacity"
  policy_type            = "SimpleScaling"
  scaling_adjustment     = 1   # Add one new instance
  cooldown               = 150 # seconds before a new instance is added

  depends_on = [aws_autoscaling_group.ec2_autoscaling_group]
}

resource "aws_cloudwatch_metric_alarm" "ec2_scale_out_alarm" {
  alarm_name          = "EC2-SCALE-OUT-ALARM"
  alarm_description   = "Monitors our EC2 CPU utilizition when it reaches threshold which is 50"
  threshold           = 50 # percentage
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1" # 1 minute
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120" # seconds
  statistic           = "Average"

  alarm_actions = [aws_autoscaling_policy.asg_scale_out_policy.arn]
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling_group.name
  }
  depends_on = [aws_autoscaling_group.ec2_autoscaling_group]
}


# Removing an instance
resource "aws_autoscaling_policy" "asg_scale_in_policy" {
  name                   = "ASG-SCALE-IN-POLICY"
  autoscaling_group_name = aws_autoscaling_group.ec2_autoscaling_group
  adjustment_type        = "ChangeInCapacity"
  policy_type            = "SimpleScaling"
  scaling_adjustment     = -1  # remove one instance
  cooldown               = 150 # seconds before a new instance is added

  depends_on = [aws_autoscaling_group.ec2_autoscaling_group]
}

resource "aws_cloudwatch_metric_alarm" "ec2_scale_in_alarm" {
  alarm_name          = "EC2-SCALE-IN-ALARM"
  alarm_description   = "Monitors our EC2 CPU utilizition when it reaches threshold which is 10"
  threshold           = 10 # percentage
  comparison_operator = "LessThanOrEqualToThreshold"
  evaluation_periods  = "1" # 1 minute
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120" # seconds
  statistic           = "Average"

  alarm_actions = [aws_autoscaling_policy.asg_scale_in_policy.arn]
  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.ec2_autoscaling_group.name
  }
  depends_on = [aws_autoscaling_group.ec2_autoscaling_group]
}