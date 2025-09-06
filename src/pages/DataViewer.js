import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export default function DataViewer() {
  const [data, setData] = useState({
    users: [],
    products: [],
    carts: {},
    purchases: {}
  });

  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    // Get all users
    const users = storage.getUsers();
    
    // Get all products
    const products = storage.getProducts();
    
    // Get all cart data for each user
    const carts = {};
    users.forEach(user => {
      carts[user.uid] = storage.getCart(user.uid);
    });
    
    // Get all purchase data for each user
    const purchases = {};
    users.forEach(user => {
      purchases[user.uid] = storage.getPurchases(user.uid);
    });

    setData({ users, products, carts, purchases });
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
      localStorage.clear();
      loadAllData();
      alert('All data has been cleared!');
    }
  };

  const exportData = () => {
    const exportData = {
      users: data.users,
      products: data.products,
      carts: data.carts,
      purchases: data.purchases,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecofinds-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderUsers = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Users ({data.users.length})</h3>
      {data.users.map((user, index) => (
        <div key={user.uid} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{user.username}</h4>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">ID: {user.uid}</p>
              <p className="text-xs text-gray-500">
                Sustainability: {user.sustainabilityScore || 0}% ({user.sustainabilityLevel || 'Beginner'})
              </p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              User #{index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Products ({data.products.length})</h3>
      {data.products.map((product, index) => (
        <div key={product.id} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{product.title}</h4>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-xs text-gray-500">
                ${product.price} • {product.category} • {product.condition}
              </p>
              <p className="text-xs text-gray-500">Seller: {product.sellerName}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Product #{index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCarts = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Shopping Carts</h3>
      {Object.entries(data.carts).map(([userId, cartItems]) => {
        const user = data.users.find(u => u.uid === userId);
        return (
          <div key={userId} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">{user?.username || 'Unknown User'}</h4>
            <p className="text-sm text-gray-600">{user?.email || userId}</p>
            <p className="text-xs text-gray-500">Items in cart: {cartItems.length}</p>
            {cartItems.map((item, index) => (
              <div key={item.id} className="ml-4 mt-2 text-xs text-gray-500">
                • {item.productId} (Qty: {item.quantity})
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Purchase History</h3>
      {Object.entries(data.purchases).map(([userId, purchases]) => {
        const user = data.users.find(u => u.uid === userId);
        return (
          <div key={userId} className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium">{user?.username || 'Unknown User'}</h4>
            <p className="text-sm text-gray-600">{user?.email || userId}</p>
            <p className="text-xs text-gray-500">Total purchases: {purchases.length}</p>
            {purchases.map((purchase, index) => (
              <div key={purchase.id} className="ml-4 mt-2 text-xs text-gray-500">
                • ${purchase.totalAmount} - {purchase.products?.length || 0} items 
                ({purchase.sustainabilityContribution || 0}% sustainability)
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Viewer</h1>
        <p className="text-gray-600">View all data stored in your browser's local storage</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={loadAllData}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔄 Refresh Data
        </button>
        <button
          onClick={exportData}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          📥 Export Data
        </button>
        <button
          onClick={clearAllData}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          🗑️ Clear All Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'users', label: 'Users', count: data.users.length },
          { key: 'products', label: 'Products', count: data.products.length },
          { key: 'carts', label: 'Carts', count: Object.keys(data.carts).length },
          { key: 'purchases', label: 'Purchases', count: Object.keys(data.purchases).length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'carts' && renderCarts()}
        {activeTab === 'purchases' && renderPurchases()}
      </div>

      {/* Storage Info */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Storage Information</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• <strong>Storage Type:</strong> Browser Local Storage</p>
          <p>• <strong>Location:</strong> Your browser's local storage</p>
          <p>• <strong>Persistence:</strong> Data persists between browser sessions</p>
          <p>• <strong>Limitations:</strong> Data is local only, not shared between devices</p>
          <p>• <strong>Backup:</strong> Use "Export Data" button to create backups</p>
        </div>
      </div>
    </div>
  );
}
