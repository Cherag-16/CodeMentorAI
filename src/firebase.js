// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAi9rvZ_I6X6VMMy3lhP5jzhUHYY56IZ3c",
  authDomain: "microproject-9789a.firebaseapp.com",
  projectId: "microproject-9789a",
  storageBucket: "microproject-9789a.firebasestorage.app",
  messagingSenderId: "298583563155",
  appId: "1:298583563155:web:e3a92d316230931891a666",
  measurementId: "G-FBFM6DX81P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


