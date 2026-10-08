# NJ Tours AWS Production Deployment Guide

This document outlines the step-by-step architecture and procedure for deploying the **NJ Tours (National Journey)** backend onto Amazon Web Services (AWS) using high-availability, containerized services.

---

## 1. Architecture Overview

```mermaid
graph TD
    Client[Web Browser / App Client] -->|HTTPS| ALB[Application Load Balancer]
    ALB -->|Port 80/443| ECS[ECS Fargate Tasks]
    ECS -->|MySQL| RDS[Amazon RDS Multi-AZ MySQL]
    ECS -->|Redis Broker| Elasticache[Amazon ElastiCache Redis]
    ECS -->|Store uploads| S3[Amazon S3 Bucket]
```

- **Infrastructures**:
  - **AWS ALB**: Handles TLS termination and routes `/api/*` and `/ws/*` traffic to the backend tasks.
  - **AWS ECS (Fargate)**: Serverless container compute running the FastAPI app and Celery worker.
  - **Amazon RDS (MySQL 8.0)**: Managed database with Multi-AZ replication.
  - **Amazon ElastiCache (Redis)**: Managed cache and Celery broker.
  - **Amazon S3**: Object storage for vehicles, drivers, packages media.

---

## 2. Infrastructure as Code (Terraform Template)

Create a deployment configuration `deploy.tf` to provision the resources:

```hcl
provider "aws" {
  region = "ap-south-1" # Mumbai region for Indian market
}

# 1. VPC & Subnets configuration
resource "aws_vpc" "nj_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}

# 2. Database (RDS Multi-AZ MySQL)
resource "aws_db_instance" "nj_rds" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "8.0"
  instance_class       = "db.t3.micro"
  db_name              = "nj_tours"
  username             = "admin"
  password             = "supersecurepassword123"
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true
  multi_az             = true
}

# 3. ElastiCache Redis
resource "aws_elasticache_cluster" "nj_redis" {
  cluster_id           = "nj-redis-cluster"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
}

# 4. S3 Bucket for Media Uploads
resource "aws_s3_bucket" "nj_media_bucket" {
  bucket = "nj-tours-media-production-storage"
}
```

---

## 3. Deployment Command Sequence

Ensure AWS CLI is configured locally, then execute:

```bash
# 1. Login to AWS Elastic Container Registry (ECR)
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com

# 2. Create ECR repositories
aws ecr create-repository --repository-name nj-tours-backend
aws ecr create-repository --repository-name nj-tours-nginx

# 3. Build & Tag Docker Images
docker build -t nj-tours-backend ./backend
docker tag nj-tours-backend:latest <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/nj-tours-backend:latest

# 4. Push to ECR
docker push <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/nj-tours-backend:latest
```

---

## 4. ECS Task Definition Env Configuration

```json
[
  {
    "name": "DATABASE_URL",
    "value": "mysql+aiomysql://admin:supersecurepassword123@nj-rds-endpoint:3306/nj_tours"
  },
  {
    "name": "REDIS_URL",
    "value": "redis://nj-redis-cluster-endpoint:6379/0"
  }
]
```
