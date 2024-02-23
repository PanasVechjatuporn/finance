import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EmailFormTextExample from "components/email_form_text";
import PasswordFormTextExample from "components/pw_form_text";
import GoogleButton from "react-google-button";
import FacebookLogin from "react-facebook-login";
import "components/SignUpModal.css";
function SignUpModal({ show, setShow }) {
  const handleClose = () => setShow(false);
  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EmailFormTextExample></EmailFormTextExample>
        <PasswordFormTextExample></PasswordFormTextExample>
      </Modal.Body>
      <br></br>
      <div className="btn-wrapper">
        <GoogleButton  />
      </div>
      <br></br>
      <div className="btn-wrapper">
        <FacebookLogin
        ></FacebookLogin>
      </div>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignUpModal;
