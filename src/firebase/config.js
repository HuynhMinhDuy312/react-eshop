import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: "eshop-ecomapp.firebaseapp.com",
    projectId: "eshop-ecomapp",
    storageBucket: "eshop-ecomapp.appspot.com",
    messagingSenderId: "559720917877",
    appId: "1:559720917877:web:e7f749c93490294c61013c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
