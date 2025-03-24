resource "aws_ecr_repository" "frontend" {
  name = "frontend-ecr-repo"
}

resource "aws_ecr_repository" "backend" {
  name = "backend-ecr-repo"
}



# EKS Cluster IAM Role

data "aws_iam_policy_document" "eks_cluster_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "eks_cluster_role" {
  name               = "eks-cluster-role"
  assume_role_policy = data.aws_iam_policy_document.eks_cluster_assume_role.json
}

# Attach AWS-managed policies needed by the EKS cluster
resource "aws_iam_role_policy_attachment" "eks_service_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

data "aws_iam_policy_document" "pull_ecr_image" {
  statement {
    actions = ["ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage", "ecr:BatchCheckLayerAvailability"]
    resources = [aws_ecr_repository.frontend.arn, aws_ecr_repository.backend.arn]
  }
}


# EKS Fargate Pod Execution Role

data "aws_iam_policy_document" "eks_fargate_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["eks-fargate-pods.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "fargate_pod_execution_role" {
  name               = "eks-fargate-pod-execution-role"
  assume_role_policy = data.aws_iam_policy_document.eks_fargate_assume_role.json
}

# Attach AWS-managed policy for EKS Fargate
resource "aws_iam_role_policy_attachment" "eks_fargate_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSFargatePodExecutionRolePolicy"
  role       = aws_iam_role.fargate_pod_execution_role.name
}




# EKS Cluster

resource "aws_eks_cluster" "this" {
  name     = "my-eks-fargate-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = var.eks_version

  vpc_config {
    subnet_ids = concat(var.public_subnets, var.private_subnets)

  }


  depends_on = [
    aws_iam_role_policy_attachment.eks_service_policy_attachment,
    aws_iam_role_policy_attachment.eks_cluster_policy_attachment
  ]
}


# Data: Auth token for the Kubernetes provider

data "aws_eks_cluster" "this" {
  name = aws_eks_cluster.this.name
}

data "aws_eks_cluster_auth" "this" {
  name = aws_eks_cluster.this.name
}


# Kubernetes Provider

provider "kubernetes" {
  host                   = data.aws_eks_cluster.this.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.this.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.this.token

}


# Fargate Profile

resource "aws_eks_fargate_profile" "this" {
  cluster_name           = aws_eks_cluster.this.name
  fargate_profile_name   = "fargate-profile"
  pod_execution_role_arn = aws_iam_role.fargate_pod_execution_role.arn
  subnet_ids             = var.private_subnets

  selector {
    namespace = "default"

  }

  depends_on = [
    aws_eks_cluster.this,
    aws_iam_role_policy_attachment.eks_fargate_policy_attachment
  ]
}


