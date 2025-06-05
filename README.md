# LinkedIn Data Analytics Application

## Project Overview

This project is a web application designed to fetch and analyze personal data from LinkedIn using the LinkedIn Marketing API (assuming adaptation for personal data access based on project evolution). It features a React frontend for visualization and user interaction, a Python FastAPI backend for API communication and data processing, and AWS infrastructure provisioned with Terraform.

## Architecture

- **Frontend**: Built with React, utilizing Material-UI for a responsive and modern user interface. Includes pages for viewing Profile, Posts, Articles, and Analytics, as well as a Configuration page for managing LinkedIn credentials.
- **Backend**: Developed with Python FastAPI. It handles authentication via OAuth 2.0, securely stores credentials using encryption, fetches data from the LinkedIn API, and exposes endpoints for the frontend.
- **Infrastructure**: Provisioned on AWS using Terraform. Designed as a microservices architecture running on Amazon ECS (Fargate), utilizing RDS for the database, ALB for load balancing, CloudFront for CDN, Route53 for DNS, S3 for static frontend hosting, CloudWatch for logging, and appropriate IAM roles and Security Groups.
- **CI/CD**: Automated pipelines using GitHub Actions for building, testing, and deploying both the application code and the infrastructure.

### Frontend Architecture Diagram

```txt
+------------------+
|     User Browser |
| +----------------+
| |                |
| |  React App     |
| |  (Material-UI) |
| |                |
| +-------+--------+
|         |        
|         | HTTP/S
|         |        
+---------+--------+
          | Frontend Routes
          | (Profile, Posts, Articles, Analytics, Config)
          |
+---------+--------+
|   API Services   |
| (api.js, etc.)   |
+------------------+
```

### Backend Architecture Diagram

```txt
+----------------------+
|      User Request    |
+----------+-----------+
           |           
           | HTTP/S
           |           
+----------+-----------+
|    ALB (via CF)      |
+----------+-----------+
           |           
           | HTTP
           | (Internal)
+----------+-----------+
|  ECS Service         |
| +------------------+
| |  FastAPI App     |
| |  (/api/...)      |
| | +--------------+
| | |  API Endpoints |
| | +------+-------+
| |        |       
| |  +-----+-----+
| |  | Service   |
| |  | Logic     |
| |  +-----+-----+
| |        |       
| |  +-----+-----+
| |  | Config    |
| |  | Service   |
| |  +-----------+
| |        | (Enc/Dec)
| |  +-----+-----+
| |  | LinkedIn  |
| |  | API Client|
| |  +-----+-----+
| |        |       
| +--------+-------+
|          |       
|    +-----+------+
|    | Database   |
|    | (RDS)      |
|    +------------+
+----------------------+
```

### Infrastructure Architecture Diagram

```txt
+--------------+
|    Internet  |
+------++------+
       ||       
       || HTTPS
       ||       
+------++------+
| CloudFront   |
| (CDN/SSL)    |
+------++------+
       ||       
       || HTTPS
       ||       
+------++------+
| Route 53     |
| (DNS)        |
+------++------+
       ||       
       || HTTPS
       ||       
+------++------+
| ALB          |
| (Load Balancer)|
+------++------+
       ||       
       || HTTP (Internal)
       ||       
+------++------+
| Private Subnets|
| +------------+ |
| | ECS Service| |
| | (Fargate)  | |
| +------+-----+ |
|        |       |
| +------+-----+ |
| | Database   | |
| | (RDS)      | |
| +------------+ |
+------++------+
       ||       
       || To AWS Services (S3, ECR, CloudWatch via Endpoints)
       ||       
+------++------+
| NAT Gateway  |
| (Outbound)   |
+------++------+
       ||       
+------++------+
| Public Subnets |
+----------------+
```

## Features

