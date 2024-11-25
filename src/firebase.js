import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAL3EpnfZk7eEKRHnZGnLQR_NA18dd8C0M",
  authDomain: "rbac-44e84.firebaseapp.com",
  projectId: "rbac-44e84",
  storageBucket: "rbac-44e84.firebasestorage.app",
  messagingSenderId: "377676327854",
  appId: "1:377676327854:web:21c6f8873ddae10d86363f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
