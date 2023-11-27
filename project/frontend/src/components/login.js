import React from "react";
import { signInWithGoogle } from "services/firebase";

function login() {
  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default login;
