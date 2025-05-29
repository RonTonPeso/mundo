import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const s3Client = new S3Client({});

interface UploadUrlParams {
  userId: string;
  filename: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const params: UploadUrlParams = {
      userId: event.queryStringParameters?.userId || '',
      filename: event.queryStringParameters?.filename || '',
    };

    // Validate required parameters
    if (!params.userId.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'userId is required' }),
      };
    }

    if (!params.filename.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'filename is required' }),
      };
    }

    // Validate filename format
    const filenameRegex = /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png|gif)$/;
    if (!filenameRegex.test(params.filename)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: 'Invalid filename format. Must be alphanumeric with hyphens/underscores and end with .jpg, .jpeg, .png, or .gif' 
        }),
      };
    }

    // Generate a unique key for the S3 object
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const key = `uploads/${params.userId.trim()}/${timestamp}-${params.filename.trim()}`;

    // Create the S3 command
    const command = new PutObjectCommand({
      Bucket: process.env.UPLOAD_BUCKET,
      Key: key,
      ContentType: `image/${params.filename.split('.').pop()?.toLowerCase()}`,
    });

    // Generate presigned URL (valid for 15 minutes)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        uploadUrl: signedUrl,
        key,
        expiresIn: 900,
      }),
    };
  } catch (error) {
    console.error('Error generating upload URL:', error);
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