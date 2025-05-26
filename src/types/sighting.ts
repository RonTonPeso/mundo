export interface Sighting {
  id: string;
  userId: string;
  speciesName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  imageUrl?: string;
  timestamp: string;
  weather?: {
    temperature: number;
    conditions: string;
  };
} 