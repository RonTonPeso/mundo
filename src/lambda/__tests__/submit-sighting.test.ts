import { handler } from '../submit-sighting';
import '@jest/globals';

describe('submit-sighting Lambda', () => {
  it('should return 400 when body is missing', async () => {
    const event = {
      body: null
    };

    const response = await handler(event as any);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('error', 'Request body is required');
  });

  it('should return 400 when required fields are missing', async () => {
    const event = {
      body: JSON.stringify({
        name: '',
        scientificName: '',
        location: '',
        description: '',
        category: '',
        imageUrl: ''
      })
    };

    const response = await handler(event as any);
    expect(response.statusCode).toBe(400);
  });

  it('should return 400 when description is too long', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Test Fungus',
        scientificName: 'Testus Fungus',
        location: 'Test Location',
        description: 'a'.repeat(1001),
        category: 'edible',
        imageUrl: 'https://example.com/image.jpg'
      })
    };

    const response = await handler(event as any);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toHaveProperty('error', 'description must be 1000 characters or less');
  });
}); 