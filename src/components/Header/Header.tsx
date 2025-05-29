import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-800">
            Mundo
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-800 transition-colors">
              Home
            </Link>
            <Link to="/discover" className="text-gray-600 hover:text-green-800 transition-colors">
              Discover
            </Link>
            <Link to="/submit" className="text-gray-600 hover:text-green-800 transition-colors">
              Submit
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-green-800 transition-colors">
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 hover:text-green-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header; 