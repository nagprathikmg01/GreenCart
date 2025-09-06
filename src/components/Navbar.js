import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-eco-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-bold text-xl group-hover:animate-bounce-gentle">🌱</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-400 rounded-full animate-pulse-slow group-hover:animate-ping"></div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-eco-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <div className="group-hover:scale-105 transition-transform duration-300">
            <span className="text-2xl font-display font-bold text-gradient group-hover:text-gradient-rainbow transition-all duration-300">GreenCart</span>
            <p className="text-xs text-gray-500 -mt-1 group-hover:text-gray-600 transition-colors duration-300">Sustainable Marketplace</p>
          </div>
        </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
              <span className="group-hover:animate-bounce-gentle inline-block">🏠</span> Home
            </Link>
            {currentUser && (
              <>
                <Link to="/my-listings" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <span className="group-hover:animate-wiggle inline-block">📋</span> My Listings
                </Link>
                <Link to="/add-product" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <span className="group-hover:animate-bounce-gentle inline-block">➕</span> Add Product
                </Link>
                <Link to="/seller-notifications" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group relative">
                  <span className="group-hover:animate-pulse-slow inline-block">📦</span> Sales
                </Link>
                <Link to="/cart" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group relative">
                  <span className="group-hover:animate-bounce-gentle inline-block">🛒</span> Cart
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-eco-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse-glow">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/purchases" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <span className="group-hover:animate-wiggle inline-block">📦</span> Purchases
                </Link>
                <Link to="/sustainability" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <span className="group-hover:animate-pulse-slow inline-block">🌱</span> Impact
                </Link>
                <Link to="/data-viewer" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <span className="group-hover:animate-bounce-gentle inline-block">📊</span> Data
                </Link>
                <Link to="/dashboard" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <span className="group-hover:animate-wiggle inline-block">👤</span> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
                >
                  <span className="group-hover:animate-wiggle inline-block">🚪</span> Logout
                </button>
              </>
            )}
            {!currentUser && (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 group">
                  <span className="group-hover:animate-bounce-gentle inline-block">🔑</span> Login
                </Link>
                <Link to="/signup" className="btn-primary px-4 py-2 text-sm shimmer group">
                  <span className="group-hover:animate-bounce-gentle inline-block">✨</span> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link to="/" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                Home
              </Link>
              {currentUser && (
                <>
                  <Link to="/my-listings" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    My Listings
                  </Link>
                  <Link to="/add-product" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    Add Product
                  </Link>
                  <Link to="/cart" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    Cart ({cartItems.length})
                  </Link>
                  <Link to="/purchases" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    Purchases
                  </Link>
                  <Link to="/sustainability" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    🌱 Impact
                  </Link>
                  <Link to="/data-viewer" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    📊 Data
                  </Link>
                  <Link to="/dashboard" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
              {!currentUser && (
                <>
                  <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-primary-600">
                    Login
                  </Link>
                  <Link to="/signup" className="block px-3 py-2 text-primary-600 hover:text-primary-700">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
