import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Leaf, Sparkles, ArrowRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { calculateItemSustainability } from '../utils/sustainability';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'All', 'Electronics', 'Clothing', 'Furniture', 'Books',
  'Sports', 'Home & Garden', 'Toys', 'Other'
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
      await new Promise(r => setTimeout(r, 600)); // Simulating premium feel load
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

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { filterProducts(); }, [products, searchTerm, selectedCategory, filterProducts]);

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to add items to cart');
      return;
    }
    await addToCart(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-secondary-50">
        <LoadingSpinner size="lg" text="Curating sustainable finds..." />
      </div>
    );
  }

  return (
    <div className="pb-20 pt-20">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-secondary-900 mx-4 md:mx-0 shadow-2xl mb-16 isolate">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-eco-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        </div>

        <div className="container mx-auto px-6 py-20 md:py-28 relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-300 mb-6"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>The Future of Circular Economy</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.1] tracking-tight mb-6"
            >
              Shop Consciously. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Live Sustainably.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-secondary-300 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed"
            >
              Join the movement against waste. Discover curated, pre-loved items that tell a story while reducing your carbon footprint.
            </motion.p>

            {!currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              >
                <Link to="/signup" className="btn-primary flex items-center justify-center gap-2 group">
                  Start Your Journey
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="px-6 py-3 rounded-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-colors">
                  Browse as Guest
                </Link>
              </motion.div>
            )}
          </div>

          {/* 3D Illustration / Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative w-full max-w-lg aspect-square"
          >
            {/* Abstract Floating Cards Visual */}
            <div className="relative w-full h-full">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-10 w-48 h-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-20"
              >
                <div className="w-full h-32 bg-gradient-to-br from-orange-400 to-rose-400 rounded-lg mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 w-56 h-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl z-30"
              >
                <div className="w-full h-40 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf size={48} className="text-white/80" />
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded p-2">
                  <span className="text-xs text-white">Impact</span>
                  <span className="text-xs font-bold text-emerald-300">+85%</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-20 z-40 mb-12 container mx-auto px-4 md:px-0">
        <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-medium transition-all">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
            <input
              type="text"
              placeholder="Search for sustainable treasures..."
              className="w-full pl-12 pr-4 py-3 bg-secondary-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/50 transition-all outline-none text-secondary-700 placeholder-secondary-400 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-secondary-900 text-white shadow-lg scale-105'
                    : 'bg-white text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -8 }}
                className="group card-premium overflow-hidden"
              >
                <Link to={`/product/${product.id}`} className="block relative h-full flex flex-col">
                  {/* Image Container */}
                  <div className="aspect-[4/3] relative overflow-hidden bg-secondary-100">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-xs font-bold text-eco-700 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                      <Leaf size={12} className="fill-eco-500" />
                      +{calculateItemSustainability(product).contribution}% Impact
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 relative bg-white">
                    <div className="mb-auto">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold tracking-wider text-secondary-400 uppercase bg-secondary-50 px-2 py-0.5 rounded-md">
                          {product.category}
                        </span>
                        <span className="font-display font-bold text-lg text-primary-700">₹{product.price}</span>
                      </div>

                      <h3 className="font-display font-bold text-secondary-900 text-lg mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-secondary-500 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Hover Action */}
                    <motion.button
                      onClick={(e) => handleAddToCart(e, product.id)}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-secondary-50 text-secondary-700 hover:bg-primary-600 hover:text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-4 lg:group-hover:translate-y-0"
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </motion.button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-32 opacity-50">
            <div className="text-6xl mb-4 grayscale">🔍</div>
            <p className="text-xl font-medium text-secondary-500">No sustainable finds here yet.</p>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {currentUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-6 lg:right-10 z-30"
        >
          <Link
            to="/add-product"
            className="w-16 h-16 bg-gradient-to-tr from-secondary-800 to-secondary-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-black/50 transition-shadow"
          >
            <span className="text-3xl font-light">+</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
