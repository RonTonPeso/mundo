import React from 'react';
import Layout from '../components/Layout/Layout';
import Hero from '../components/Hero/Hero';
import InfoCards from '../components/InfoCards/InfoCards';
import RecentSubmissions from '../components/RecentSubmissions/RecentSubmissions';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50">
        <Hero />
        <div className="container mx-auto px-4 py-8">
          <InfoCards />
          <RecentSubmissions />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage; 