import React, { useEffect, useState } from 'react';
import { getSightings } from '../services/sightings';
import type { Sighting } from '../types/sighting';

interface SightingsListProps {
  userId?: string;
  speciesName?: string;
}

export const SightingsList: React.FC<SightingsListProps> = ({ userId, speciesName }) => {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);

  const loadSightings = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getSightings({
        userId,
        speciesName,
        lastEvaluatedKey: reset ? undefined : lastEvaluatedKey,
        limit: 10,
      });

      setSightings(prev => reset ? result.items : [...prev, ...result.items]);
      setLastEvaluatedKey(result.lastEvaluatedKey);
      setHasMore(!!result.lastEvaluatedKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sightings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSightings(true);
  }, [userId, speciesName]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (error) {
    return (
      <div className="text-red-600 p-4 text-center">
        {error}
      </div>
    );
  }

  if (loading && sightings.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sightings.map((sighting) => (
        <div
          key={sighting.id}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {sighting.speciesName}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(sighting.timestamp)}
                </p>
              </div>
              {sighting.weather && (
                <div className="text-sm text-gray-500">
                  {sighting.weather.temperature}°C, {sighting.weather.conditions}
                </div>
              )}
            </div>

            {sighting.description && (
              <p className="mt-2 text-gray-600">{sighting.description}</p>
            )}

            <div className="mt-2 text-sm text-gray-500">
              Location: {sighting.location.latitude.toFixed(4)}, {sighting.location.longitude.toFixed(4)}
            </div>

            {sighting.imageUrl && (
              <div className="mt-4">
                <img
                  src={sighting.imageUrl}
                  alt={`${sighting.speciesName} sighting`}
                  className="h-48 w-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={() => loadSightings()}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {!hasMore && sightings.length > 0 && (
        <div className="text-center text-gray-500 py-4">
          No more sightings to load
        </div>
      )}

      {!loading && sightings.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          No sightings found
        </div>
      )}
    </div>
  );
}; 