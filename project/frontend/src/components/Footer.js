import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import "./Footer.css";

export const Footer = () => {
  return (
    <Navbar
      sticky="bottom"
      style={{
        background: "#2E3B55",
        minHeight: "100px",
        position: "static",
        width: "100%",
      }}
    >
      <Container>
        <div class="container">
          <div style={{display : "flex"}}>
            <div class="footer-col">
              <h4>company</h4>
              <ul>
                <li>
                  <a href="#">about us</a>
                </li>
                <li>
                  <a href="#">our services</a>
                </li>
                <li>
                  <a href="#">privacy policy</a>
                </li>
                <li>
                  <a href="#">affiliate program</a>
                </li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>get help</h4>
              <ul>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">shipping</a>
                </li>
                <li>
                  <a href="#">returns</a>
                </li>
                <li>
                  <a href="#">order status</a>
                </li>
                <li>
                  <a href="#">payment options</a>
                </li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>online shop</h4>
              <ul>
                <li>
                  <a href="#">watch</a>
                </li>
                <li>
                  <a href="#">bag</a>
                </li>
                <li>
                  <a href="#">shoes</a>
                </li>
                <li>
                  <a href="#">dress</a>
                </li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>follow us</h4>
              <div class="social-links">
                <a href="">
                  <FacebookIcon/>
                </a>
                <a href="">
                  <InstagramIcon/>
                </a>
                <a href="">
                  <GitHubIcon/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};
