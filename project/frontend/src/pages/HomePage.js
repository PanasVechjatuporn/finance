import React from "react";
import Navigate from "components/Navbar";
import CarouselInterval from "components/Carousel";
import { Footer } from "components/Footer";
import "./HomePage.css";
export const Home = () => {
  return (
    <React.Fragment>
      <Navigate />
      <div className="container-carousel">
        <CarouselInterval />
      </div>
      <Footer />
    </React.Fragment>
  );
};
