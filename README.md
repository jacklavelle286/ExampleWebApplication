# ExampleWebApplication

Welcome to the ExampleWebApplication repository! This project is a three-tiered web application demonstrating how to containerize, deploy, and secure a simple web app (front-end + back-end), integrate it with a MongoDB database, and store MongoDB backups in a public-read object storage bucket.

This setup aligns with the requirements of the Wiz Field Technical Exercise, which tests proficiency in deploying and managing cloud-based solutions with an emphasis on security, automation, and clear communication.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Key Requirements](#key-requirements)
- [Repository Structure](#repository-structure)
- [MongoDB Backups](#mongodb-backups)
- [Security & Access Notes](#security--access-notes)

## Overview
**Cloud Environment:** Deployed in AWS 

**Three-Tier Architecture:**
1. **Web/App Tier:** A containerized web application running in a Kubernetes cluster, exposed publicly via a load balancer.
2. **Database Tier:** A dedicated VM (EC2) running an older MongoDB release, configured with authentication.
3. **Storage Tier:** An S3 bucket used for storing regular MongoDB backups, granting public read access to the objects.

This approach demonstrates:
- Containerization (Docker + Kubernetes)
- Secure (authenticated) database connections
- Automated backups to publicly readable object storage
- Infrastructure as Code (Terraform)

## Architecture
### Kubernetes Cluster
- Hosts the Dockerized web application
- Deployed in the same VPC as the MongoDB VM for direct network access
- Exposed publicly via a load balancer

### MongoDB VM
- Runs an outdated Linux OS (Amazon Linux 2)
- Contains an older major release of MongoDB (with authentication enabled) 
- Holds highly privileged permissions in the cloud environment (VM assumes an Admin role)

### Object Storage (S3 Bucket)
- Stores MongoDB backups
- Bucket and objects are publicly readable

### Backup Script
A scheduled script running on the MongoDB VM that:
- Dumps the MongoDB data
- Uploads it to the object storage bucket

### wizexercise.txt File
- Bundled inside the container image
- Demonstrates custom file inclusion in container images for compliance/validations

## Key Requirements
This repository and deployment aim to address the Wiz Field Technical Exercise requirements:
- Containerized Web Application – Running on Kubernetes, publicly accessible
- VM-based MongoDB – Using authentication and an older OS + MongoDB version
- Object Storage – Publicly readable backups
- Backup Script – Automated, scheduled backups of MongoDB
- Security – Authentication for MongoDB, cloud IAM roles, and cluster-admin privileges
- Infrastructure-as-Code – Automated provisioning via Terraform (where possible)

## Repository Structure
```
ExampleWebApplication/
├─ infrastructure/
│  ├─ terraform/            # Example Terraform files for AWS + EKS + EC2 + S3
│  └─ ...
├─ frontend/
│  ├─ index.html           # Simple HTML/Bootstrap front-end
│  ├─ Dockerfile           # Builds a container image with the wizexercise.txt file
│  └─ style.css           # Basic styling
├─ backend/
│  └─ server.js           # Example Node.js server code (if applicable)
├─ wizexercise.txt        # Required file included in the container
├─ scripts/
│  └─ backup.sh           # MongoDB backup script
├─ .github/workflows/
│  ├─ ci_pipeline.yml     # Example GitHub Actions pipeline for build/test
│  └─ tf_pipeline.yml     # Example pipeline for Terraform apply/destroy
└─ README.md             # This file
```

## How to Deploy
### 1. Fork/Clone this Repository
- Clone locally or to your chosen CloudLabs environment

### 2. Infrastructure Provisioning (Terraform)
```bash
cd infrastructure/terraform/
terraform init
terraform plan
terraform apply
```

### 3. Build & Push Container Image
```bash
cd frontend/
docker build -t <your-repo>:latest .
docker push <your-repo>:latest
```

### 4. Deploy to Kubernetes
```bash
kubectl apply -f k8s_deployment.yaml
```

### 5. Access the Application
- Find the Load Balancer endpoint from your Kubernetes Service
- Access the app at `http://<your-load-balancer>:<port>/`

## MongoDB Backups
- **Script:** `scripts/backup.sh`
- **Crontab:** Runs daily at 9am UTC
- **Action:** Dumps MongoDB data and uploads to S3
- **Validation:** Check public file URL in S3 console

## Security & Access Notes
### MongoDB Authentication
- Enabled via mongod.conf
- Uses authenticated user credentials
- Connection string secured in container environment

### Highly Privileged VM
- EC2 instance has admin CSP permissions (intentionally)
- Demonstrates potential misconfigurations

### Object Storage Permissions
- Public-read access configured
- Direct S3 URL access enabled

### Kubernetes Cluster-Admin
- Container granted cluster-admin privileges
- Intentionally permissive for exercise

### IAM Roles
- EC2 and EKS nodes configured with necessary IAM roles
- Permissions for resource management and backup uploads
