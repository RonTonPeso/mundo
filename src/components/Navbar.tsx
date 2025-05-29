import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Mundo</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/sightings" className="nav-link">Sightings</Link>
        </li>
        <li className="nav-item">
          <Link to="/my-submissions" className="nav-link">My Submissions</Link>
        </li>
        <li className="nav-item">
          <Link to="/submit-sighting" className="nav-link">Submit Sighting</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 