import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-2">
          <h2 className="text-sm font-bold text-blue-100">FungiSpotter</h2>
        </div>
        <p className="text-xs text-blue-200">
          Connecting people with the amazing world of fungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 