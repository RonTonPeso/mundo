import React from 'react';

const MySubmissions: React.FC = () => {
  // TODO: Fetch user's submissions from API
  const submissions = [
    {
      id: '1',
      species: 'Amanita muscaria',
      location: 'Forest Park',
      date: '2024-03-15',
      imageUrl: 'placeholder.jpg'
    }
  ];

  return (
    <div className="my-submissions">
      <h1>My Submissions</h1>
      <div className="submissions-list">
        {submissions.map(submission => (
          <div key={submission.id} className="submission-card">
            <img src={submission.imageUrl} alt={submission.species} />
            <div className="submission-details">
              <h3>{submission.species}</h3>
              <p>Location: {submission.location}</p>
              <p>Date: {submission.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubmissions; 