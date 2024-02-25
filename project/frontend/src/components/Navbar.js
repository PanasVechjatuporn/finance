import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import SignUpModal from "components/SignUpModal";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "store/UserSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function Navigate() {
  const userStore = useSelector(state => state.userStore)
  const dispatch = useDispatch()
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const handleCloseSignUp = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);
  const handleCloseSignIn = () => setShowSignIn(false);
  const handleShowSignIn = () => setShowSignIn(true);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: '#2E3B55' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand href="/">Finance made easy</Navbar.Brand>
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand href="/">Features</Navbar.Brand>
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand href="/Dashboard">Dashboard</Navbar.Brand>
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand href="/Goal-Based">Goal-Based</Navbar.Brand>
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 0.1, display: { xs: "none", sm: "block" } }}
          >
            <Navbar.Brand href="/">About Us</Navbar.Brand>
          </Typography>
          <Typography
            variant="h8"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          {userStore.isLogIn ? (
            <>
              <Button variant="primary" onClick={() => {
                dispatch(Logout())
                localStorage.removeItem("userData");
              }}>Logout
              </Button>
              <Typography>{userStore.userName}</Typography>
            </>
          ) : (<Nav>
            <Nav.Link href="#sign_up">
              <>
                <Button variant="primary" onClick={handleShowSignUp}>
                  Sign Up
                </Button>
                <SignUpModal show={showSignUp} setShow={setShowSignUp} mode="signup" />
              </>
            </Nav.Link>
            <Nav.Link eventKey={2} href="#sign_in">
              <Button variant="secondary" onClick={handleShowSignIn}>
                Sign In
              </Button>
              <SignUpModal show={showSignIn} setShow={setShowSignIn} mode="signin" />
            </Nav.Link>
          </Nav>)}
        </Toolbar>
      </AppBar>
    </Box>
    // <Box sx={{ flexGrow: 1 }}>
    //   <Navbar
    //     collapseOnSelect
    //     expand="lg"
    //     className="bg-body-tertiary"
    //     bg="light"
    //     fixed="top"
    //   >
    //     <Container>
    //       <Navbar.Brand href="/">Finance made easy</Navbar.Brand>
    //       <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    //       <Navbar.Collapse id="responsive-navbar-nav">
    //         <Nav className="me-auto">
    //           <Nav.Link href="#features">Features</Nav.Link>
    //           <Nav.Link href="#manual">Manual</Nav.Link>
    //           <Nav.Link>
    //             <Link to="/Dashboard">Dashboard</Link>
    //           </Nav.Link>
    //           <NavDropdown title="More" id="collasible-nav-dropdown">
    //             <NavDropdown.Item href="#action/3.1">temp1</NavDropdown.Item>
    //             <NavDropdown.Item href="#action/3.2">temp2</NavDropdown.Item>
    //             <NavDropdown.Item href="#action/3.3">temp2</NavDropdown.Item>
    //             <NavDropdown.Divider />
    //             <NavDropdown.Item href="#action/3.4">More help</NavDropdown.Item>
    //           </NavDropdown>
    //         </Nav>
    //         <Nav>
    //           <Nav.Link href="#sign_up">
    //             <>
    //               <Button variant="primary" onClick={handleShow}>
    //                 Sign Up
    //               </Button>
    //               <SignUpModal show={show} setShow={setShow} />
    //             </>
    //           </Nav.Link>
    //           <Nav.Link eventKey={2} href="#sign_in">
    //             <Button variant="outline-dark" onClick={handleShow}>
    //               Sign In
    //             </Button>
    //             <SignUpModal show={show} setShow={setShow} />
    //           </Nav.Link>
    //         </Nav>
    //       </Navbar.Collapse>
    //     </Container>
    //   </Navbar>
    // </Box>
  );
}

export default Navigate;
