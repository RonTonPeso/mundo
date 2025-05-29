import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface QueryParams {
  userId?: string;
  category?: string;
  lastEvaluatedKey?: string;
  limit?: number;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params: QueryParams = {
      userId: event.queryStringParameters?.userId,
      category: event.queryStringParameters?.category,
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

    // Validate category if provided
    if (params.category && !['edible', 'medicinal', 'poisonous', 'rare'].includes(params.category)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'invalid category' }),
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

    let command: QueryCommand | ScanCommand;
    let queryParams: any = {
      TableName: process.env.TABLE_NAME,
      Limit: params.limit,
      ScanIndexForward: false, // Sort in descending order (newest first)
    };

    if (params.userId) {
      // Query by userId using GSI
      queryParams.IndexName = 'UserIdIndex';
      queryParams.KeyConditionExpression = 'userId = :userId';
      queryParams.ExpressionAttributeValues = {
        ':userId': params.userId.trim(),
      };
      command = new QueryCommand(queryParams);
    } else if (params.category) {
      // Query by category using GSI
      queryParams.IndexName = 'CategoryIndex';
      queryParams.KeyConditionExpression = 'category = :category';
      queryParams.ExpressionAttributeValues = {
        ':category': params.category,
      };
      command = new QueryCommand(queryParams);
    } else {
      // Scan the table if no filters provided
      command = new ScanCommand(queryParams);
    }

    if (exclusiveStartKey) {
      queryParams.ExclusiveStartKey = exclusiveStartKey;
    }

    const result = await docClient.send(command);

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