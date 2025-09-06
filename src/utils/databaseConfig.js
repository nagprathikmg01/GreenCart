// Database configuration - switch between local storage, Firebase, and MongoDB
import { storage } from './storage';
import { firebaseStorage } from './firebaseStorage';
import { mongoStorage } from './mongoStorage';

// Set this to 'local', 'firebase', or 'mongodb' to switch database types
const DATABASE_TYPE = 'local'; // Using local storage for now (MongoDB needs server-side setup)

export const database = DATABASE_TYPE === 'firebase' ? firebaseStorage : 
                       DATABASE_TYPE === 'mongodb' ? mongoStorage : storage;

// Helper function to check if using Firebase
export const isUsingFirebase = () => DATABASE_TYPE === 'firebase';

// Helper function to check if using MongoDB
export const isUsingMongoDB = () => DATABASE_TYPE === 'mongodb';

// Helper function to get database type
export const getDatabaseType = () => DATABASE_TYPE;
