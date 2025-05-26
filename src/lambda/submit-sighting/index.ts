import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface SightingSubmission {
  userId: string;
  speciesName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  imageUrl?: string;
  weather?: {
    temperature?: number;
    conditions?: string;
  };
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    const submission: SightingSubmission = JSON.parse(event.body);

    // Validate required fields
    if (!submission.userId?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'userId is required' }),
      };
    }

    if (!submission.speciesName?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'speciesName is required' }),
      };
    }

    if (!submission.location?.latitude || !submission.location?.longitude) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'location with latitude and longitude is required' }),
      };
    }

    // Validate field constraints
    if (submission.description && submission.description.length > 1000) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'description must be 1000 characters or less' }),
      };
    }

    if (submission.weather?.conditions && submission.weather.conditions.length > 50) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'weather conditions must be 50 characters or less' }),
      };
    }

    if (submission.weather?.temperature !== undefined) {
      if (submission.weather.temperature < -50 || submission.weather.temperature > 50) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'temperature must be between -50 and 50 degrees' }),
        };
      }
    }

    if (submission.location.latitude < -90 || submission.location.latitude > 90) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'latitude must be between -90 and 90 degrees' }),
      };
    }

    if (submission.location.longitude < -180 || submission.location.longitude > 180) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'longitude must be between -180 and 180 degrees' }),
      };
    }

    const timestamp = new Date().toISOString();
    const item = {
      userId: submission.userId.trim(),
      timestamp,
      speciesName: submission.speciesName.trim(),
      location: submission.location,
      description: submission.description?.trim(),
      imageUrl: submission.imageUrl?.trim(),
      weather: submission.weather,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: item,
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(item),
    };
  } catch (error) {
    console.error('Error submitting sighting:', error);
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