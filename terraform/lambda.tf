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

# API Gateway routes
resource "aws_apigatewayv2_route" "get_sightings" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /sightings"
  target    = "integrations/${aws_apigatewayv2_integration.get_sightings.id}"
}

resource "aws_apigatewayv2_route" "submit_sighting" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /submit-sighting"
  target    = "integrations/${aws_apigatewayv2_integration.submit_sighting.id}"
}

resource "aws_apigatewayv2_route" "get_upload_url" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /get-upload-url"
  target    = "integrations/${aws_apigatewayv2_integration.get_upload_url.id}"
}

# API Gateway integrations
resource "aws_apigatewayv2_integration" "get_sightings" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "Lambda integration"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.get_sightings.invoke_arn
}

resource "aws_apigatewayv2_integration" "submit_sighting" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "Lambda integration"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.submit_sighting.invoke_arn
}

resource "aws_apigatewayv2_integration" "get_upload_url" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "Lambda integration"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.get_upload_url.invoke_arn
}

# Lambda permissions
resource "aws_lambda_permission" "get_sightings" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_sightings.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "submit_sighting" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.submit_sighting.function_name
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