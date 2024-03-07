import Button from "react-bootstrap/Button";
import React, { useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Input from '@mui/joy/Input';
import GoogleButton from "react-google-button";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import "components/SignUpModal.css";
import { signInWithGooglePopup } from "../utils/firebase.utils";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { Login, LoginEmailPassword } from '../store/UserSlice';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
const baseURL = "http://localhost:8000";

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
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setisLoading] = React.useState(false);
  const SignInWithGoogle = async () => {
    setisLoading(true)
    await signInWithGooglePopup().then(response => {
      axios.post(`${baseURL}/db/createuser_provider=google`, {
        userData: response
      }).then(response => {
        const userData = response.data.userData;
        dispatch(Login(userData))
        const storeObj = {
          'userName': userData.email,
          'userId': userData.uid,
          'isLogIn': true,
          'userToken': userData.stsTokenManager.accessToken
        }
        localStorage.setItem('userData', JSON.stringify(storeObj))
        setisLoading(false)
        handleClose()
      }).catch(error => {
        console.log(error)
        setisLoading(false)
      })
    }).catch(error => {
      setisLoading(false)
      console.log(error)
    });
  }
  function register() {
    setisLoading(true)
    axios.post(`${baseURL}/auth/signup`, {
      email: email,
      password: password,
      displayName: userName
    })
      .then((response) => {
        //Prompt popup modal to alert user register successfully
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
    axios.post(`${baseURL}/auth/signin`, {
      email: email,
      password: password
    })
      .then((response) => {
        const userData = response.data.signInData
        dispatch(LoginEmailPassword(userData))
        const storeObj = {
          'userName': userData.email,
          'userId': userData.localId,
          'isLogIn': true,
          'userToken': userData.idToken
        }
        localStorage.setItem('userData', JSON.stringify(storeObj))
        setisLoading(false)
        handleClose()
      })
      .catch(error => {
        setisLoading(false)
        console.log('An Error Occured', error);
      });
  }
  return (
    <Modal show={show} backdrop="static">
      <OverlayLoading isLoading={isLoading} />
      <Modal.Header closeButton onHide={handleClose}>
        <Modal.Title>{mode === 'signup' ? 'Sign Up' : mode === 'signin' ? 'Sign In' : 'Please Sign-in before using our service'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input autoFocus required onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        {
          mode === 'signup' ? (<>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input required onChange={(e) => setUserName(e.target.value)} />
            </FormControl>
          </>) : (<></>)
        }
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
