import React from "react";
import SignUpModal from "../components/SignUpModal";
import Button from "react-bootstrap/Button";

export const Login = () => {
  return (
    <React.Fragment>
      <Button variant="primary" onClick={handleShowSignUp}>
        Sign Up
      </Button>
      <SignUpModal show={showSignUp} setShow={setShowSignUp} mode="signup" />
    </React.Fragment>
  );
};
