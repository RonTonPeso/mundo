import React from 'react';
import SubmissionItem from './SubmissionItem';

interface Submission {
  id: number;
  image: string;
  title: string;
  location: string;
  date: string;
}

const RecentSubmissions: React.FC = () => {
  const submissions: Submission[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      title: 'Amanita muscaria',
      location: 'Pacific Northwest',
      date: '2 days ago'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      title: 'Oyster Mushroom',
      location: 'Central Park',
      date: '3 days ago'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      title: 'Chanterelle',
      location: 'Oregon Forest',
      date: '1 week ago'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      title: 'Porcini',
      location: 'Rocky Mountains',
      date: '1 week ago'
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-6">
      <header className="mb-4">
        <h3 className="text-sm font-normal text-gray-600">Recent Community Submissions</h3>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {submissions.map((submission) => (
          <SubmissionItem key={submission.id} submission={submission} />
        ))}
      </div>
    </section>
  );
};

export default RecentSubmissions; 