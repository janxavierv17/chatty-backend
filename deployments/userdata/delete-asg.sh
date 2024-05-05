#!/bin/bash

# We want to get the auto-scaling-group
ASG=$(aws autoscaling describe-auto-scaling-groups --no-paginate --output text --query "AutoScalingGroups[? Tags[? (Key=='Type') && Value=='$ENV_TYPE']]".AutoScalingGroupName)
aws autoscaling delete-auto-scaling-group --auto-scaling-group-name $ASG --force-delete

aws autoscaling describe-auto-scaling-groups --query "AutoScalingGroups[? Tags[? (Key=='Name') && Value=='EC2-ASG-default']]".AutoScalingGroupName
