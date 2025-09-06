import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { storage } from '../utils/storage';
import { calculateTotalSustainability, calculateLifetimeSustainability } from '../utils/sustainability';
import Popup from '../components/Popup';

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [achievementData, setAchievementData] = useState(null);
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = storage.getProduct(item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const calculateSustainabilityPreview = () => {
    const productDetails = cartItems.map(item => {
      const product = storage.getProduct(item.productId);
      return {
        ...product,
        quantity: item.quantity
      };
    }).filter(product => product.id);
    
    return calculateTotalSustainability(productDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.address || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Get product details for sustainability calculation
      const productDetails = cartItems.map(item => {
        const product = storage.getProduct(item.productId);
        return {
          ...product,
          quantity: item.quantity
        };
      }).filter(product => product.id); // Filter out any missing products

      // Calculate sustainability contribution for this purchase
      const sustainabilityData = calculateTotalSustainability(productDetails);

      // Create purchase record
      const purchase = {
        products: cartItems.map(item => {
          const product = storage.getProduct(item.productId);
          return {
            productId: item.productId,
            title: product?.title || 'Unknown Product',
            price: product?.price || 0,
            quantity: item.quantity,
            sellerId: product?.sellerId,
            sellerName: product?.sellerName,
            category: product?.category || 'Others'
          };
        }),
        totalAmount: calculateTotal(),
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode
        },
        sustainabilityContribution: sustainabilityData.totalContribution,
        sustainabilityBreakdown: sustainabilityData.breakdown,
        status: 'completed'
      };

      // Mark products as sold
      for (const item of cartItems) {
        storage.markProductAsSold(item.productId, currentUser.uid);
      }

      // Save purchase to history
      storage.addPurchase(currentUser.uid, purchase);

      // Update user's lifetime sustainability score
      const allPurchases = storage.getPurchases(currentUser.uid);
      const lifetimeSustainability = calculateLifetimeSustainability(allPurchases);
      storage.updateUserSustainability(currentUser.uid, lifetimeSustainability);

      // Clear cart
      await clearCart();

      // Check for achievement (50%+ sustainability contribution)
      if (sustainabilityData.totalContribution >= 50) {
        setAchievementData({
          title: "🎉 Sustainability Achievement Unlocked!",
          message: `Congratulations! You've achieved ${sustainabilityData.totalContribution}% sustainability contribution! You're making a real difference for our planet!`,
          showGift: true
        });
        setShowAchievementPopup(true);
      } else {
        // Show thank you popup
        setShowThankYouPopup(true);
      }
      
    } catch (error) {
      setError('Payment processing failed. Please try again.');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 mb-6">Add some products to your cart before checkout</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Credit Card
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  PayPal
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={formData.paymentMethod === 'bank_transfer'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Bank Transfer
                </label>
              </div>
            </div>

            {formData.paymentMethod === 'credit_card' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing Payment...' : 'Complete Purchase'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            {cartItems.map((item) => {
              const product = storage.getProduct(item.productId);
              if (!product) return null;
              
              return (
                <div key={item.id} className="flex items-center space-x-4 py-3 border-b border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{(product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Sustainability Impact Preview */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="ml-2 text-sm font-medium text-green-800">
                Sustainability Impact
              </h3>
            </div>
            <div className="text-sm text-green-700">
              <p className="font-semibold">
                🌱 You'll contribute {calculateSustainabilityPreview().totalContribution}% to sustainability!
              </p>
              <p className="mt-1 text-xs">
                {calculateSustainabilityPreview().message}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Demo Checkout
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This is a demo checkout process. No real payment will be processed. 
                    Your order will be saved to your purchase history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Popup */}
      <Popup
        isOpen={showAchievementPopup}
        onClose={() => {
          setShowAchievementPopup(false);
          navigate('/purchases');
        }}
        title={achievementData?.title || "Achievement Unlocked!"}
        message={achievementData?.message || "Congratulations on your achievement!"}
        type="achievement"
        showGift={achievementData?.showGift || false}
      />

      {/* Thank You Popup */}
      <Popup
        isOpen={showThankYouPopup}
        onClose={() => {
          setShowThankYouPopup(false);
          navigate('/purchases');
        }}
        title="🙏 Thank You for Your Purchase!"
        message="Your order has been placed successfully! Thank you for choosing sustainable shopping with GreenCart. Your contribution to the environment is appreciated!"
        type="thankyou"
        showGift={false}
      />
    </div>
  );
}
