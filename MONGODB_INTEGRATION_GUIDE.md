# MongoDB Integration Guide for GreenCart

## 🚨 Important: MongoDB Cannot Be Used Directly in React Frontend

The MongoDB driver is designed for **Node.js server environments**, not browser environments. It requires Node.js modules like `fs`, `net`, `crypto`, etc., which are not available in browsers.

## 🔧 Current Solution

**Your app is now running with Local Storage** - all data is stored in the browser's localStorage and persists between sessions.

## 🚀 How to Use MongoDB (Proper Way)

### Option 1: Create a Backend API (Recommended)

1. **Create a separate Node.js/Express backend:**
   ```bash
   mkdir greencart-backend
   cd greencart-backend
   npm init -y
   npm install express mongodb cors dotenv
   ```

2. **Create API endpoints:**
   ```javascript
   // server.js
   const express = require('express');
   const { MongoClient } = require('mongodb');
   const cors = require('cors');
   
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   // MongoDB connection
   const MONGODB_URI = 'your-mongodb-connection-string';
   const client = new MongoClient(MONGODB_URI);
   
   // API routes
   app.get('/api/products', async (req, res) => {
     // Fetch products from MongoDB
   });
   
   app.post('/api/products', async (req, res) => {
     // Add product to MongoDB
   });
   
   // ... more routes
   ```

3. **Update frontend to call API:**
   ```javascript
   // Instead of direct MongoDB calls
   const products = await fetch('/api/products').then(res => res.json());
   ```

### Option 2: Use Firebase (Easier)

1. **Set up Firebase project**
2. **Change databaseConfig.js:**
   ```javascript
   const DATABASE_TYPE = 'firebase';
   ```
3. **Add Firebase config in .env:**
   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   # ... other Firebase config
   ```

## 📊 Current Data Storage

**Your app currently uses Local Storage:**
- ✅ **Users:** Stored in `localStorage.ecofinds_users`
- ✅ **Products:** Stored in `localStorage.ecofinds_products`
- ✅ **Cart:** Stored in `localStorage.ecofinds_cart_[userId]`
- ✅ **Purchases:** Stored in `localStorage.ecofinds_purchases_[userId]`

## 🔄 Switching Database Types

Edit `src/utils/databaseConfig.js`:

```javascript
// For Local Storage (current)
const DATABASE_TYPE = 'local';

// For Firebase (when configured)
const DATABASE_TYPE = 'firebase';

// For MongoDB (requires backend API)
const DATABASE_TYPE = 'mongodb';
```

## 🎯 Your MongoDB Connection String

**Keep this safe for when you create the backend:**
```
mongodb+srv://tanushreechintu2005_db_user:K3ZvTZCdb5bGeXwy@greencart.mrb0bck.mongodb.net/GreenCartDB?retryWrites=true&w=majority
```

## ✅ Current Status

- ✅ **App is running:** http://localhost:3000
- ✅ **No errors:** All MongoDB compatibility issues resolved
- ✅ **Data persists:** Using local storage
- ✅ **All features work:** Cart, checkout, sustainability tracking

**Your GreenCart app is fully functional with local storage!** 🚀
