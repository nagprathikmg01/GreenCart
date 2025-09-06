// Firebase-based storage utilities for production data persistence
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile 
} from 'firebase/auth';
import { db, auth } from '../firebase/config';

export const firebaseStorage = {
  // Users management
  getUsers: async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  getUser: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  addUser: async (userData) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...userData };
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  updateUser: async (userId, updates) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return await firebaseStorage.getUser(userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Products management
  getProducts: async () => {
    try {
      const productsSnapshot = await getDocs(
        query(collection(db, 'products'), orderBy('createdAt', 'desc'))
      );
      return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getProduct: async (productId) => {
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      return productDoc.exists() ? { id: productDoc.id, ...productDoc.data() } : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  addProduct: async (productData) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...productData };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (productId, updates) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return await firebaseStorage.getProduct(productId);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  getProductsBySeller: async (sellerId) => {
    try {
      const productsSnapshot = await getDocs(
        query(
          collection(db, 'products'), 
          where('sellerId', '==', sellerId),
          orderBy('createdAt', 'desc')
        )
      );
      return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching seller products:', error);
      return [];
    }
  },

  // Cart management
  getCart: async (userId) => {
    try {
      const cartSnapshot = await getDocs(
        query(collection(db, 'carts'), where('userId', '==', userId))
      );
      return cartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching cart:', error);
      return [];
    }
  },

  addToCart: async (userId, productId) => {
    try {
      // Check if item already exists in cart
      const existingCartSnapshot = await getDocs(
        query(
          collection(db, 'carts'), 
          where('userId', '==', userId),
          where('productId', '==', productId)
        )
      );

      if (!existingCartSnapshot.empty) {
        // Update quantity if item exists
        const existingItem = existingCartSnapshot.docs[0];
        await updateDoc(doc(db, 'carts', existingItem.id), {
          quantity: existingItem.data().quantity + 1,
          updatedAt: serverTimestamp()
        });
      } else {
        // Add new item to cart
        await addDoc(collection(db, 'carts'), {
          userId,
          productId,
          quantity: 1,
          addedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      return await firebaseStorage.getCart(userId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  removeFromCart: async (cartItemId) => {
    try {
      await deleteDoc(doc(db, 'carts', cartItemId));
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  clearCart: async (userId) => {
    try {
      const cartSnapshot = await getDocs(
        query(collection(db, 'carts'), where('userId', '==', userId))
      );
      
      const deletePromises = cartSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      return [];
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Purchases management
  getPurchases: async (userId) => {
    try {
      const purchasesSnapshot = await getDocs(
        query(
          collection(db, 'purchases'), 
          where('userId', '==', userId),
          orderBy('purchaseDate', 'desc')
        )
      );
      return purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching purchases:', error);
      return [];
    }
  },

  addPurchase: async (userId, purchaseData) => {
    try {
      const docRef = await addDoc(collection(db, 'purchases'), {
        ...purchaseData,
        userId,
        purchaseDate: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...purchaseData };
    } catch (error) {
      console.error('Error adding purchase:', error);
      throw error;
    }
  },

  // Authentication
  createUser: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.username
      });

      // Save user data to Firestore
      await firebaseStorage.addUser({
        uid: user.uid,
        email: user.email,
        username: userData.username,
        profileImage: null,
        location: userData.location || '',
        bio: userData.bio || '',
        sustainabilityScore: 0,
        sustainabilityLevel: 'Beginner',
        totalItemsPurchased: 0
      });

      return { user };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  signInUser: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  signOutUser: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  // Initialize demo data (optional)
  initializeDemoData: async () => {
    try {
      // Check if demo data already exists
      const productsSnapshot = await getDocs(collection(db, 'products'));
      if (!productsSnapshot.empty) {
        console.log('Demo data already exists');
        return;
      }

      // Add demo products
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
          soldAt: null
        }
      ];

      for (const product of demoProducts) {
        await firebaseStorage.addProduct(product);
      }

      console.log('Demo data initialized successfully');
    } catch (error) {
      console.error('Error initializing demo data:', error);
    }
  }
};
