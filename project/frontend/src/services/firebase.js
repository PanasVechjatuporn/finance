// Import the functions you need from the SDKs you need
//   ref: https://stackoverflow.com/questions/68929593/vue-2-export-default-imported-as-firebase-was-not-found-in-firebase-app
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfH7mSMxgS1_b3vspbBspa0mNcGoCqfH0",
  authDomain: "myfirebase-42f1f.firebaseapp.com",
  projectId: "myfirebase-42f1f",
  storageBucket: "myfirebase-42f1f.appspot.com",
  messagingSenderId: "993997264247",
  appId: "1:993997264247:web:4ce5df4d599735a575bd72",
  measurementId: "G-CT3PWZ58KR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export const auth = firebase.auth();

// Initialize google authentication module
const provider_google = new firebase.auth.GoogleAuthProvider();
provider_google.setCustomParameters({
    prompt: "select_account"
});
export const signInWithGoogle = () => auth.signInWithPopup(provider_google);

// Initialize facebook authentication module
const provider_facebook = new firebase.auth.FacebookAuthProvider();
provider_facebook.setCustomParameters({
  prompt: "select_account"
});
export const singInWithFacebook = () => auth.signInWithPopup(provider_facebook);



export default firebase;