import React, { useState } from 'react';
import { submitSighting } from '../services/sightings';
import type { Sighting } from '../types/sighting';

interface SightingFormProps {
  userId: string;
  onSuccess?: (sighting: Sighting) => void;
  onError?: (error: Error) => void;
}

export const SightingForm: React.FC<SightingFormProps> = ({ userId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const sighting = {
        userId,
        speciesName: formData.get('speciesName') as string,
        location: {
          latitude: parseFloat(formData.get('latitude') as string),
          longitude: parseFloat(formData.get('longitude') as string),
        },
        description: formData.get('description') as string || undefined,
        weather: formData.get('temperature') ? {
          temperature: parseFloat(formData.get('temperature') as string),
          conditions: formData.get('conditions') as string,
        } : undefined,
      };

      const result = await submitSighting(sighting, photo || undefined);
      onSuccess?.(result);
      e.currentTarget.reset();
      setPhoto(null);
      setPreviewUrl(null);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        onError?.(new Error('File size must be less than 5MB'));
        return;
      }
      setPhoto(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
      <div>
        <label htmlFor="speciesName" className="block text-sm font-medium text-gray-700">
          Species Name
        </label>
        <input
          type="text"
          id="speciesName"
          name="speciesName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            step="any"
            min="-90"
            max="90"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            step="any"
            min="-180"
            max="180"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={1000}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
            Temperature (°C)
          </label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            step="0.1"
            min="-50"
            max="50"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="conditions" className="block text-sm font-medium text-gray-700">
            Weather Conditions
          </label>
          <input
            type="text"
            id="conditions"
            name="conditions"
            maxLength={50}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
          Photo (max 5MB)
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/jpeg,image/png,image/gif"
          onChange={handlePhotoChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Sighting'}
      </button>
    </form>
  );
}; 