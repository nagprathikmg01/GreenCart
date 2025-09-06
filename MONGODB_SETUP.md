# MongoDB Atlas Setup Guide for GreenCart

## 🚀 **Quick Setup Steps**

### **Step 1: Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### **Step 2: Get Your Connection String**
1. In your MongoDB Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Select "Node.js" as driver
4. Copy your connection string (it will look like this):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
   ```

### **Step 3: Update Your Environment Variables**
Create a `.env` file in your project root:
```env
REACT_APP_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
```

### **Step 4: Switch to MongoDB Database**
In `src/utils/databaseConfig.js`, change:
```javascript
const DATABASE_TYPE = 'mongodb'; // Change from 'local' to 'mongodb'
```

### **Step 5: Restart Your Application**
```bash
npm start
```

## 🔧 **Database Collections**

Your MongoDB will automatically create these collections:

### **Users Collection**
```javascript
{
  _id: ObjectId,
  uid: "user_1234567890_abc123",
  username: "GreenUser",
  email: "user@example.com",
  profileImage: null,
  location: "Mumbai, India",
  bio: "Eco-friendly shopper",
  sustainabilityScore: 150,
  sustainabilityLevel: "Eco Enthusiast",
  totalItemsPurchased: 5,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### **Products Collection**
```javascript
{
  _id: ObjectId,
  id: "prod_1234567890_xyz789",
  title: "Vintage Camera",
  description: "Beautiful vintage camera...",
  category: "Electronics",
  price: 12000,
  imageUrl: "https://...",
  sellerId: "user_1234567890_abc123",
  sellerName: "Camera Collector",
  condition: "Excellent",
  location: "Mumbai, India",
  isAvailable: true,
  buyerId: null,
  soldAt: null,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### **Carts Collection**
```javascript
{
  _id: ObjectId,
  userId: "user_1234567890_abc123",
  productId: "prod_1234567890_xyz789",
  quantity: 2,
  addedAt: ISODate,
  updatedAt: ISODate
}
```

### **Purchases Collection**
```javascript
{
  _id: ObjectId,
  userId: "user_1234567890_abc123",
  products: [...],
  totalAmount: 24000,
  paymentMethod: "credit_card",
  shippingAddress: {...},
  sustainabilityContribution: 25,
  sustainabilityBreakdown: [...],
  status: "completed",
  purchaseDate: ISODate,
  createdAt: ISODate
}
```

## 🔒 **Security Setup**

### **Network Access**
1. In MongoDB Atlas, go to "Network Access"
2. Add your IP address or use `0.0.0.0/0` for development (NOT recommended for production)

### **Database User**
1. Go to "Database Access"
2. Create a new database user
3. Use this username/password in your connection string

## 📊 **Monitoring**

### **Atlas Dashboard**
- Monitor your database performance
- View query analytics
- Check storage usage
- Monitor connections

### **Free Tier Limits**
- 512 MB storage
- Shared clusters
- 100 connections
- No backup retention

## 🚨 **Important Notes**

1. **Never commit your connection string** to version control
2. **Use environment variables** for sensitive data
3. **Enable authentication** in production
4. **Set up proper indexes** for better performance
5. **Monitor your usage** to avoid exceeding free tier limits

## 🔄 **Switching Between Databases**

### **Local Storage (Current)**
```javascript
const DATABASE_TYPE = 'local';
```

### **MongoDB Atlas**
```javascript
const DATABASE_TYPE = 'mongodb';
```

### **Firebase**
```javascript
const DATABASE_TYPE = 'firebase';
```

## 🆘 **Troubleshooting**

### **Connection Issues**
- Check your connection string
- Verify network access settings
- Ensure database user has proper permissions

### **Performance Issues**
- Add indexes for frequently queried fields
- Monitor slow queries in Atlas dashboard
- Consider upgrading to paid tier for better performance

### **Data Migration**
- Export data from local storage
- Import data to MongoDB using Atlas tools
- Test thoroughly before switching

## 📞 **Support**

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forum](https://community.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)

---

**Ready to switch to MongoDB? Follow the steps above and your GreenCart will be powered by a real database!** 🚀
