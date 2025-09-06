import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import MyListings from './pages/MyListings';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PreviousPurchases from './pages/PreviousPurchases';
import SustainabilityDashboard from './pages/SustainabilityDashboard';
import DataViewer from './pages/DataViewer';
import SellerNotifications from './pages/SellerNotifications';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <Router>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-eco-50 to-accent-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/add-product" element={
                  <PrivateRoute>
                    <AddProduct />
                  </PrivateRoute>
                } />
                <Route path="/my-listings" element={
                  <PrivateRoute>
                    <MyListings />
                  </PrivateRoute>
                } />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                } />
                <Route path="/checkout" element={
                  <PrivateRoute>
                    <Checkout />
                  </PrivateRoute>
                } />
                <Route path="/purchases" element={
                  <PrivateRoute>
                    <PreviousPurchases />
                  </PrivateRoute>
                } />
                <Route path="/sustainability" element={
                  <PrivateRoute>
                    <SustainabilityDashboard />
                  </PrivateRoute>
                } />
                <Route path="/data-viewer" element={
                  <PrivateRoute>
                    <DataViewer />
                  </PrivateRoute>
                } />
                <Route path="/seller-notifications" element={
                  <PrivateRoute>
                    <SellerNotifications />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
          </div>
          </Router>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
