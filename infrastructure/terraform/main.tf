module "vpc" {
  source = "./modules/vpc" 
}

module "mongo_bucket" {
  source = "./modules/s3"
}

module "secret_manager" {
  source = "./modules/secrets_manager"
  mongo_username = var.mongo_username
  mongo_host = var.mongo_host
  mongo_password = var.mongo_password
}


module "eks_cluster" {
  source           = "./modules/eks"
  vpc_id           = module.vpc.vpc_id
  public_subnets   = module.vpc.public_subnet_ids
  private_subnets  = module.vpc.private_subnet_ids
}
