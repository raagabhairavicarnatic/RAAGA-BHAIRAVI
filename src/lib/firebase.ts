import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA-mock-key-for-prerendering-purposes',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock-app.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-app-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock-app.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:1234567890123456789012',
};

// Initialize Firebase (SSR Safe)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Helper to determine admin rights based on email addresses
export const getAdminEmails = (): string[] => {
  const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
  return envEmails.split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
};

export const isAdminUser = (email: string | null | undefined): boolean => {
  if (!email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
};

export { app, auth, db, storage, googleProvider };
