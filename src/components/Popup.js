import React from 'react';

const Popup = ({ isOpen, onClose, title, message, type = 'info', showGift = false }) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 text-yellow-800';
      case 'thankyou':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'achievement':
        return '🎉';
      case 'thankyou':
        return '🙏';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full border-2 ${getTypeStyles()}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getIcon()}</span>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-lg leading-relaxed">{message}</p>
            
            {showGift && (
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <p className="font-semibold text-yellow-800">Surprise Gift Unlocked!</p>
                    <p className="text-sm text-yellow-700">
                      You'll receive a special eco-friendly gift with your next order!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                type === 'achievement' 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : type === 'thankyou'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              {type === 'achievement' ? 'Claim Gift!' : 'Awesome!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
