import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyHomeFixPublicClientKey2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'homefix-b0f12.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'homefix-b0f12',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'homefix-b0f12.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:homefix0001'
};

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
