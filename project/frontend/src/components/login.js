import React from "react";
import { signInWithGoogle } from "services/firebase";

function login() {
  return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

export default login;
