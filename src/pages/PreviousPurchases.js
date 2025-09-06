import React, { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

export default function PreviousPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchPurchases = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userPurchases = storage.getPurchases(currentUser.uid);
      setPurchases(userPurchases);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPurchases();
  }, [currentUser, fetchPurchases]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Previous Purchases</h1>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No purchases yet</h3>
          <p className="text-gray-500 mb-6">Your purchase history will appear here once you make your first purchase</p>
          <a
            href="/"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{purchase.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">
                    ₹{purchase.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {purchase.products?.map((product, index) => (
                  <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs">Image</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Seller: {product.sellerName || 'Unknown Seller'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${product.price?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {purchase.products?.length || 0} item(s)
                  </div>
                  <div className="text-sm text-gray-500">
                    Payment: {purchase.paymentMethod || 'Not specified'}
                  </div>
                </div>
                {purchase.shippingAddress && (
                  <div className="mt-2 text-sm text-gray-500">
                    <div>Ship to: {purchase.shippingAddress.fullName}</div>
                    <div>{purchase.shippingAddress.address}, {purchase.shippingAddress.city}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note about demo functionality */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Checkout Complete!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                You can now complete the full checkout process! Add items to your cart, 
                proceed to checkout, fill in your details, and complete a purchase. 
                All orders are saved to your purchase history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

