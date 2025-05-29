import React from 'react';

const CommunityCard: React.FC = () => {
  return (
    <article className="bg-white border-2 border-gray-100 p-4 rounded-lg">
      <header>
        <h3 className="text-sm font-normal text-gray-600 mb-4">Join Our Community</h3>
      </header>
      <div className="space-y-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          Share your own fungi discoveries by submitting sightings to our community.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded border border-blue-800 transition-colors">
          SUBMIT A SIGHTING
        </button>
      </div>
    </article>
  );
};

export default CommunityCard; 