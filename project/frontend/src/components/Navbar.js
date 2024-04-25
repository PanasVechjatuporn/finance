import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import SignUpModal from "components/SignUpModal";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "store/UserSlice";


function Navigate() {
  const userStore = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showNotLoggedIn, setShowNotLoggedIn] = useState(false);
  const handleShowSignUp = () => setShowSignUp(true);
  const handleShowSignIn = () => setShowSignIn(true);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#2E3B55" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand href="/">TaxSmart</Navbar.Brand>
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand
              href={"/Dashboard"}
              onClick={(e) => {
                if (!userStore.isLogIn) {
                  setShowNotLoggedIn(true);
                  e.preventDefault();
                }
              }}
            >
              Dashboard
            </Navbar.Brand>
            <SignUpModal
              show={showNotLoggedIn}
              setShow={setShowNotLoggedIn}
              mode="notloggedin"
            />
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand
              href={"/tax-calculation"}
              onClick={(e) => {
                if (!userStore.isLogIn) {
                  setShowNotLoggedIn(true);
                  e.preventDefault();
                }
              }}
            >
              Tax Calculation
            </Navbar.Brand>
            <SignUpModal
              show={showNotLoggedIn}
              setShow={setShowNotLoggedIn}
              mode="notloggedin"
            />
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand
              href={"/Goal-Based"}
              onClick={(e) => {
                if (!userStore.isLogIn) {
                  setShowNotLoggedIn(true);
                  e.preventDefault();
                }
              }}
            >
              Goal-Based
            </Navbar.Brand>
            <SignUpModal
              show={showNotLoggedIn}
              setShow={setShowNotLoggedIn}
              mode="notloggedin"
            />
          </Typography>
          
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          ></Typography>
          {userStore.isLogIn ? (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  dispatch(Logout());
                  localStorage.removeItem("userData");
                }}
              >
                Logout
              </Button>
              <Typography>{userStore.userName}</Typography>
            </>
          ) : (
            <Nav>
              <Nav.Link>
                <>
                  <Button variant="primary" onClick={handleShowSignUp}>
                    Sign Up
                  </Button>
                  <SignUpModal
                    show={showSignUp}
                    setShow={setShowSignUp}
                    mode="signup"
                  />
                </>
              </Nav.Link>
              <Nav.Link eventKey={2} href="#sign_in">
                <Button variant="secondary" onClick={handleShowSignIn}>
                  Sign In
                </Button>
                <SignUpModal
                  show={showSignIn}
                  setShow={setShowSignIn}
                  mode="signin"
                />
              </Nav.Link>
            </Nav>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navigate;
