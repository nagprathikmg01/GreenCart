import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';

export default function SellerNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const sellerNotifications = storage.getSellerNotifications(currentUser.uid);
      setNotifications(sellerNotifications);
    }
    setLoading(false);
  }, [currentUser]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Notifications</h1>
        <p className="text-gray-600">See who bought your products and their details</p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No sales yet</h3>
          <p className="text-gray-500 mb-6">When someone buys your products, you'll see the details here</p>
          <a
            href="/add-product"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Your First Product
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-lg">💰</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Product Sold: {notification.productTitle}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Sold on {new Date(notification.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Buyer Information</h4>
                      <p className="text-sm text-gray-900">{notification.buyerName}</p>
                      <p className="text-sm text-gray-600">{notification.buyerEmail}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Purchase Details</h4>
                      <p className="text-sm text-gray-900">Quantity: {notification.quantity}</p>
                      <p className="text-sm text-gray-900">Price: ₹{notification.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Sold
                      </span>
                      <span className="text-sm text-gray-600">
                        Sustainability Impact: +{notification.sustainabilityContribution}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">
                        ₹{(notification.price * notification.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">Total Sale</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {notifications.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total Sales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ₹{notifications.reduce((sum, n) => sum + (n.price * n.quantity), 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {notifications.reduce((sum, n) => sum + n.quantity, 0)}
              </p>
              <p className="text-sm text-gray-600">Items Sold</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
