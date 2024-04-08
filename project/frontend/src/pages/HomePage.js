import React from "react";
import Navigate from "components/Navbar";
import CarouselInterval from "components/Carousel";
import { Footer } from "components/Footer";
export const Home = () => {
  return (
    <React.Fragment>
      <Navigate />
      <CarouselInterval />
      <Footer/>
    </React.Fragment>
  );
};
