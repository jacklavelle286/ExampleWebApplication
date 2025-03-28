variable "mongo_username" {
  type = string
  description = "value for mongo username"

}

variable "mongo_password" {
  type = string
  description = "value for mongo password"

}

variable "region" {
  type = string
  description = "AWS region to deploy the resources"
  
}

variable "image_id" {
  type = string
  description = "AMI ID for the EC2 instance"
  
}