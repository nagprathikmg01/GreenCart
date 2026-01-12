import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Rocket, AlertCircle, Leaf } from 'lucide-react';
import { storage } from '../utils/storage';
import { calculateItemSustainability } from '../utils/sustainability';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProductInsight from '../components/AI/ProductInsight';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alternatives, setAlternatives] = useState([]);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const foundProduct = storage.getProduct(id);
      if (foundProduct) {
        setProduct(foundProduct);

        // Find Sustainable Alternatives (Simple Logic)
        const allProducts = storage.getAvailableProducts();
        const alts = allProducts
          .filter(p => p.id !== foundProduct.id && p.category === foundProduct.category)
          .map(p => ({ ...p, score: calculateItemSustainability(p).contribution }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        setAlternatives(alts);

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
    <div className="max-w-7xl mx-auto px-4">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-3 hover:bg-white rounded-xl transition-all duration-200 group shadow-sm border border-transparent hover:border-gray-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-primary-600" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-800">Product Details</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative group h-fit"
        >
          <div className="aspect-square bg-white rounded-3xl shadow-xl overflow-hidden relative border border-gray-100">
            {product.imageUrl && product.imageUrl !== 'https://via.placeholder.com/400x300?text=No+Image' ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-full h-full hidden items-center justify-center bg-gray-50 text-gray-400">
              <div className="text-center">
                <span className="text-5xl block mb-2">📷</span>
                Image Placeholder
              </div>
            </div>

            {/* Sustainability Badge on Image */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-md text-eco-700 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-sm border border-eco-100">
                <Leaf size={16} className="fill-eco-500 text-eco-500" />
                +{calculateItemSustainability(product).contribution}% Impact
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Info & AI */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">{product.title}</h2>
                <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-primary-600">₹{product.price}</span>
              </div>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mt-6">{product.description}</p>
          </motion.div>

          {/* AI Insight Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ProductInsight product={product} />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 pt-4"
          >
            {!product.isAvailable ? (
              <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle />
                <span className="font-semibold">This product has been sold.</span>
              </div>
            ) : (
              <>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-primary-500 text-primary-700 py-4 px-6 rounded-xl font-bold hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-eco-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  <Rocket size={20} />
                  Buy Now
                </button>
              </>
            )}
          </motion.div>

          {/* Seller Metadata */}
          <div className="pt-6 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
            <span>Sold by: <span className="font-medium text-gray-900">{product.sellerName || 'Unknown'}</span></span>
            <span>Listed: {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Sustainable Alternatives Section */}
      {alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Sustainable Alternatives</h3>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded border border-green-200">Recommended for you</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                onClick={() => navigate(`/product/${alt.id}`)}
                className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
                  <img src={alt.imageUrl} alt={alt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="font-bold text-gray-800 mb-1 truncate">{alt.title}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-primary-600 font-bold">₹{alt.price}</span>
                  <span className="text-xs text-eco-600 font-medium flex items-center gap-1">
                    <Leaf size={12} /> +{alt.score}% Eco Score
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

