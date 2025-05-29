import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">🍄</span>
      </div>
      <h1 className="text-lg font-light text-gray-600">Mundo</h1>
    </div>
  );
};

export default Logo; 