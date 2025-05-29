import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';

interface Sighting {
  id: string;
  name: string;
  scientificName: string;
  location: string;
  description: string;
  category: string;
  imageUrl: string;
  timestamp: string;
}

const DiscoverPage: React.FC = () => {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSightings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/sightings');
        setSightings(response.data);
      } catch (err) {
        setError('Failed to load sightings. Please try again later.');
        console.error('Error fetching sightings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSightings();
  }, []);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://cdn.naturettl.com/wp-content/uploads/2016/09/22014332/how-to-photograph-fungi-7.jpg)'
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/90" />
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-white mb-4">Discover Fungi</h1>
              <p className="text-lg text-green-100 max-w-2xl">
                Explore the fascinating world of fungi through the eyes of our community.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sightings.map((sighting) => (
                <div key={sighting.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={sighting.imageUrl}
                    alt={sighting.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {sighting.name}
                    </h3>
                    <p className="text-sm text-gray-600 italic mb-2">
                      {sighting.scientificName}
                    </p>
                    <p className="text-gray-700 mb-4">{sighting.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {new Date(sighting.timestamp).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {sighting.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DiscoverPage; 