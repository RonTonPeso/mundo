resource "aws_dynamodb_table" "sightings" {
  name           = "mundo-sightings"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  range_key      = "timestamp"
  tags           = local.common_tags

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "category"
    type = "S"
  }

  # Global Secondary Index for querying by userId
  global_secondary_index {
    name               = "UserIdIndex"
    hash_key           = "userId"
    range_key          = "timestamp"
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }

  # Global Secondary Index for querying by category
  global_secondary_index {
    name               = "CategoryIndex"
    hash_key           = "category"
    range_key          = "timestamp"
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled = true
  }
} 