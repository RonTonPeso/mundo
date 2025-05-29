import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  name: string;
  scientificName: string;
  location: string;
  description: string;
  category: string;
  image: File | null;
  guestEmail?: string;
  guestName?: string;
}

const SubmitPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    scientificName: '',
    location: '',
    description: '',
    category: 'edible',
    image: null,
    guestEmail: '',
    guestName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // First, get the upload URL for the image
      const uploadUrlResponse = await api.get<{ uploadUrl: string; key: string }>('/get-upload-url', {
        params: {
          filename: formData.image?.name,
          contentType: formData.image?.type,
        },
      });

      const { uploadUrl, key } = uploadUrlResponse.data;

      // Upload the image to S3
      if (formData.image) {
        await fetch(uploadUrl, {
          method: 'PUT',
          body: formData.image,
          headers: {
            'Content-Type': formData.image.type,
          },
        });
      }

      // Submit the discovery data
      await api.post('/submit-sighting', {
        ...formData,
        imageUrl: key,
        userId: user?.id,
        isGuestSubmission: !user,
      });

      setSuccess(true);
      setFormData({
        name: '',
        scientificName: '',
        location: '',
        description: '',
        category: 'edible',
        image: null,
        guestEmail: '',
        guestName: '',
      });
    } catch (err) {
      setError('Failed to submit discovery. Please try again later.');
      console.error('Error submitting discovery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://cdn.naturettl.com/wp-content/uploads/2016/09/22014332/how-to-photograph-fungi-7.jpg)'
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/90" />
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold text-white mb-4">Submit Your Discovery</h1>
              <p className="text-lg text-green-100 max-w-2xl">
                Share your fungal findings with our global community of mycologists and enthusiasts.
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                Your discovery has been submitted successfully!
                {!user && (
                  <p className="mt-2">
                    Would you like to create an account to track your submissions? 
                    <a href="/signup" className="text-green-700 underline ml-1">Sign up now</a>
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Common Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Scientific Name */}
              <div>
                <label htmlFor="scientificName" className="block text-sm font-medium text-gray-700 mb-1">
                  Scientific Name
                </label>
                <input
                  type="text"
                  id="scientificName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="edible">Edible</option>
                  <option value="medicinal">Medicinal</option>
                  <option value="poisonous">Poisonous</option>
                  <option value="rare">Rare</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onChange={handleImageChange}
                  required
                />
              </div>

              {/* Guest Information (only show if not logged in) */}
              {!user && (
                <>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your Information (Optional)</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Providing your information helps us credit your discovery and contact you if needed.
                    </p>
                    
                    {/* Guest Name */}
                    <div className="mb-4">
                      <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="guestName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.guestName}
                        onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      />
                    </div>

                    {/* Guest Email */}
                    <div>
                      <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="guestEmail"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={formData.guestEmail}
                        onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="small" color="white" />
                    <span className="ml-2">Submitting...</span>
                  </div>
                ) : (
                  'Submit Discovery'
                )}
              </button>

              {!user && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account?{' '}
                  <a href="/login" className="text-green-600 hover:text-green-700">
                    Log in
                  </a>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitPage; 