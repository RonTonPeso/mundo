import React from 'react';
import Layout from '../components/Layout/Layout';

const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Dr. Toadstool',
      role: 'Lead Mycologist',
      bio: 'Specializing in fungal taxonomy with over 200 years of field experience.',
      image: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Toad_by_Shigehisa_Nakaue.png/255px-Toad_by_Shigehisa_Nakaue.png'
    },
    {
      name: 'Dr. Goonba',
      role: 'Field Researcher',
      bio: 'Passionate about documenting rare fungal species in weird locations.',
      image: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Goomba_by_Shigehisa_Nakaue.png/250px-Goomba_by_Shigehisa_Nakaue.png'
    },
    {
      name: 'Luigi',
      role: 'Founder',
      bio: 'Dedicated to building and nurturing our global community of fungi enthusiasts.',
      image: 'https://i.pinimg.com/736x/97/58/ce/9758ce0989b5244cc4500d662c0aed24.jpg'
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)'
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/90" />
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-white mb-4">About Mundo</h1>
              <p className="text-lg text-green-100 max-w-2xl">
                Connecting mycologists and enthusiasts worldwide to advance fungal research and discovery.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <div className="prose prose-lg">
              <p className="text-gray-600 mb-6">
                At Mundo, we believe that understanding and preserving fungal biodiversity is crucial for our planet's future. Our platform connects mycologists, researchers, and nature enthusiasts worldwide to document and study the diverse world of fungi.
              </p>
              <p className="text-gray-600 mb-6">
                Through community-driven research and exploration, we aim to create the most comprehensive database of fungal species whilst breaking down the negative stigma of fungi.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                  <div className="h-64 relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-green-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Collaboration</h3>
              <p className="text-gray-600">Connecting researchers and enthusiasts worldwide to advance fungal knowledge.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scientific Integrity</h3>
              <p className="text-gray-600">Maintaining high standards of accuracy and reliability in our research.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Environmental Stewardship</h3>
              <p className="text-gray-600">Promoting conservation and sustainable practices in fungal research.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Be part of our mission to document and preserve the fascinating world of fungi.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/discover"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 transition-colors duration-200"
              >
                Start Exploring
              </a>
              <a
                href="/submit"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700 transition-colors duration-200"
              >
                Submit a Discovery
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage; 