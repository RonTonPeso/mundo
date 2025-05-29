import React from 'react';

interface Submission {
  id: number;
  image: string;
  title: string;
  location: string;
  date: string;
}

interface SubmissionItemProps {
  submission: Submission;
}

const SubmissionItem: React.FC<SubmissionItemProps> = ({ submission }) => {
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="aspect-square overflow-hidden">
        <img 
          src={submission.image} 
          alt={submission.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <h4 className="text-xs font-medium text-gray-800 mb-1">{submission.title}</h4>
        <p className="text-xs text-gray-500 mb-1">{submission.location}</p>
        <time className="text-xs text-gray-400">{submission.date}</time>
      </div>
    </article>
  );
};

export default SubmissionItem; 