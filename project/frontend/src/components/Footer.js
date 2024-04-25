import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./Footer.css";

export const Footer = () => {
  return (
    <Navbar
      sticky="bottom"
      fixed="bottom"
      style={{
        background: "#2e3b55",
        minHeight: "33vh",
        position: "static",
        width: "100%",
        marginTop: "20px",
      }}
    >
      <Container>
        <div className="container">
          <div style={{ display: "flex"}}>
            <div className="footer-col-logo">
            </div>
            <div className="footer-col">
              <h4>Members:</h4>
              <ul>
                <li>Travis Numpa 6322771641</li>
                <li>Gwyn Jaranahut 6322771864</li>
                <li>Panas Vechjatuporn 6322773852</li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="social-links">
              
              </div>
            </div>
          </div>
          <div className="end-of-footer">
            <h5></h5>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};
