import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpvK_5tiNeOV4idMWRXzj-xrQJ6OU5kVQ",
  authDomain: "securitycode-ef59d.firebaseapp.com",
  projectId: "securitycode-ef59d",
  storageBucket: "securitycode-ef59d.appspot.com",
  messagingSenderId: "881285800447",
  appId: "1:881285800447:web:d8201bd932c658cf9647ca",
  measurementId: "G-N8TDWNX1X0",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); //  Экземпляр хранилища Firestore
const auth = getAuth(app); // Аутентификация в Firebase

export { db, auth };
