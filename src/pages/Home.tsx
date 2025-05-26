import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Fungi Sightings</h1>
      <div className="view-toggle">
        <button>Map View</button>
        <button>List View</button>
      </div>
      <div className="sightings-container">
        {/* Map or list will be implemented here */}
        <p>Map or list of fungi sightings will be displayed here</p>
      </div>
    </div>
  );
};

export default Home; 