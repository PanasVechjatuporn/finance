import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCDvIfFJP1DelX6OEyvqZk1le3-f9UbN84",
    authDomain: "finance-made-easy-2024.firebaseapp.com",
    projectId: "finance-made-easy-2024",
    storageBucket: "finance-made-easy-2024.appspot.com",
    messagingSenderId: "8437734811",
    appId: "1:8437734811:web:cbd580abf4cf5a77b7153e",
    measurementId: "G-F1ZHRF5CN1"
  }

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
