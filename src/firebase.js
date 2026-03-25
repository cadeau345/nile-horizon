import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC9_F6Xd6Ebj98AJfI0_r3n8lnNTuOOnWo",
  authDomain: "nile-horizon.firebaseapp.com",
  projectId: "nile-horizon",
  storageBucket: "nile-horizon.firebasestorage.app",
  messagingSenderId: "400045612068",
  appId: "1:400045612068:web:fae00d08fc2b6627804cb1"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);