import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import SignUpModal from './SignUpModal';
function Navigate() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" fixed="top">
      <Container>
        <Navbar.Brand href="#home">Some BS Project LOL</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">XD</Nav.Link>
            <NavDropdown title="DropDownGoesHere" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                GAY
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                R3t@rd
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                I'm Bored
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Help
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets"><>
              <Button variant="primary" onClick={handleShow}>
                Sign Up
              </Button>
              <SignUpModal show={show} setShow={setShow}/>
            </></Nav.Link>
            {/* <Nav.Link eventKey={2} href="#memes">
              Sign In
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigate;