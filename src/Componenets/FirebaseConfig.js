import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBbiJcntT6CPD67OOIcpB72Fb9qv2VcZK8",
  authDomain: "survey-report-446a7.firebaseapp.com",
  projectId: "survey-report-446a7",
  storageBucket: "survey-report-446a7.appspot.com",
  messagingSenderId: "82755411404",
  appId: "1:82755411404:web:5a10edb716cf489f065169",
  measurementId: "G-XPVE4KB28W",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage(app);
