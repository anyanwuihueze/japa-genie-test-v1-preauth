import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbff5XxNQSKDruCc185eZeNu3qNvmRbDc",
  authDomain: "japa-genie.firebaseapp.com",
  projectId: "japa-genie",
  storageBucket: "japa-genie.firebasestorage.app",
  messagingSenderId: "324851640413",
  appId: "1:324851640413:web:33aa1f4882cf811263c5b4"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
