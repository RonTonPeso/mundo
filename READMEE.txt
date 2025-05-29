You are building a full cloud-native web app using AWS services.

**App Summary**:
A fungi observation app called “Mundo” where users can submit and browse fungi sightings. It must be scalable, fault-tolerant, and low-maintenance.

**Architecture Requirements**:
- Static frontend hosted in an S3 bucket
- Route 53 for DNS + custom domain (e.g., mundo.app)
- API Gateway + AWS Lambda for backend REST API
- DynamoDB as NoSQL database
- Optional S3 uploads (presigned URLs)
- Written in Node.js (backend) and React (frontend)
- Infrastructure defined in Terraform or AWS CDK (your choice)

Use best practices for security, scalability, and observability (e.g., IAM roles, API throttling, logging).
