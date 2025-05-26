import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface QueryParams {
  userId?: string;
  speciesName?: string;
  lastEvaluatedKey?: string;
  limit?: number;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params: QueryParams = {
      userId: event.queryStringParameters?.userId,
      speciesName: event.queryStringParameters?.speciesName,
      lastEvaluatedKey: event.queryStringParameters?.lastEvaluatedKey,
      limit: event.queryStringParameters?.limit ? parseInt(event.queryStringParameters.limit, 10) : 10,
    };

    // Validate limit
    if (params.limit && (params.limit < 1 || params.limit > 100)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'limit must be between 1 and 100' }),
      };
    }

    // Validate userId if provided
    if (params.userId && !params.userId.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'userId must not be empty' }),
      };
    }

    // Validate speciesName if provided
    if (params.speciesName && !params.speciesName.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'speciesName must not be empty' }),
      };
    }

    // Parse lastEvaluatedKey if provided
    let exclusiveStartKey;
    if (params.lastEvaluatedKey) {
      try {
        exclusiveStartKey = JSON.parse(Buffer.from(params.lastEvaluatedKey, 'base64').toString());
      } catch (error) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'Invalid lastEvaluatedKey format' }),
        };
      }
    }

    let queryParams: any = {
      TableName: process.env.TABLE_NAME,
      Limit: params.limit,
      ScanIndexForward: false, // Sort in descending order (newest first)
    };

    if (params.userId) {
      // Query by userId
      queryParams.KeyConditionExpression = 'userId = :userId';
      queryParams.ExpressionAttributeValues = {
        ':userId': params.userId.trim(),
      };
    } else if (params.speciesName) {
      // Query by speciesName using GSI
      queryParams.IndexName = 'SpeciesNameIndex';
      queryParams.KeyConditionExpression = 'speciesName = :speciesName';
      queryParams.ExpressionAttributeValues = {
        ':speciesName': params.speciesName.trim(),
      };
    } else {
      // Scan the table if no filters provided
      queryParams = {
        TableName: process.env.TABLE_NAME,
        Limit: params.limit,
      };
    }

    if (exclusiveStartKey) {
      queryParams.ExclusiveStartKey = exclusiveStartKey;
    }

    const result = await docClient.send(new QueryCommand(queryParams));

    // Encode the LastEvaluatedKey for pagination
    const lastEvaluatedKey = result.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
      : undefined;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        items: result.Items,
        lastEvaluatedKey,
        count: result.Count,
        scannedCount: result.ScannedCount,
      }),
    };
  } catch (error) {
    console.error('Error getting sightings:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}; 