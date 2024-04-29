resource "aws_codedeploy_app" "code_deploy_app" {
  name             = "${local.prefix}-app"
  compute_platform = "Server" # Server is equals to EC2/On-premise
}

resource "aws_codedeploy_deployment_group" "code_deploy_app_group" {
  app_name               = aws_codedeploy_app.code_deploy_app.name
  deployment_group_name  = "${local.prefix}-group"
  deployment_config_name = "CodeDeployDefault.AllAtOnce"
  service_role_arn       = aws_iam_role.code_deploy_iam_role.arn
  autoscaling_groups     = [aws_autoscaling_group.ec2_autoscaling_group.name]

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  load_balancer_info {
    target_group_info {
      name = aws_alb_target_group.server_backend-tg.name
    }
  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"] # Rollback when deployment fails.
  }

  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT" # Continue deployment even if some of our scripts (example: our userdata) fail.
    }

    green_fleet_provisioning_option {
      action = "COPY_AUTO_SCALING_GROUP"
    }

    terminate_blue_instances_on_deployment_success {
      action                           = "TERMINATE"
      termination_wait_time_in_minutes = 0 # Terminate it immediately.
    }
  }
}