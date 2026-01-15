// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your NEW Firebase configuration (aura-1d75b project)
const firebaseConfig = {
  apiKey: "AIzaSyA7Rfv2crvSYOTTklS9bmXeVW-h8rWYQNQ",
  authDomain: "aura-1d75b.firebaseapp.com",
  projectId: "aura-1d75b",
  storageBucket: "aura-1d75b.firebasestorage.app", // Updated storage bucket
  messagingSenderId: "684246778322",
  appId: "1:684246778322:web:adcfc31a226132b5c5480b",
  measurementId: "G-LZFZ30FQS0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional - remove if not needed)
const analytics = getAnalytics(app);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export all services you need
export { app, auth, db, storage, analytics };