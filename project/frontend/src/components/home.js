import React from "react";
import auth from "services/firebase";

function home({ user }) {
  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <img src={user.photoURL} alt="profile image"></img>
      <button onClick={() => auth.signOut}>Sign out</button>
    </div>
  );
}

export default home;
