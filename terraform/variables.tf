variable "domain_name" {
  description = "The domain name for the application"
  type        = string
  default     = "mundo.app"
}

variable "environment" {
  description = "The environment (e.g., dev, prod)"
  type        = string
  default     = "prod"
}

variable "region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "dynamodb_read_capacity" {
  description = "DynamoDB read capacity units"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "DynamoDB write capacity units"
  type        = number
  default     = 5
} 