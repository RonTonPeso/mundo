import React from 'react';
import DidYouKnowCard from './DidYouKnowCard';
import CommunityCard from './CommunityCard';

const InfoCards: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DidYouKnowCard />
        <CommunityCard />
      </div>
    </section>
  );
};

export default InfoCards; 