import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import SignUpModal from './SignUpModal';

import { Link } from 'react-router-dom';

function Navigate() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" fixed="top">
      <Container>
        <Navbar.Brand href="#home">Finance made easy</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#manual">Manual</Nav.Link>
            <NavDropdown title="More" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                temp1
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                temp2
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                temp2
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                More help
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#sign_up"><>
              <Button variant="primary" onClick={handleShow}>
                Sign Up
              </Button>
              <SignUpModal show={show} setShow={setShow}/>
            </></Nav.Link>
            <Nav.Link eventKey={2} href="sign_in">
              <Button variant="outline-dark" onClick={handleShow}>
                  Sign In
              </Button>
              <SignUpModal show={show} setShow={setShow}/>

            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigate;