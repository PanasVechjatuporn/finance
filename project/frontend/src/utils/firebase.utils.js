import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDixzflSDSCAz9jCla3dXNYTR0r4ewMmKc",
  authDomain: "finance-eabe6.firebaseapp.com",
  projectId: "finance-eabe6",
  storageBucket: "finance-eabe6.appspot.com",
  messagingSenderId: "1040583487952",
  appId: "1:1040583487952:web:bdda5660346eeaef1489d5",
  measurementId: "G-KGHBCZPFR4"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({   
    prompt : "select_account "
});
export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
