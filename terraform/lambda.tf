# Lambda execution role
resource "aws_iam_role" "lambda_execution" {
  name = "mundo-lambda-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# CloudWatch Logs policy
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# DynamoDB policy with specific table access
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "mundo-lambda-dynamodb-policy"
  role = aws_iam_role.lambda_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.sightings.arn,
          "${aws_dynamodb_table.sightings.arn}/index/*"
        ]
      }
    ]
  })
}

# S3 policy with specific bucket access
resource "aws_iam_role_policy" "lambda_s3" {
  name = "mundo-lambda-s3-policy"
  role = aws_iam_role.lambda_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = [
          "${aws_s3_bucket.uploads.arn}/*"
        ]
      }
    ]
  })
}

# Submit sighting Lambda function
resource "aws_lambda_function" "submit_sighting" {
  filename         = "../src/lambda/submit-sighting/dist/function.zip"
  function_name    = "mundo-submit-sighting"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256
  tags            = local.common_tags

  environment {
    variables = {
      SIGHTINGS_TABLE = aws_dynamodb_table.sightings.name
    }
  }
}

# Get sightings Lambda function
resource "aws_lambda_function" "get_sightings" {
  filename         = "../src/lambda/get-sightings/dist/function.zip"
  function_name    = "mundo-get-sightings"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256
  tags            = local.common_tags

  environment {
    variables = {
      SIGHTINGS_TABLE = aws_dynamodb_table.sightings.name
    }
  }
}

# Get upload URL Lambda function
resource "aws_lambda_function" "get_upload_url" {
  filename         = "../src/lambda/get-upload-url/dist/function.zip"
  function_name    = "mundo-get-upload-url"
  role            = aws_iam_role.lambda_execution.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 256
  tags            = local.common_tags

  environment {
    variables = {
      UPLOAD_BUCKET = aws_s3_bucket.uploads.id
    }
  }
}

# API Gateway
resource "aws_apigatewayv2_api" "api" {
  name          = "mundo-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["https://mundo.app"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

# API Gateway throttling
resource "aws_apigatewayv2_stage" "api" {
  api_id = aws_apigatewayv2_api.api.id
  name   = "prod"
  auto_deploy = true

  default_route_settings {
    throttling_rate_limit  = 1000
    throttling_burst_limit = 500
  }

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_logs.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip            = "$context.identity.sourceIp"
      requestTime   = "$context.requestTime"
      httpMethod    = "$context.httpMethod"
      routeKey      = "$context.routeKey"
      status        = "$context.status"
      protocol      = "$context.protocol"
      responseLength = "$context.responseLength"
      integrationError = "$context.integrationErrorMessage"
    })
  }
}

# API Gateway request validation
resource "aws_apigatewayv2_model" "submit_sighting" {
  api_id       = aws_apigatewayv2_api.api.id
  content_type = "application/json"
  name         = "SubmitSightingModel"
  schema       = jsonencode({
    $schema = "http://json-schema.org/draft-07/schema#"
    type = "object"
    required = ["userId", "speciesName", "location"]
    properties = {
      userId = {
        type = "string",
        minLength = 1
      }
      speciesName = {
        type = "string",
        minLength = 1,
        maxLength = 100
      }
      location = {
        type = "object"
        required = ["latitude", "longitude"]
        properties = {
          latitude = {
            type = "number",
            minimum = -90,
            maximum = 90
          }
          longitude = {
            type = "number",
            minimum = -180,
            maximum = 180
          }
        }
      }
      description = {
        type = "string",
        maxLength = 1000
      }
      imageUrl = {
        type = "string",
        format = "uri"
      }
      weather = {
        type = "object"
        properties = {
          temperature = {
            type = "number",
            minimum = -50,
            maximum = 50
          }
          conditions = {
            type = "string",
            maxLength = 50
          }
        }
      }
    }
  })
}

resource "aws_apigatewayv2_model" "get_sightings" {
  api_id       = aws_apigatewayv2_api.api.id
  content_type = "application/json"
  name         = "GetSightingsModel"
  schema       = jsonencode({
    $schema = "http://json-schema.org/draft-07/schema#"
    type = "object"
    properties = {
      userId = {
        type = "string",
        minLength = 1
      }
      speciesName = {
        type = "string",
        minLength = 1,
        maxLength = 100
      }
      lastEvaluatedKey = {
        type = "string"
      }
      limit = {
        type = "integer",
        minimum = 1,
        maximum = 100,
        default = 10
      }
    }
  })
}

resource "aws_apigatewayv2_model" "get_upload_url" {
  api_id       = aws_apigatewayv2_api.api.id
  content_type = "application/json"
  name         = "GetUploadUrlModel"
  schema       = jsonencode({
    $schema = "http://json-schema.org/draft-07/schema#"
    type = "object"
    required = ["userId", "filename"]
    properties = {
      userId = {
        type = "string",
        minLength = 1
      }
      filename = {
        type = "string",
        pattern = "^[a-zA-Z0-9-_]+\\.(jpg|jpeg|png|gif)$"
      }
    }
  })
}

# API Gateway request validator
resource "aws_apigatewayv2_route" "submit_sighting" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /submit-sighting"
  target    = "integrations/${aws_apigatewayv2_integration.submit_sighting.id}"
  
  request_parameter_key = "request.body"
  request_parameter_value = "true"
  
  model_selection_expression = "request.body"
  operation_name = "SubmitSighting"
}

resource "aws_apigatewayv2_route" "get_sightings" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /sightings"
  target    = "integrations/${aws_apigatewayv2_integration.get_sightings.id}"
  
  request_parameter_key = "request.querystring"
  request_parameter_value = "true"
  
  model_selection_expression = "request.querystring"
  operation_name = "GetSightings"
}

resource "aws_apigatewayv2_route" "get_upload_url" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /get-upload-url"
  target    = "integrations/${aws_apigatewayv2_integration.get_upload_url.id}"
  
  request_parameter_key = "request.querystring"
  request_parameter_value = "true"
  
  model_selection_expression = "request.querystring"
  operation_name = "GetUploadUrl"
}

# Lambda integrations
resource "aws_apigatewayv2_integration" "submit_sighting" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "Submit sighting integration"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.submit_sighting.invoke_arn
  
  request_parameters = {
    "integration.request.header.Content-Type" = "'application/json'"
  }
}

resource "aws_apigatewayv2_integration" "get_sightings" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "Get sightings integration"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.get_sightings.invoke_arn
  
  request_parameters = {
    "integration.request.header.Content-Type" = "'application/json'"
  }
}

resource "aws_apigatewayv2_integration" "get_upload_url" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "Get upload URL integration"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.get_upload_url.invoke_arn
  
  request_parameters = {
    "integration.request.header.Content-Type" = "'application/json'"
  }
}

# Lambda permissions
resource "aws_lambda_permission" "submit_sighting" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.submit_sighting.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_sightings" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_sightings.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "get_upload_url" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_upload_url.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/aws/apigateway/mundo-api"
  retention_in_days = 7
}

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = "api.mundo.app"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.api.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_route53_record" "api" {
  name    = aws_apigatewayv2_domain_name.api.domain_name
  type    = "A"
  zone_id = aws_route53_zone.main.zone_id

  alias {
    name                   = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  api_id      = aws_apigatewayv2_api.api.id
  domain_name = aws_apigatewayv2_domain_name.api.domain_name
  stage       = aws_apigatewayv2_stage.api.id
} 