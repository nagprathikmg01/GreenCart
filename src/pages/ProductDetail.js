import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { calculateItemSustainability } from '../utils/sustainability';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const foundProduct = storage.getProduct(id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [id, fetchProduct]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert('Please log in to add items to cart');
      return;
    }
    
    try {
      await addToCart(product.id);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      alert('Please log in to purchase items');
      return;
    }
    // For now, just add to cart and navigate to cart
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Product not found</h3>
        <p className="text-gray-500 mb-6">{error || 'The product you are looking for does not exist.'}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-3 hover:bg-primary-50 rounded-xl transition-all duration-200 group hover:scale-105"
        >
          <svg className="w-6 h-6 text-gray-600 group-hover:text-primary-600 group-hover:animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient">Product Details</h1>
          <p className="text-gray-600 mt-1">Explore this amazing product</p>
        </div>
      </div>

      <div className="card overflow-hidden animate-scale-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Enhanced Product Image */}
          <div className="relative group">
            <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden relative">
              {product.imageUrl && product.imageUrl !== 'https://via.placeholder.com/400x300?text=No+Image' ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">📷</div>
                  <p>Image Placeholder</p>
                </div>
              </div>
              
              {/* Hover overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              
              {/* Floating action buttons */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 mb-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Product Info */}
          <div className="space-y-8">
            <div className="animate-slide-up">
              <h2 className="text-4xl font-display font-bold text-gradient mb-4 group-hover:scale-105 transition-transform duration-300">{product.title}</h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gradient group-hover:scale-110 transition-transform duration-300">₹{product.price}</span>
                <span className="card-glass text-gray-700 px-4 py-2 rounded-full text-sm font-semibold group-hover:animate-wiggle">
                  {product.category}
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{product.description}</p>
            </div>

            {/* Enhanced Sustainability Impact */}
            <div className="card-eco p-6 group hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-eco-500 to-primary-500 rounded-2xl shadow-lg group-hover:animate-bounce-gentle">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="ml-3 text-xl font-bold text-eco-800 flex items-center gap-2">
                  <span className="animate-pulse-slow">🌱</span> Sustainability Impact
                </h3>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-gradient mb-3 group-hover:scale-110 transition-transform duration-300">
                  +{calculateItemSustainability(product).contribution}%
                </div>
                <p className="text-eco-700 text-base group-hover:text-eco-800 transition-colors duration-300">
                  {calculateItemSustainability(product).explanation}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h3>
              <p className="text-gray-600">Sold by: {product.sellerName || 'Unknown Seller'}</p>
              <p className="text-sm text-gray-500">
                Listed on: {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Product Availability Status */}
            {!product.isAvailable ? (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 mb-6 animate-slide-up">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">This product has been sold</h3>
                    <p className="text-red-600 text-sm mt-1">
                      This item is no longer available for purchase.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 animate-fade-in">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 btn-primary py-4 px-6 shimmer group"
                >
                  <span className="group-hover:animate-bounce-gentle inline-block">🚀</span> Buy Now
                </button>
              </div>
            )}

            {!currentUser && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> You need to be logged in to add items to cart or make purchases.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
