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
- Contains an older major release of MongoDB (with authentication enabled) Mongo 4.0 using connection string 
- Holds highly privileged permissions in the cloud environment (VM assumes an Admin role)

### Object Storage (S3 Bucket)
- Stores MongoDB backups every hour on a cron job 
- Bucket and objects are publicly readable

### Backup Script
A scheduled script running on the MongoDB VM that:
- Dumps the MongoDB data
- Uploads it to the object storage bucket
- baked into the AMI at usr/local/bin/mongo_backup.sh

### wizexercise.txt File
- Bundled inside the container image
- availble for download / viewing

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
    ├── backend
    │   ├── Dockerfile
    │   ├── package.json
    │   └── server.js
    ├── frontend
    │   ├── default.conf
    │   ├── Dockerfile
    │   ├── index.html
    │   ├── script.js
    │   ├── style.css
    │   ├── todo.html
    │   ├── todo.js
    │   └── wizexercise.txt
    ├── infrastructure
    │   ├── charts
    │   │   └── myapp
    │   │       ├── Chart.yaml
    │   │       ├── templates
    │   │       │   ├── deployment.yaml
    │   │       │   ├── _helpers.tpl
    │   │       │   └── service.yaml
    │   │       └── values.yaml
    │   └── terraform
    │       ├── bootstrap
    │       │   ├── main.tf
    │       │   ├── terraform.tfstate
    │       │   └── terraform.tfstate.backup
    │       ├── main.tf
    │       ├── modules
    │       │   ├── eks
    │       │   │   ├── main.tf
    │       │   │   ├── outputs.tf
    │       │   │   └── variables.tf
    │       │   ├── mongodb
    │       │   │   ├── main.tf
    │       │   │   ├── outputs.tf
    │       │   │   ├── user_data.tpl
    │       │   │   └── variables.tf
    │       │   ├── s3
    │       │   │   ├── main.tf
    │       │   │   └── outputs.tf
    │       │   ├── secrets_manager
    │       │   │   ├── main.tf
    │       │   │   ├── outputs.tf
    │       │   │   └── variables.tf
    │       │   └── vpc
    │       │       ├── main.tf
    │       │       ├── outputs.tf
    │       │       └── variables.tf
    │       ├── providers.tf
    │       ├── terraform.autotfvars
    │       └── variables.tf
    └── README.md

```
