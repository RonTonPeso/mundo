import React from 'react';
import Navigation from './Navigation';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b-2 border-gray-100 py-2">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
};

export default Header; 