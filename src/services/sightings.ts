import { Sighting } from '../types/sighting';

const API_BASE_URL = 'https://api.mundo.app';

export const submitSighting = async (sighting: Omit<Sighting, 'id' | 'timestamp'>, photo?: File): Promise<Sighting> => {
  let imageUrl: string | undefined;

  if (photo) {
    // Get presigned URL for upload
    const uploadUrlResponse = await fetch(
      `${API_BASE_URL}/get-upload-url?userId=${sighting.userId}&filename=${photo.name}`
    );
    const { uploadUrl, key } = await uploadUrlResponse.json();

    // Upload image to S3
    await fetch(uploadUrl, {
      method: 'PUT',
      body: photo,
      headers: {
        'Content-Type': photo.type,
      },
    });

    // Construct the public URL for the image
    imageUrl = `https://mundo-uploads.s3.amazonaws.com/${key}`;
  }

  // Submit the sighting with the image URL
  const response = await fetch(`${API_BASE_URL}/submit-sighting`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...sighting,
      imageUrl,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit sighting');
  }

  return response.json();
};

export const getSightings = async (params?: {
  userId?: string;
  speciesName?: string;
  lastEvaluatedKey?: string;
  limit?: number;
}): Promise<{
  items: Sighting[];
  lastEvaluatedKey?: string;
}> => {
  const queryParams = new URLSearchParams();
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.speciesName) queryParams.append('speciesName', params.speciesName);
  if (params?.lastEvaluatedKey) queryParams.append('lastEvaluatedKey', params.lastEvaluatedKey);
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/sightings?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch sightings');
  }

  return response.json();
}; 