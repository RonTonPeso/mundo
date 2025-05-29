import React from 'react';

interface FactItem {
  icon: string;
  text: string;
}

const DidYouKnowCard: React.FC = () => {
  const facts: FactItem[] = [
    {
      icon: '🧬',
      text: 'Fungi are more closely related to animals than to plants.'
    },
    {
      icon: '🌍',
      text: 'There are an estimated 2.2 to 3.8 million species of fungi on Earth.'
    }
  ];

  return (
    <article className="bg-white border-2 border-gray-100 p-4 rounded-lg">
      <header>
        <h3 className="text-sm font-normal text-gray-600 mb-4">Did You Know?</h3>
      </header>
      <div className="space-y-4">
        {facts.map((fact, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{fact.icon}</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed pt-2">
              {fact.text}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default DidYouKnowCard; 