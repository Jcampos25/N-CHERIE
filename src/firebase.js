import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5fA_xhoAhtBgGhA44DkoOG4ezRtDZxOA",
  authDomain: "n-cherie.firebaseapp.com",
  projectId: "n-cherie",
  storageBucket: "n-cherie.firebasestorage.app",
  messagingSenderId: "860066090382",
  appId: "1:860066090382:web:ad6588197348fb7c3968df",
  measurementId: "G-MW271S79C4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
