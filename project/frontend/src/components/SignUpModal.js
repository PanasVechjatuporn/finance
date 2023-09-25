import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { signInWithGoogle, singInWithFacebook } from '../services/firebase';
import EmailFormTextExample from './email_form_text';
import PasswordFormTextExample from './pw_form_text';

function SignUpModal({ show, setShow }) {
    const handleClose = () => setShow(false);
    const handleSignIn = () => {
        console.log('YOU CLICKED')
    }
    return (
        <Modal show={show} >
            <Modal.Header closeButton onHide={handleClose}>
                <Modal.Title>จ่อย</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <EmailFormTextExample></EmailFormTextExample>
                <PasswordFormTextExample></PasswordFormTextExample>
            </Modal.Body>
                <br></br>
                <Button variant="primary" onClick={signInWithGoogle}>
                    Sign up with Google
                </Button>
                <br></br>
                <Button variant="primary" onClick={singInWithFacebook}>
                    Sign up with Facebook
                </Button>

            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignUpModal;