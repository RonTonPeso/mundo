import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full h-48 bg-gradient-to-r from-green-800 to-green-600 flex items-center justify-center relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)'
        }}
      />
      <div className="relative z-10 text-center">
        <h2 className="text-xl font-medium text-white">
          Explore the Fascinating World of Fungi
        </h2>
      </div>
    </section>
  );
};

export default Hero; 