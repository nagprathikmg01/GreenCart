import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNotifications } from '../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, LogOut, Package, LayoutDashboard, PlusCircle, Leaf, Bell } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { cartItems } = useCart();
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sustainability', path: '/sustainability' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-primary-500 to-eco-600 p-2 rounded-xl text-white shadow-glow group-hover:shadow-glow-hover transition-all duration-300">
            <Leaf size={20} fill="currentColor" />
          </div>
          <span className="text-2xl font-display font-bold text-secondary-900 tracking-tight">
            Green<span className="text-primary-600">Cart</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary-600 ${location.pathname === link.path ? 'text-primary-600 font-semibold' : 'text-secondary-600'
                }`}
            >
              {link.name}
            </Link>
          ))}

          {currentUser ? (
            <div className="flex items-center gap-4 border-l border-secondary-200 pl-8">
              <Link
                to="/add-product"
                className="flex items-center gap-1 text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors"
                title="Sell Item"
              >
                <PlusCircle size={18} />
                <span className="hidden lg:inline">Sell</span>
              </Link>

              <Link to="/cart" className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                <ShoppingBag size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link to="/seller-notifications" className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full border border-secondary-200 hover:border-primary-400 transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                    {currentUser.email[0].toUpperCase()}
                  </div>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-secondary-100 overflow-hidden transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-right invisible group-hover:visible">
                  <div className="py-1">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/my-listings" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700">
                      <Package size={16} /> My Listings
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-secondary-600 hover:text-primary-600">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-5 !shadow-md">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-secondary-700 hover:text-primary-600 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-secondary-200" />
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="block text-secondary-700 hover:text-primary-600">Dashboard</Link>
                  <Link to="/my-listings" className="block text-secondary-700 hover:text-primary-600">My Listings</Link>
                  <Link to="/cart" className="block text-secondary-700 hover:text-primary-600">Cart ({cartItems.length})</Link>
                  <button onClick={handleLogout} className="block w-full text-left text-rose-600 font-medium">Log Out</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="text-center py-2 rounded-lg border border-secondary-200 text-secondary-700 font-medium">Log In</Link>
                  <Link to="/signup" className="text-center py-2 rounded-lg bg-primary-600 text-white font-medium">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
