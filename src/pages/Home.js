import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, Leaf, Sparkles, ArrowRight, Zap, Recycle, Heart, Brain, Cpu } from 'lucide-react';
import { storage } from '../utils/storage';
import { calculateItemSustainability } from '../utils/sustainability';
import LoadingSpinner from '../components/LoadingSpinner';

const categories = [
  'All', 'Electronics', 'Clothing', 'Furniture', 'Books',
  'Sports', 'Home & Garden', 'Toys', 'Other'
];

// Feature Card Component for Storytelling Section
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10 }}
    className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-2xl transition-all duration-300 border border-secondary-100 group relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
    <div className={`w-14 h-14 rounded-2xl bg-${color}-100 text-${color}-600 flex items-center justify-center mb-6 relative z-10 group-hover:rotate-6 transition-transform`}>
      <Icon size={28} />
    </div>
    <h3 className="font-display font-bold text-xl text-secondary-900 mb-3 relative z-10">{title}</h3>
    <p className="text-secondary-500 leading-relaxed relative z-10">{description}</p>
  </motion.div>
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 800)); // Premium load feel
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



  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-secondary-50">
        <LoadingSpinner size="lg" text="Crafting your sustainable experience..." />
      </div>
    );
  }

  return (
    <div className="bg-secondary-50 min-h-screen overflow-x-hidden">

      {/* 1. ULTIMATE HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-50 via-primary-50 to-eco-50 z-0"></div>

        {/* Floating Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[10%] w-[500px] h-[500px] bg-gradient-to-tr from-primary-400/20 to-eco-300/20 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ y: [0, 40, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-accent-400/10 to-orange-300/10 rounded-full blur-[100px]"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="text-center lg:text-left pt-10"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-full px-5 py-2 text-sm font-bold text-eco-700 mb-8 shadow-sm"
            >
              <Sparkles size={16} className="text-accent-500 fill-accent-500 animate-pulse" />
              <span>Reimagining Commerce for Good</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold text-secondary-900 leading-[1.1] mb-8 tracking-tight"
            >
              Make Impact <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-eco-500 to-teal-500 animate-gradient-x">
                Normal.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-secondary-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Experience the smartest way to shop sustainably.
              Powered by AI, driven by purpose, and designed for a cleaner future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3"
              >
                Start Exploration <ArrowRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-secondary-700 bg-white/50 backdrop-blur-sm border border-white/60 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Zap size={20} className="text-accent-500" /> AI Insights
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block h-[600px]"
          >
            {/* Main Hero Image/Graphic Concept */}
            <div className="relative w-full h-full">
              {/* Center Circle */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-b from-eco-400 to-primary-600 rounded-full shadow-2xl shadow-primary-500/40 flex items-center justify-center overflow-hidden"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-90 mix-blend-overlay"></div>
                <div className="relative z-10 text-white text-center p-8">
                  <Leaf size={64} className="mx-auto mb-4 drop-shadow-lg" />
                  <h2 className="text-3xl font-bold">100% Eco</h2>
                  <p className="opacity-90">Certified Impact</p>
                </div>
              </motion.div>

              {/* Orbiting Cards */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
                transition={{ delay: 0.8, duration: 4, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-20 left-0 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 w-48 z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Brain size={20} /></div>
                  <span className="font-bold text-sm text-secondary-800">AI Analysis</span>
                </div>
                <div className="h-1.5 w-full bg-secondary-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="h-full bg-gradient-to-r from-orange-400 to-rose-500"
                  />
                </div>
                <p className="text-xs text-secondary-500 mt-2 text-right">85% Match</p>
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute bottom-32 right-0 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 w-52 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg text-teal-600"><Recycle size={20} /></div>
                  <div>
                    <p className="font-bold text-sm text-secondary-800">Circular Econ</p>
                    <p className="text-xs text-eco-600 font-medium">+1.2kg CO2 Saved</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. VISUAL STORYTELLING (WHY GREENCART?) */}
      <section className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Our Mission</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">Designed for the <br /><span className="text-gradient">Conscious Consumer</span></h3>
            <p className="text-lg text-secondary-500">We bridge the gap between convenience and responsibility. Every interaction on GreenCart is optimized for minimal impact and maximum value.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Recycle}
              title="Circular by Design"
              description="Give pre-loved items a second life. Our platform prioritizes goods that keep resources in the loop."
              color="eco"
              delay={0.1}
            />
            <FeatureCard
              icon={Brain}
              title="AI-Powered Wisdom"
              description="Don't just buy—understand. Our AI analyzes sustainability metrics to help you make informed choices."
              color="violet"
              delay={0.3}
            />
            <FeatureCard
              icon={Heart}
              title="Community Driven"
              description="Join a network of changemakers. Track your collective impact and inspire others to act."
              color="rose"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* 3. AI INNOVATION HIGHLIGHT */}
      <section className="py-24 relative overflow-hidden bg-secondary-900 text-white">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6 text-accent-400 font-bold tracking-widest uppercase text-sm">
                <Cpu size={18} />
                <span>Green AI Engine</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Intelligence that <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-300">Counts the Cost</span>
              </h2>
              <p className="text-secondary-300 text-lg mb-8 leading-relaxed">
                Sustainability isn't a guessing game anymore. Our proprietary AI evaluates material composition, lifecycle span, and supply chain data to give every product a transparent Eco-Score.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="p-3 bg-primary-500/20 rounded-lg text-primary-300"><Brain size={24} /></div>
                  <div>
                    <h4 className="font-bold">Smart Analysis</h4>
                    <p className="text-sm text-secondary-400">Instant breakdown of environmental impact.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                  <div className="p-3 bg-accent-500/20 rounded-lg text-accent-300"><Sparkles size={24} /></div>
                  <div>
                    <h4 className="font-bold">Better Alternatives</h4>
                    <p className="text-sm text-secondary-400">Auto-suggests greener options while you shop.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl"
            >
              {/* Mock AI Interface */}
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-mono text-white/50">ai_analysis_module.exe</span>
              </div>

              <div className="space-y-6 font-mono text-sm">
                <div className="flex gap-4">
                  <span className="text-primary-400 w-24 flex-shrink-0">{">"} INPUT:</span>
                  <span className="text-white">Leather Messenger Bag (Vintage)</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-accent-400 w-24 flex-shrink-0 animate-pulse">{">"} PROCESSING:</span>
                  <span className="text-secondary-300">Calculating lifecycle carbon footprint...</span>
                </div>
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Material Reuse</span>
                    <span className="text-green-400">High (95%)</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mb-4">
                    <div className="bg-green-500 h-full rounded-full w-[95%]"></div>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Durability</span>
                    <span className="text-blue-400">Excellent</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full">
                    <div className="bg-blue-500 h-full rounded-full w-[90%]"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-green-400 w-24 flex-shrink-0">{">"} VERDICT:</span>
                  <span className="text-white font-bold">Recommended Choice. Saves ~12kg CO2 vs New.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (PREMIUM GRID) */}
      <section className="py-24 bg-gradient-to-b from-white to-secondary-50" id="shop">
        {/* Sticky Search & Filter Bar (Reused but polished) */}
        <div className="sticky top-20 z-40 mb-16 container mx-auto px-4 md:px-0">
          <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-medium transition-all ring-1 ring-black/5">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
              <input
                type="text"
                placeholder="Search for sustainable treasures..."
                className="w-full pl-12 pr-4 py-3 bg-secondary-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/50 transition-all outline-none text-secondary-700 placeholder-secondary-400 font-medium hover:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-secondary-900 text-white shadow-lg scale-105 ring-2 ring-secondary-900 ring-offset-2'
                    : 'bg-white text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 border border-secondary-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900">Curated Finds</h2>
            <span className="hidden md:block text-secondary-500 font-medium">{filteredProducts.length} items available</span>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -12 }}
                  className="group card-premium overflow-hidden bg-white"
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

                      {/* Floating Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-xs font-bold text-eco-700 px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                        <Leaf size={12} className="fill-eco-500" />
                        +{calculateItemSustainability(product).contribution}% Impact
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1 relative">
                      <div className="mb-auto">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-bold tracking-wider text-secondary-500 uppercase bg-secondary-100 px-2 py-0.5 rounded-md">
                            {product.category}
                          </span>
                          <span className="font-display font-bold text-xl text-primary-700">₹{product.price}</span>
                        </div>

                        <h3 className="font-display font-bold text-secondary-900 text-lg mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                          {product.title}
                        </h3>
                        <p className="text-secondary-500 text-sm line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Hover Action */}
                      <div className="mt-5 pt-5 border-t border-secondary-100 flex items-center justify-between text-sm font-medium text-secondary-500 group-hover:text-primary-600 transition-colors">
                        <span className="flex items-center gap-2">View Details</span>
                        <div className="bg-secondary-50 p-2 rounded-full group-hover:bg-primary-50 transition-colors">
                          <ArrowRight size={16} className="-ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
