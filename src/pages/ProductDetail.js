import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Rocket, ShieldCheck, Leaf, Truck } from 'lucide-react';
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
  const [alternatives, setAlternatives] = useState([]);
  const { currentUser } = useAuth();
  const { addToCart } = useCart();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const foundProduct = storage.getProduct(id);
      if (foundProduct) {
        setProduct(foundProduct);
        const allProducts = storage.getAvailableProducts();
        const alts = allProducts
          .filter(p => p.id !== foundProduct.id && p.category === foundProduct.category)
          .map(p => ({ ...p, score: calculateItemSustainability(p).contribution }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        setAlternatives(alts);
      } else {
        console.log('Product not found');
      }
    } catch (error) {
      console.log('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProduct(); }, [id, fetchProduct]);

  const handleAddToCart = async () => {
    if (!currentUser) { alert('Please log in.'); return; }
    await addToCart(product.id);
  };

  const handleBuyNow = () => {
    if (!currentUser) { alert('Please log in.'); return; }
    handleAddToCart();
    navigate('/cart');
  };

  if (loading || !product) return <div className="min-h-screen" />; // Skeleton could go here

  return (
    <div className="pt-24 pb-20 container mx-auto px-4 md:px-8">
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ x: -4 }}
        className="mb-8 flex items-center gap-2 text-secondary-500 hover:text-primary-600 font-medium transition-colors"
      >
        <ArrowLeft size={18} /> Back to browsing
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Premium Image Gallery */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-soft border border-secondary-100 relative group"
          >
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/600x450' }}
            />
            <div className="absolute top-6 left-6">
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-eco-700 font-bold border border-eco-200">
                <Leaf size={16} className="fill-eco-500" />
                +{calculateItemSustainability(product).contribution}% Eco Score
              </div>
            </div>
          </motion.div>

          <div className="mt-8">
            <h3 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <ShieldCheck className="text-primary-500" /> Authenticity & Impact
            </h3>
            <ProductInsight product={product} />
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-primary-600 font-bold tracking-wider text-xs uppercase bg-primary-50 px-3 py-1 rounded-md">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mt-4 mb-2 leading-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-secondary-900">₹{product.price}</span>
                <span className="text-secondary-400 text-sm">Save 40% vs New</span>
              </div>

              <p className="text-secondary-600 text-lg leading-relaxed mb-8 border-b border-secondary-100 pb-8">
                {product.description}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-secondary-600">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                    <Truck size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-800">Fast Delivery</p>
                    <p>2-4 Business Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-secondary-600">
                  <div className="w-10 h-10 rounded-full bg-eco-50 flex items-center justify-center text-eco-600">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-800">Carbon Neutral</p>
                    <p>Shipping included</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!product.isAvailable ? (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-center font-bold">
                  Currently Sold Out
                </div>
              ) : (
                <div className="space-y-3">
                  <button onClick={handleAddToCart} className="w-full bg-white border-2 border-secondary-200 text-secondary-800 font-bold py-4 rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2">
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="w-full btn-primary flex items-center justify-center gap-2 text-lg">
                    <Rocket size={20} /> Buy Now
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <section className="mt-24 border-t border-secondary-100 pt-16">
          <h2 className="text-2xl font-display font-bold mb-8">Similar Sustainable Finds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alternatives.map(alt => (
              <div key={alt.id} onClick={() => navigate(`/product/${alt.id}`)} className="cursor-pointer group">
                <div className="aspect-video rounded-xl overflow-hidden bg-secondary-100 mb-3">
                  <img src={alt.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={alt.title} />
                </div>
                <h4 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{alt.title}</h4>
                <p className="text-sm text-secondary-500">₹{alt.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
