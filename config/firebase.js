import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Firebase - Remplacez par vos propres credentials
const firebaseConfig = {
  apiKey: "AIzaSyD-ViLHOVdirr_zxrUJ-i9dc-P16sEjfhc",
  authDomain: "campus-connect-bdfda.firebaseapp.com",
  projectId: "campus-connect-bdfda",
  storageBucket: "campus-connect-bdfda.firebasestorage.app",
  messagingSenderId: "289600934752",
  appId: "1:289600934752:web:ba8427ade576774eeb8405",
  measurementId: "G-MBPX2SFHKW"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Auth avec persistance AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialiser Firestore
export const db = getFirestore(app);
// Initialiser Storage
export const storage = getStorage(app);

export default app;
