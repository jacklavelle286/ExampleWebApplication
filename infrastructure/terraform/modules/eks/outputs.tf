output "cluster_load_balancer_dns" {
  description = "The DNS name of the load balancer for the EKS cluster"
  value       = module.eks.cluster_load_balancer_dns
  
}