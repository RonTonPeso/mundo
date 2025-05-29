import React from 'react';

const InfoCards: React.FC = () => {
  const cards = [
    {
      title: 'Discover Fungi 🍄',
      description: 'Learn about different types of fungi and their characteristics.'
      
    },
    {
      title: 'Submit Findings',
      description: 'Share your fungal discoveries with the community.'
      
    },
    {
      title: 'Join Community',
      description: 'Connect with other fungi enthusiasts and experts.'
    }
  ];

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            
            <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InfoCards; 