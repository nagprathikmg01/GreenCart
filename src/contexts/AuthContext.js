import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../utils/databaseConfig';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, username) {
    try {
      // Check if user already exists
      const users = database.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = {
        uid: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        username,
        email,
        createdAt: new Date().toISOString(),
        profileImage: null,
        location: '',
        bio: ''
      };
      
      database.addUser(user);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  function login(email, password) {
    return new Promise((resolve, reject) => {
      try {
        const users = database.getUsers();
        const user = users.find(u => u.email === email);
        
        if (user) {
          setCurrentUser(user);
          resolve({ user });
        } else {
          // Create a new user if they don't exist (demo mode)
          const newUser = {
            uid: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            username: email.split('@')[0],
            email,
            createdAt: new Date().toISOString(),
            profileImage: null,
            location: '',
            bio: ''
          };
          
          database.addUser(newUser);
          setCurrentUser(newUser);
          resolve({ user: newUser });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function logout() {
    setCurrentUser(null);
    return Promise.resolve();
  }

  async function updateProfile(updates) {
    if (currentUser) {
      const updatedUser = database.updateUser(currentUser.uid, updates);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        return updatedUser;
      }
    }
    throw new Error('Failed to update profile');
  }

  async function googleSignup(userData) {
    try {
      // Check if user already exists
      const users = database.getUsers();
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        // User exists, just login
        setCurrentUser(existingUser);
        return existingUser;
      }

      // New user, create account
      const user = {
        uid: userData.uid || 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        username: userData.username,
        email: userData.email,
        createdAt: userData.createdAt || new Date().toISOString(),
        profileImage: userData.profileImage,
        location: userData.location || '',
        bio: userData.bio || '',
        sustainabilityScore: userData.sustainabilityScore || 0,
        sustainabilityLevel: userData.sustainabilityLevel || 'Beginner',
        totalItemsPurchased: userData.totalItemsPurchased || 0,
        lastUpdated: userData.lastUpdated || null
      };
      
      database.addUser(user);
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('ecofinds_current_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        localStorage.removeItem('ecofinds_current_user');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save current user to localStorage
    if (currentUser) {
      localStorage.setItem('ecofinds_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ecofinds_current_user');
    }
  }, [currentUser]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateProfile,
    googleSignup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}