import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
//

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ✅ Firestore instead of Realtime DB
export { doc, setDoc, onSnapshot, collection };
