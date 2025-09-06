import React from 'react';

const SellerNotificationPopup = ({ isOpen, onClose, notification }) => {
  if (!isOpen || !notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-green-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎉</span>
              <h3 className="text-xl font-bold text-green-800">Product Sold!</h3>
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">Your Product Was Purchased!</h4>
              <p className="text-green-700">
                <strong>{notification.productTitle}</strong> has been sold to <strong>{notification.buyerName}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Buyer:</span>
                <span className="font-semibold">{notification.buyerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-sm">{notification.buyerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{notification.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per item:</span>
                <span className="font-semibold">₹{notification.price}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-lg font-semibold text-gray-800">Total Sale:</span>
                <span className="text-lg font-bold text-green-600">₹{(notification.price * notification.quantity).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sold on:</span>
                <span className="text-sm">{new Date(notification.purchaseDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Awesome! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerNotificationPopup;
