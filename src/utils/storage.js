// Local storage utilities for demo data persistence
export const storage = {
  // Users storage
  getUsers: () => {
    const users = localStorage.getItem('ecofinds_users');
    return users ? JSON.parse(users) : [];
  },
  
  saveUsers: (users) => {
    localStorage.setItem('ecofinds_users', JSON.stringify(users));
  },
  
  addUser: (user) => {
    const users = storage.getUsers();
    users.push(user);
    storage.saveUsers(users);
    return user;
  },
  
  updateUser: (userId, updates) => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.uid === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      storage.saveUsers(users);
      return users[userIndex];
    }
    return null;
  },
  
  getUser: (userId) => {
    const users = storage.getUsers();
    return users.find(u => u.uid === userId) || null;
  },

  // Products storage
  getProducts: () => {
    const products = localStorage.getItem('ecofinds_products');
    return products ? JSON.parse(products) : [];
  },

  getAvailableProducts: () => {
    const products = storage.getProducts();
    return products.filter(product => product.isAvailable === true);
  },
  
  saveProducts: (products) => {
    localStorage.setItem('ecofinds_products', JSON.stringify(products));
  },
  
  addProduct: (product) => {
    const products = storage.getProducts();
    const newProduct = {
      ...product,
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAvailable: true,
      buyerId: null,
      soldAt: null
    };
    products.push(newProduct);
    storage.saveProducts(products);
    return newProduct;
  },
  
  updateProduct: (productId, updates) => {
    const products = storage.getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex] = { 
        ...products[productIndex], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      storage.saveProducts(products);
      return products[productIndex];
    }
    return null;
  },
  
  deleteProduct: (productId) => {
    const products = storage.getProducts();
    const filteredProducts = products.filter(p => p.id !== productId);
    storage.saveProducts(filteredProducts);
    return true;
  },
  
  getProduct: (productId) => {
    const products = storage.getProducts();
    return products.find(p => p.id === productId) || null;
  },
  
  getProductsBySeller: (sellerId) => {
    const products = storage.getProducts();
    return products.filter(p => p.sellerId === sellerId);
  },

  markProductAsSold: (productId, buyerId) => {
    const products = storage.getProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex] = {
        ...products[productIndex],
        isAvailable: false,
        buyerId: buyerId,
        soldAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storage.saveProducts(products);
      return products[productIndex];
    }
    return null;
  },

  // Cart storage
  getCart: (userId) => {
    const cart = localStorage.getItem(`ecofinds_cart_${userId}`);
    return cart ? JSON.parse(cart) : [];
  },
  
  saveCart: (userId, cartItems) => {
    localStorage.setItem(`ecofinds_cart_${userId}`, JSON.stringify(cartItems));
  },
  
  addToCart: (userId, productId) => {
    const cart = storage.getCart(userId);
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        productId,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    storage.saveCart(userId, cart);
    return cart;
  },
  
  removeFromCart: (userId, cartItemId) => {
    const cart = storage.getCart(userId);
    const filteredCart = cart.filter(item => item.id !== cartItemId);
    storage.saveCart(userId, filteredCart);
    return filteredCart;
  },
  
  clearCart: (userId) => {
    storage.saveCart(userId, []);
    return [];
  },

  // Purchases storage
  getPurchases: (userId) => {
    const purchases = localStorage.getItem(`ecofinds_purchases_${userId}`);
    return purchases ? JSON.parse(purchases) : [];
  },
  
  savePurchases: (userId, purchases) => {
    localStorage.setItem(`ecofinds_purchases_${userId}`, JSON.stringify(purchases));
  },
  
  addPurchase: (userId, purchase) => {
    const purchases = storage.getPurchases(userId);
    const newPurchase = {
      ...purchase,
      id: 'purchase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      purchaseDate: new Date().toISOString()
    };
    purchases.push(newPurchase);
    storage.savePurchases(userId, purchases);
    return newPurchase;
  },

  // Sustainability tracking
  updateUserSustainability: (userId, sustainabilityData) => {
    const user = storage.getUser(userId);
    if (user) {
      const updatedUser = {
        ...user,
        sustainabilityScore: sustainabilityData.totalContribution,
        sustainabilityLevel: sustainabilityData.level,
        totalItemsPurchased: sustainabilityData.totalItems,
        lastUpdated: new Date().toISOString()
      };
      storage.updateUser(userId, updatedUser);
      return updatedUser;
    }
    return null;
  },

  getUserSustainability: (userId) => {
    const user = storage.getUser(userId);
    if (user) {
      return {
        sustainabilityScore: user.sustainabilityScore || 0,
        sustainabilityLevel: user.sustainabilityLevel || 'Beginner',
        totalItemsPurchased: user.totalItemsPurchased || 0,
        lastUpdated: user.lastUpdated || null
      };
    }
    return {
      sustainabilityScore: 0,
      sustainabilityLevel: 'Beginner',
      totalItemsPurchased: 0,
      lastUpdated: null
    };
  },

  // Get seller notifications (who bought their products)
  getSellerNotifications: (sellerId) => {
    const purchases = storage.getPurchases();
    const notifications = [];
    
    purchases.forEach(purchase => {
      purchase.products.forEach(product => {
        const productData = storage.getProduct(product.productId);
        if (productData && productData.sellerId === sellerId) {
          notifications.push({
            id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            productId: product.productId,
            productTitle: productData.title,
            buyerName: purchase.shippingAddress.fullName,
            buyerEmail: purchase.shippingAddress.email,
            quantity: product.quantity,
            price: product.price,
            purchaseDate: purchase.purchaseDate,
            sustainabilityContribution: purchase.sustainabilityContribution
          });
        }
      });
    });
    
    return notifications.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
  },

  // Initialize demo data
  initializeDemoData: () => {
    // Initialize demo products if they don't exist
    if (!localStorage.getItem('ecofinds_products')) {
      const demoProducts = [
        {
          id: 'prod_1234567890_xyz789',
          title: 'Vintage Camera',
          description: 'Beautiful vintage camera in excellent condition. Perfect for photography enthusiasts.',
          category: 'Electronics',
          price: 12000,
          imageUrl: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
          sellerId: 'user_1234567890_abc123',
          sellerName: 'Camera Collector',
          condition: 'Excellent',
          location: 'Mumbai, India',
          isAvailable: true,
          buyerId: null,
          soldAt: null,
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z'
        }
      ];
      storage.saveProducts(demoProducts);
    }
  }
};

// Initialize demo data when the module is loaded
storage.initializeDemoData();
