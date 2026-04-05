// ============================================================
//  firebase-config.js  —  Shared Firebase initialization
//  STEP 1: Replace the firebaseConfig object below with YOUR
//          project's config from Firebase Console →
//          Project Settings → Your apps → SDK setup
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbmsZumnAa-3xevs6EOZn6uWr3ZaHIYEo",
  authDomain: "lost-found-1-5d89b.firebaseapp.com",
  projectId: "lost-found-1-5d89b",
  storageBucket: "lost-found-1-5d89b.firebasestorage.app",
  messagingSenderId: "395703950360",
  appId: "1:395703950360:web:9a77274e64d35eaa82f76d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);