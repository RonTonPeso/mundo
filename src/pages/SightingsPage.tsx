import React, { useState } from 'react';
import { SightingForm } from '../components/SightingForm';
import { SightingsList } from '../components/SightingsList';
import type { Sighting } from '../types/sighting';

export const SightingsPage: React.FC = () => {
  const [userId] = useState('user123'); // TODO: Replace with actual user authentication
  const [showForm, setShowForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>();

  const handleSightingSuccess = (_sighting: Sighting) => {
    setShowForm(false);
    // Optionally refresh the list or add the new sighting to the list
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Fungi Sightings</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showForm ? 'Cancel' : 'Add New Sighting'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <SightingForm
            userId={userId}
            onSuccess={handleSightingSuccess}
            onError={(error) => console.error('Error submitting sighting:', error)}
          />
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by species name..."
          value={selectedSpecies || ''}
          onChange={(e) => setSelectedSpecies(e.target.value || undefined)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <SightingsList
        userId={userId}
        speciesName={selectedSpecies}
      />
    </div>
  );
}; 