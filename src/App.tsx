import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import SubmitPage from './pages/SubmitPage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;