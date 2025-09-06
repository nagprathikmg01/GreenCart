import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { calculateItemSustainability } from '../utils/sustainability';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Furniture',
  'Books',
  'Sports',
  'Home & Garden',
  'Toys',
  'Other'
];


export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = storage.getAvailableProducts(); // Only get available products
      setProducts(products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, filterProducts]);

  const handleAddToCart = async (productId) => {
    if (!currentUser) {
      alert('Please log in to add items to cart');
      return;
    }
    await addToCart(productId);
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading amazing products..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden morphing-bg rounded-3xl p-8 mb-8 group">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/30 via-eco-100/30 to-accent-100/30 animate-pulse-slow"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <div className="relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-4 animate-fade-in">
                Welcome to <span className="text-gradient-rainbow animate-pulse-glow">GreenCart</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-eco-500 mx-auto rounded-full animate-scale-in"></div>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
              Discover amazing second-hand products while making a positive impact on our planet. 
              Every purchase contributes to sustainability! 🌱
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 animate-bounce-gentle">
              <div className="flex items-center space-x-2 card-glass rounded-full px-6 py-3 hover:scale-110 transition-transform duration-300 group">
                <span className="text-2xl group-hover:animate-wiggle">♻️</span>
                <span className="font-semibold text-gray-800">Sustainable Shopping</span>
              </div>
              <div className="flex items-center space-x-2 card-glass rounded-full px-6 py-3 hover:scale-110 transition-transform duration-300 group">
                <span className="text-2xl group-hover:animate-wiggle">💰</span>
                <span className="font-semibold text-gray-800">Great Prices</span>
              </div>
              <div className="flex items-center space-x-2 card-glass rounded-full px-6 py-3 hover:scale-110 transition-transform duration-300 group">
                <span className="text-2xl group-hover:animate-wiggle">🌍</span>
                <span className="font-semibold text-gray-800">Eco-Friendly</span>
              </div>
            </div>
            {!currentUser && (
              <div className="animate-scale-in">
                <Link
                  to="/signup"
                  className="btn-primary inline-block shimmer glow"
                >
                  Get Started Now 🚀
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <div className="absolute top-10 left-10 text-6xl floating opacity-20 hover:opacity-40 transition-opacity duration-300 cursor-pointer">🌿</div>
        <div className="absolute top-20 right-20 text-4xl floating-delayed opacity-30 hover:opacity-50 transition-opacity duration-300 cursor-pointer">♻️</div>
        <div className="absolute bottom-10 left-20 text-5xl floating opacity-25 hover:opacity-45 transition-opacity duration-300 cursor-pointer" style={{animationDelay: '4s'}}>🌱</div>
        <div className="absolute bottom-20 right-10 text-3xl floating-delayed opacity-35 hover:opacity-55 transition-opacity duration-300 cursor-pointer" style={{animationDelay: '1s'}}>💚</div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/3 left-1/4 text-2xl floating opacity-15 animate-rotate-slow">✨</div>
        <div className="absolute top-2/3 right-1/3 text-3xl floating-delayed opacity-20 animate-rotate-slow" style={{animationDelay: '3s'}}>🌟</div>
        <div className="absolute top-1/2 left-1/2 text-4xl floating opacity-10 animate-pulse-glow">💫</div>
      </div>

      {/* Demo Notice */}
      <div className="card-eco p-6 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🚀 Demo Mode Active
            </h3>
            <div className="text-gray-700">
              <p className="mb-2">
                This is a fully functional demo! You can log in with any email/password combination. 
                All data is stored locally and persists between sessions.
              </p>
              <p className="text-sm text-gray-600">
                Try adding products to cart, making purchases, and exploring all features!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="card group floating-card animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              
              {/* Enhanced category badge */}
              <div className="absolute top-3 right-3">
                <span className="card-glass text-xs font-semibold text-gray-700 px-3 py-1 rounded-full shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {product.category}
                </span>
              </div>
              
              {/* Enhanced sustainability badge */}
              <div className="absolute top-3 left-3">
                <div className="bg-gradient-to-r from-eco-500 to-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg glow-eco group-hover:animate-pulse-glow transition-all duration-300">
                  +{calculateItemSustainability(product).contribution}% 🌱
                </div>
              </div>
              
              {/* Floating action button */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                {product.description}
              </p>
              
              {/* Enhanced Sustainability Impact */}
              <div className="mb-4 p-3 bg-gradient-to-r from-eco-50 to-primary-50 rounded-xl border border-eco-200 group-hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-eco-700 font-semibold flex items-center gap-1">
                    <span className="animate-pulse-slow">🌱</span> Sustainability Impact
                  </span>
                </div>
                <p className="text-xs text-eco-600 line-clamp-1 group-hover:text-eco-700 transition-colors duration-300">
                  {calculateItemSustainability(product).explanation}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform duration-300">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                  by {product.sellerName}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl text-center text-sm font-semibold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md group"
                >
                  <span className="group-hover:animate-wiggle inline-block">👁️</span> View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="flex-1 btn-primary text-sm py-3 px-4 shimmer group"
                >
                  <span className="group-hover:animate-bounce-gentle inline-block">🛒</span> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Be the first to list a product!'}
          </p>
        </div>
      )}

      {/* Enhanced Floating Add Button for logged in users */}
      {currentUser && (
        <div className="fixed bottom-6 right-6 z-50 group">
          {/* Ripple effect */}
          <div className="absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-20 group-hover:opacity-30"></div>
          <div className="absolute inset-0 bg-primary-500 rounded-full animate-pulse opacity-10 group-hover:opacity-20"></div>
          
          <Link
            to="/add-product"
            className="relative bg-gradient-to-r from-primary-500 to-eco-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 glow group"
          >
            <svg className="w-7 h-7 group-hover:animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Add New Product
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}