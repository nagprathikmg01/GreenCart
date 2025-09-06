import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export default function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const { cartItems, removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchCartProducts = useCallback(async () => {
    if (!currentUser || cartItems.length === 0) {
      setCartProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const products = [];
      for (const cartItem of cartItems) {
        const product = storage.getProduct(cartItem.productId);
        if (product) {
          products.push({
            ...product,
            cartItemId: cartItem.id,
            quantity: cartItem.quantity || 1
          });
        }
      }
      
      setCartProducts(products);
    } catch (error) {
      console.error('Error fetching cart products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, cartItems]);

  useEffect(() => {
    fetchCartProducts();
  }, [cartItems, fetchCartProducts]);

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      setRemoving(cartItemId);
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
    } finally {
      setRemoving(null);
    }
  };

  const calculateTotal = () => {
    return cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Demo Mode
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Add products to cart from the home page or product detail pages. 
                Cart items are stored locally and will reset when you refresh the page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {cartProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some products to get started</p>
          <a
            href="/"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartProducts.map((product) => (
              <div key={product.cartItemId} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    {product.imageUrl && product.imageUrl !== 'https://via.placeholder.com/400x300?text=No+Image' ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Image
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        Sold by: {product.sellerName || 'Unknown Seller'}
                      </span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Qty: {product.quantity}</div>
                      <span className="text-xl font-bold text-primary-600">
                        ₹{(product.price * product.quantity).toFixed(2)}
                      </span>
                      {product.quantity > 1 && (
                        <div className="text-xs text-gray-400">
                          ₹{product.price} each
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(product.cartItemId)}
                      disabled={removing === product.cartItemId}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {removing === product.cartItemId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">
                Total ({cartProducts.length} items)
              </span>
              <span className="text-2xl font-bold text-primary-600">
                ₹{calculateTotal().toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                Proceed to Checkout
              </button>
              <a
                href="/"
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center block"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
