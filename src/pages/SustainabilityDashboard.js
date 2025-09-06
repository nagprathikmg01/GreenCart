import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import { calculateLifetimeSustainability, getSustainabilityTips } from '../utils/sustainability';

export default function SustainabilityDashboard() {
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchSustainabilityData = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      
      // Get user's sustainability data
      const userSustainability = storage.getUserSustainability(currentUser.uid);
      
      // Get all purchases for detailed analysis
      const userPurchases = storage.getPurchases(currentUser.uid);
      
      // Calculate lifetime sustainability
      const lifetimeData = calculateLifetimeSustainability(userPurchases);
      
      setSustainabilityData({
        ...userSustainability,
        ...lifetimeData
      });
      
      setPurchases(userPurchases);
    } catch (error) {
      console.error('Error fetching sustainability data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchSustainabilityData();
  }, [fetchSustainabilityData]);

  // Removed unused getLevelColor function

  const getLevelIcon = (level) => {
    const icons = {
      'Beginner': '🌱',
      'Green Starter': '🌿',
      'Eco Enthusiast': '♻️',
      'Sustainability Hero': '🦸‍♀️',
      'Green Warrior': '⚔️',
      'Eco Champion': '👑'
    };
    return icons[level] || icons['Beginner'];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!sustainabilityData) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🌱</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No sustainability data found</h3>
        <p className="text-gray-500">Start shopping to build your sustainability impact!</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sustainability Dashboard</h1>
        <p className="text-gray-600">Track your environmental impact and sustainability journey</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Contribution */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Contribution</p>
              <p className="text-3xl font-bold">{sustainabilityData.totalContribution}%</p>
            </div>
            <div className="text-4xl">🌍</div>
          </div>
        </div>

        {/* Current Level */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Sustainability Level</p>
              <p className="text-xl font-bold">{sustainabilityData.level}</p>
            </div>
            <div className="text-4xl">{getLevelIcon(sustainabilityData.level)}</div>
          </div>
        </div>

        {/* Items Purchased */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Items Purchased</p>
              <p className="text-3xl font-bold">{sustainabilityData.totalItems}</p>
            </div>
            <div className="text-4xl">🛍️</div>
          </div>
        </div>

        {/* Average Impact */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg. Impact per Item</p>
              <p className="text-3xl font-bold">{sustainabilityData.averageContribution}%</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Progress to Next Level */}
      {sustainabilityData.nextLevel > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress to Next Level</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current: {sustainabilityData.level}</span>
            <span className="text-sm font-medium text-gray-700">
              Next: {sustainabilityData.level === 'Green Starter' ? 'Eco Enthusiast' : 
                     sustainabilityData.level === 'Eco Enthusiast' ? 'Sustainability Hero' :
                     sustainabilityData.level === 'Sustainability Hero' ? 'Green Warrior' :
                     sustainabilityData.level === 'Green Warrior' ? 'Eco Champion' : 'Max Level'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${sustainabilityData.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {sustainabilityData.nextLevel - sustainabilityData.totalContribution}% more to reach the next level!
          </p>
        </div>
      )}

      {/* Recent Purchases Impact */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sustainability Impact</h2>
        {purchases.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No purchases yet. Start shopping to make a difference!</p>
        ) : (
          <div className="space-y-4">
            {purchases.slice(0, 5).map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">🌱</div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {purchase.products?.length || 0} item(s) purchased
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    +{purchase.sustainabilityContribution || 0}%
                  </p>
                  <p className="text-sm text-gray-500">sustainability</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sustainability Tips */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips to Increase Your Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getSustainabilityTips(sustainabilityData.level).map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
              </div>
              <p className="text-sm text-green-800">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact by Category</h2>
        <div className="space-y-3">
          {['Electronics', 'Furniture', 'Clothing', 'Home & Garden', 'Sports & Outdoors', 'Books & Media', 'Toys & Games'].map((category) => {
            const categoryPurchases = purchases.flatMap(p => 
              p.products?.filter(prod => prod.category === category) || []
            );
            const categoryImpact = categoryPurchases.reduce((sum, product) => {
              // Calculate impact based on category weight
              const weights = {
                'Electronics': 25,
                'Furniture': 20,
                'Clothing': 15,
                'Home & Garden': 12,
                'Sports & Outdoors': 10,
                'Books & Media': 8,
                'Toys & Games': 6
              };
              return sum + (weights[category] || 5);
            }, 0);

            if (categoryImpact === 0) return null;

            return (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{categoryPurchases.length} items</span>
                  <span className="font-semibold text-green-600">+{categoryImpact}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white">
          <span className="mr-2">{getLevelIcon(sustainabilityData.level)}</span>
          {sustainabilityData.level} Badge
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Keep up the great work! Every purchase makes a difference.
        </p>
      </div>
    </div>
  );
}
