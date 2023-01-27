// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBEzv1tcawyq2irN1Iv2Zeldt_XCSxlvNo",
  authDomain: "brik-files.firebaseapp.com",
  projectId: "brik-files",
  storageBucket: "brik-files.appspot.com",
  messagingSenderId: "1091977981291",
  appId: "1:1091977981291:web:0af7a176271d764ea1702e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)