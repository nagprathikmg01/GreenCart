import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const addToCart = async (productId) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const updatedCart = storage.addToCart(currentUser.uid, productId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const updatedCart = storage.removeFromCart(currentUser.uid, cartItemId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const updatedCart = storage.clearCart(currentUser.uid);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const cart = storage.getCart(currentUser.uid);
      setCartItems(cart);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [currentUser, fetchCartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCartItems,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}