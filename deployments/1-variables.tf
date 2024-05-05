variable "aws_region" {
  description = "Region in which AWS resources are created"
  type        = string
  default     = "ap-southeast-2"
}

# We'll be able to assign ip addresses.
variable "vpc_cidr_block" {
  description = "VPC CIDR Block"
  type        = string
  default     = "10.0.0.0/16"
}

# We'll only be using two availability zones.
# aws ec2 describe-availability-zones --region ap-southeast-2
#  - Displays a list of availability zones.
variable "vpc_availability_zones" {
  description = "VPC Availability Zones"
  type        = list(string)
  default     = ["ap-southeast-2a", "ap-southeast-2c"]
}

# Allow internet/public access
variable "vpc_public_subnets" {
  description = "VPC Public Subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

# Where internet/public has no access.
variable "vpc_private_subnets" {
  description = "VPC Private Subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

# Allow traffic from any ip addresses.
variable "global_destination_cidr_block" {
  description = "CIDR Block for all IPs"
  type        = string
  default     = "0.0.0.0/0"
}

# Allows us the ability to access private addresses.
# Bastion is an ec2 instance
variable "bastion_host_cidr" {
  description = "CIDR Block for Bastion Host Ingress"
  type        = string
  default     = "159.196.171.65/32" # Use public ip address here.
}

variable "https_ssl_policy" {
  description = "HTTPS SSL Policy"
  type        = string
  default     = "ELBSecurityPolicy-2016-08"
}

# The domain we bought for a year.
# expensive asf T.T
variable "main_api_server_domain" {
  description = "Main API Server Domain"
  type        = string
  default     = "jan-xv.com"
}

# Ensure that the env file is manually stored in our s3 bucket.
# variable "dev_api_server_domain" {
#   description = "Dev API Server Domain"
#   type        = string
#   default     = "api.dev.jan-xv.com"
# }

# Ensure that the env file is manually stored in our s3 bucket.
variable "dev_api_server_domain" {
  description = "Dev API Server Domain"
  type        = string
  default     = "api.staging.jan-xv.com"
}

# Ensure that the env file is manually stored in our s3 bucket.
variable "dev_api_server_domain" {
  description = "Dev API Server Domain"
  type        = string
  default     = "api.jan-xv.com"
}

variable "ec2_iam_role_name" {
  description = "EC2 IAM Role Name"
  type        = string
  default     = "administrator-ec2-role"
}

variable "ec2_iam_role_policy_name" {
  description = "EC2 IAM Role Policy Name"
  type        = string
  default     = "administrator-ec2-role-policy"
}

variable "ec2_instance_profile_name" {
  description = "EC2 Instance Profile Name"
  type        = string
  default     = "server-ec2-instance-profile"
}

# ElastiCache for redis
variable "elasticache_node_type" {
  description = "Elasticache Node Type"
  type        = string
  default     = "cache.t2.micro"
}

# Redis's version which 6.x
variable "elasticache_parameter_group_name" {
  description = "Elasticache Parameter Group Name"
  type        = string
  default     = "default.redis6.x"
}

# Ensure that we're using the free tier for the meantime.
# t2.micro seems to have an issue even before running our app
#  - Runs out of memory for some reason.
variable "ec2_instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t2.medium"
}

# Since we're not installing anything in our bastion we'll keep it small
#  - micro should be enough
variable "bastion_host_type" {
  description = "Bastion Instance Type"
  type        = string
  default     = "t2.micro"
}

variable "code_deploy_role_name" {
  description = "CodeDeploy IAM Role"
  type        = string
  default     = "server-codedeploy-role"
}

# Tags for our resources
# for example 
# - Our vpc would be named something like "chatty-app-server-vpc"
variable "prefix" {
  description = "Prefix to be added to AWS resources tags"
  type        = string
  default     = "chatty-app-server"
}

variable "project" {
  description = "Prefix to be added to AWS resources local tags"
  type        = string
  default     = "chatty-app-server"
}
