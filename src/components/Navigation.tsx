import React from 'react';

const Navigation: React.FC = () => {
  const navItems = ['Home', 'Submit Sightings', 'My Submissions'];

  return (
    <nav>
      <ul className="flex space-x-6">
        {navItems.map((item, index) => (
          <li key={index}>
            <a 
              href="#" 
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 