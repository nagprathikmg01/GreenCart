import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, Leaf, Sparkles } from 'lucide-react';
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
      // Simulate slight delay for loading animation to show
      await new Promise(r => setTimeout(r, 600));
      const products = storage.getAvailableProducts();
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

  const handleAddToCart = async (e, productId) => {
    e.preventDefault(); // Prevent navigation
    if (!currentUser) {
      alert('Please log in to add items to cart');
      return;
    }
    await addToCart(productId);
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" text="Loading amazing products..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-eco-900 rounded-3xl p-8 md:p-16 mb-12 shadow-2xl text-white"
      >
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/20"
          >
            <Sparkles size={16} className="text-yellow-300" />
            <span className="text-sm font-medium">Experience the Future of Sustainable Shopping</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight leading-tight">
            Shop Consciously. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
              Live Sustainably.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
            Discover unique pre-loved items, reduce waste, and track your environmental impact with every purchase.
          </p>

          {!currentUser && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-primary-900 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
                Get Started <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">→</div>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-20 w-80 h-80 bg-eco-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="mb-12 sticky top-4 z-40 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for sustainable items..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-md transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              <Link to={`/product/${product.id}`} className="block relative">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

                  {/* Impact Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur shadow-sm rounded-full px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-eco-700">
                    <Leaf size={12} className="fill-eco-500 text-eco-500" />
                    +{calculateItemSustainability(product).contribution}%
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{product.category}</p>
                    <p className="font-bold text-gray-900">₹{product.price}</p>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
                    {product.title}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                    {product.description}
                  </p>

                  <button
                    onClick={(e) => handleAddToCart(e, product.id)}
                    className="w-full bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:bg-primary-600 group-hover:text-white"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="mb-6 bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            We couldn't find any items matching your search. Try changing your filters or checking back later!
          </p>
        </div>
      )}

      {/* Floating Sell Button */}
      {currentUser && (
        <motion.div
          className="fixed bottom-24 right-6 lg:right-10 z-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            to="/add-product"
            className="w-14 h-14 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-black transition-colors"
          >
            <span className="text-2xl font-light">+</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
