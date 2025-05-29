import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

interface SightingSubmission {
  userId?: string;
  isGuestSubmission?: boolean;
  guestName?: string;
  guestEmail?: string;
  name: string;
  scientificName: string;
  location: string;
  description: string;
  category: string;
  imageUrl: string;
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
    if (!submission.name?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'name is required' }),
      };
    }

    if (!submission.scientificName?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'scientificName is required' }),
      };
    }

    if (!submission.location?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'location is required' }),
      };
    }

    if (!submission.description?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'description is required' }),
      };
    }

    if (!submission.category?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'category is required' }),
      };
    }

    if (!submission.imageUrl?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'imageUrl is required' }),
      };
    }

    // Validate field constraints
    if (submission.description.length > 1000) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'description must be 1000 characters or less' }),
      };
    }

    // Validate guest information if provided
    if (submission.isGuestSubmission) {
      if (submission.guestEmail && !isValidEmail(submission.guestEmail)) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'invalid guest email format' }),
        };
      }

      if (submission.guestName && submission.guestName.length > 100) {
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ error: 'guest name must be 100 characters or less' }),
        };
      }
    }

    const timestamp = new Date().toISOString();
    const item = {
      id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      userId: submission.userId?.trim(),
      isGuestSubmission: submission.isGuestSubmission || false,
      guestName: submission.guestName?.trim(),
      guestEmail: submission.guestEmail?.trim(),
      name: submission.name.trim(),
      scientificName: submission.scientificName.trim(),
      location: submission.location.trim(),
      description: submission.description.trim(),
      category: submission.category.trim(),
      imageUrl: submission.imageUrl.trim(),
      timestamp,
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

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
} 