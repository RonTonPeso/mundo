resource "aws_dynamodb_table" "sightings" {
  name           = "mundo-sightings"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "userId"
  range_key      = "timestamp"
  tags           = local.common_tags

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  # Global Secondary Index for querying by species
  global_secondary_index {
    name               = "SpeciesIndex"
    hash_key           = "species"
    range_key          = "timestamp"
    projection_type    = "ALL"
    read_capacity      = 5
    write_capacity     = 5
  }

  # Global Secondary Index for querying by location
  global_secondary_index {
    name               = "LocationIndex"
    hash_key           = "location"
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