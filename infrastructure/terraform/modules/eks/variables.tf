variable "eks_version" {
  type = string
  description = "The version of EKS to use"
}   

variable "public_subnets" {
  type = list(string)
  description = "The public subnets"
}

variable "private_subnets" {
  type = list(string)
  description = "The private subnets"
}

