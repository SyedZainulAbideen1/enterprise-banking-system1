import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJheaH3fg661F3nqVu1a42sij0YFg5sCw",
  authDomain: "enterprise-banking-syste-976dd.firebaseapp.com",
  projectId: "enterprise-banking-syste-976dd",
  storageBucket: "enterprise-banking-syste-976dd.firebasestorage.app",
  messagingSenderId: "676423646904",
  appId: "1:676423646904:web:6fe562305be536f9707e4d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;