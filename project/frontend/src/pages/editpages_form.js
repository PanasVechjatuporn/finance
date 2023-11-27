import React, { useState } from "react";
import Navigate from "components/Navbar";
import Button from "react-bootstrap/Button";
import "pages/editpages_form.css";
export const EditFormPage = () => {
  return (
    <React.Fragment>
      <div className="header">
        <Navigate />
      </div>
      <div className="content">
        <>
          <Button variant="primary">Primary</Button>{" "}
          <Button variant="secondary">Secondary</Button>{" "}
          <Button variant="success">Success</Button>{" "}
          <Button variant="warning">Warning</Button>{" "}
          <Button variant="danger">Danger</Button>{" "}
          <Button variant="info">Info</Button>{" "}
          <Button variant="light">Light</Button>{" "}
          <Button variant="dark">Dark</Button>
          <Button variant="link">Link</Button>
        </>
      </div>
    </React.Fragment>
  );
};
export default EditFormPage;
