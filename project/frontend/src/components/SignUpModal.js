import Button from "react-bootstrap/Button";
import * as React from 'react';
import Modal from "react-bootstrap/Modal";
import Input from '@mui/joy/Input';
import GoogleButton from "react-google-button";
import FacebookLogin from "react-facebook-login";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import "components/SignUpModal.css";
import { signInWithGooglePopup } from "../utils/firebase.utils";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { Login } from '../store/UserSlice';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const baseURL = "http://localhost:8000/auth";

function OverlayLoading({ isLoading }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
      setOpen(isLoading);
  }, [isLoading]);

  return (
      <div>
          <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
          >
              <CircularProgress color="inherit" />
          </Backdrop>
      </div>
  );
}
function SignUpModal({ show, setShow, mode }) {
  const handleClose = () => setShow(false);
  const dispatch = useDispatch()
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setisLoading] = React.useState(false);
  const SignInWithGoogle = async () => {
    setisLoading(true)
    await signInWithGooglePopup().then(response => {
      let userData = response.user.reloadUserInfo;
      dispatch(Login(userData));
      localStorage.setItem('userData', JSON.stringify(response.user))
      setisLoading(false)
      handleClose()
    }).catch(error => {
      setisLoading(false)
      console.log(error)
    });
  }
  function register() {
    setisLoading(true)
    axios.post(`${baseURL}/signup`, {
      email: email,
      password: password
    })
      .then((response) => {
        dispatch(Login(response.data.userRecord))
        localStorage.setItem('userData', JSON.stringify(response.data.userRecord))
        setisLoading(false)
        handleClose()
      })
      .catch(error => {
        setisLoading(false)
        console.log('An Error Occured', error);
      });
  }
  function signin() {
    setisLoading(true)
    axios.post(`${baseURL}/signin`, {
      email: email,
      password: password
    })
      .then((response) => {
        dispatch(Login(response.data.signInData))
        localStorage.setItem('userData', JSON.stringify(response.data.signInData))
        setisLoading(false)
        handleClose()
      })
      .catch(error => {
        setisLoading(false)
        console.log('An Error Occured', error);
      });
  }
  return (
    <Modal show={show}>
      <OverlayLoading isLoading={isLoading} />
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{mode === 'signup' ? 'Sign Up' : 'Sign In'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input autoFocus required onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input required onChange={(e) => setPassword(e.target.value)} type="password" />
        </FormControl>
      </Modal.Body>
      <br></br>
      <div className="btn-wrapper">
        <GoogleButton onClick={(e) => {
          SignInWithGoogle()
        }} />
      </div>
      <br></br>
      {/* ******** NOTICE WILL BE ADDED LATER JA
      <div className="btn-wrapper">
        <FacebookLogin
        ></FacebookLogin>
      </div> */}
      <Modal.Footer>
        <Button variant="primary" onClick={(e) => {
          try {
            if (mode === 'signup') {
              register()
            } else {
              signin()
            }
          } catch (e) {
            console.log(e)
          }
        }}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignUpModal;