- Secure OAuth 2.0 flow for LinkedIn authentication.
- Encrypted storage of sensitive LinkedIn credentials.
- Display of personal LinkedIn Profile, Posts, and Articles (based on API access).
- Analytics dashboard with dummy data visualization (ready for real data integration).
- Responsive UI/UX using Material-UI.
- GitHub Actions for automated application and infrastructure deployment.
- Terraform for reproducible infrastructure provisioning.

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone <your_repo_url>
    cd social-media-data-api # or your project root directory
    ```

2.  **LinkedIn Developer Setup:**
    -   Follow the instructions to create a LinkedIn Developer application and obtain your Client ID and Client Secret. You will also need to set up redirect URIs for the OAuth flow.

3.  **AWS Setup:**
    -   Ensure you have an AWS account configured with necessary permissions to create resources (VPC, ECS, RDS, ALB, CloudFront, Route53, S3, CloudWatch, IAM, Security Groups).
    -   Configure an S3 bucket and a DynamoDB table for Terraform remote state and state locking, respectively.
    -   Set up an ACM certificate for your domain in the AWS region you plan to deploy to.
    -   Configure an IAM OIDC provider and role in AWS for GitHub Actions to assume during Terraform deployments. Replace the placeholder ARN in `.github/workflows/terraform.yml`.

4.  **Environment Variables:**
    -   Create `.env` files for both the backend and frontend based on the provided examples:
        -   Copy `backend/.env.example` to `backend/.env` and fill in your LinkedIn credentials, database connection details, and other configurations.
        -   Copy `frontend/.env.example` to `frontend/.env` and fill in the backend API URL and other frontend configurations.

5.  **Install Dependencies:**
    -   **Backend:**

        ```bash
        cd backend
        pip install -r requirements.txt
        ```

    -   **Frontend:**

        ```bash
        cd frontend
        npm install
        ```

## Running Locally

1.  **Start the Backend:**

    ```bash
    cd backend
    uvicorn main:app --reload
    ```

2.  **Start the Frontend:**

    ```bash
    cd frontend
    npm start
    ```

    The frontend should open in your browser, typically at `http://localhost:3000`.

## Deployment

The project includes GitHub Actions workflows for automated CI/CD.

-   **Application (Backend & Frontend):** The workflows in `.github/workflows/` handle building, testing, and deploying the backend to ECS and the frontend to GitHub Pages/S3.
-   **Infrastructure:** The workflow in `.github/workflows/terraform.yml` automates the provisioning and management of AWS infrastructure using Terraform.
    -   **Pull Requests:** Triggers `terraform plan` to show the proposed infrastructure changes.
    -   **Pushes to `main`:** Triggers `terraform apply -auto-approve` to deploy infrastructure changes.
    -   **Pushes to `develop`:** Triggers `terraform plan` and indicates manual approval is needed before deployment.

**GitHub Secrets Required:**
-   `TF_STATE_BUCKET_NAME`: Name of the S3 bucket for Terraform state.
-   `TF_STATE_LOCK_TABLE`: Name of the DynamoDB table for Terraform state locking.
-   `AWS_ACCOUNT_ID`: Your AWS Account ID.
-   `AWS_REGION`: AWS region for deployment (should match `env.AWS_REGION` in workflow).
-   `DB_PASSWORD`: Database master password.
-   `DB_USERNAME`: Database master username.
-   `DOMAIN_NAME`: Domain name for the application.
-   `CERTIFICATE_ARN`: ARN of the SSL certificate.
-   `ALB_ZONE_ID`: Zone ID of the ALB (can be obtained after initial ALB creation).
-   `CF_ZONE_ID`: Zone ID of the CloudFront distribution (can be obtained after initial CloudFront creation).

**Note on `ALB_ZONE_ID` and `CF_ZONE_ID`:** These values are outputs of the ALB and CloudFront modules respectively. You might need to run `terraform apply` locally once to get these values before adding them as GitHub Secrets for subsequent automated deployments.

## Infrastructure Details

The `infrastructure` directory contains Terraform modules for provisioning the following AWS resources:
-   **VPC**: Network setup with public, private, and database subnets, NAT gateways, and VPC endpoints.
-   **ECS**: Fargate cluster, task definition, service, and auto-scaling.
-   **RDS**: PostgreSQL database instance with multi-AZ and encryption.
-   **ALB**: Application Load Balancer for routing traffic to the ECS service.
-   **CloudFront**: CDN for content delivery and SSL termination.
-   **Route53**: DNS records pointing to ALB and CloudFront.
-   **S3**: Bucket for hosting static frontend assets.
-   **CloudWatch**: Log groups for application logs.
-   **IAM**: Roles and policies (example provided).
-   **Security Groups**: Network access control rules between components.

## DevSecOps Practices

-   **Infrastructure as Code (IaC)**: Using Terraform for reproducible infrastructure.
-   **Automated Testing**: Terraform validate and fmt checks in the pipeline.
-   **Security Analysis**: Integration of `tfsec` for static security analysis of Terraform code.
-   **Secure Authentication**: Using AWS OIDC with GitHub Actions instead of long-lived keys.
-   **Access Control**: Principle of least privilege applied through IAM roles and Security Groups.

## Future Enhancements

-   Implement actual LinkedIn API calls for profile, posts, and articles data fetching.
-   Populate the Analytics page with real data and advanced visualizations.
-   Add more comprehensive unit and integration tests for both backend and frontend.
-   Implement blue/green or canary deployment strategies for ECS.
-   Integrate more DevSecOps tools (e.g., vulnerability scanning for container images).
