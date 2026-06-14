import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDG7wOkbjIlwe9e1_VMPpsSaXo4opQU8SA",
  authDomain: "carrot-clone-ab7d4.firebaseapp.com",
  projectId: "carrot-clone-ab7d4",
  storageBucket: "carrot-clone-ab7d4.firebasestorage.app",
  messagingSenderId: "1025327222384",
  appId: "1:1025327222384:web:7a6b952d69251768b52eb5",
  measurementId: "G-EBPF5EEVFY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
