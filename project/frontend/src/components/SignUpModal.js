import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { signInWithGoogle } from '../services/firebase';

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
                <Button variant="primary" onClick={signInWithGoogle}>
                    Some Button for Google Sign-in I guess?
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SignUpModal;