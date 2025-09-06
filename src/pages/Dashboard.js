import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setMessage('Username is required');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      await updateProfile({
        username: formData.username.trim(),
        updatedAt: new Date().toISOString()
      });
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: currentUser?.username || '',
      email: currentUser?.email || '',
      location: currentUser?.location || '',
      bio: currentUser?.bio || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Enhanced Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4 animate-fade-in">
          Welcome Back! 👋
        </h1>
        <p className="text-xl text-gray-600 animate-slide-up">
          Manage your account and explore your activity
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-eco-500 mx-auto rounded-full mt-4 animate-scale-in"></div>
      </div>

      <div className="card p-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-eco-500 rounded-full flex items-center justify-center shadow-lg glow">
              <span className="text-white font-bold text-2xl">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
              <p className="text-gray-600">Manage your personal details and preferences</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary shimmer group"
            >
              <span className="group-hover:animate-wiggle inline-block">✏️</span> Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border-l-4 animate-slide-up ${
            message.includes('successfully') 
              ? 'bg-green-50 border-green-400 text-green-700'
              : 'bg-red-50 border-red-400 text-red-700'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {message.includes('successfully') ? (
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-primary-500">👤</span> Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                  isEditing 
                    ? 'border-gray-300 hover:border-primary-300 focus:shadow-lg' 
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-primary-500">📧</span> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl"
              />
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span> Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-primary-500">🆔</span> User ID
              </label>
              <input
                type="text"
                value={currentUser?.uid || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-primary-500">📅</span> Member Since
              </label>
              <input
                type="text"
                value={currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}
                disabled
                className="w-full px-4 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-primary-500">📍</span> Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                isEditing 
                  ? 'border-gray-300 hover:border-primary-300 focus:shadow-lg' 
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
              placeholder="Enter your location"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-primary-500">📝</span> Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none ${
                isEditing 
                  ? 'border-gray-300 hover:border-primary-300 focus:shadow-lg' 
                  : 'border-gray-200 bg-gray-50 text-gray-500'
              }`}
              placeholder="Tell us about yourself..."
            />
          </div>

          {isEditing && (
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary shimmer group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="group-hover:animate-bounce-gentle inline-block">💾</span>
                )}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-200 transform hover:scale-105 group"
              >
                <span className="group-hover:animate-wiggle inline-block">❌</span> Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:animate-bounce-gentle">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gradient">📋</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Listings</h3>
            <p className="text-gray-600 mb-4">Manage your product listings and track their performance</p>
            <a href="/my-listings" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group-hover:animate-wiggle">
              View Listings
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:animate-bounce-gentle">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gradient">🛒</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Shopping Cart</h3>
            <p className="text-gray-600 mb-4">Review items in your cart and proceed to checkout</p>
            <a href="/cart" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group-hover:animate-wiggle">
              View Cart
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:animate-bounce-gentle">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gradient">📦</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase History</h3>
            <p className="text-gray-600 mb-4">View your past purchases and order details</p>
            <a href="/purchases" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group-hover:animate-wiggle">
              View History
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
