import React from "react";
import Navigate from "components/Navbar";
import CarouselInterval from "components/Carousel";
export const Home = () => {
  return (
    <React.Fragment>
      <Navigate />
      <CarouselInterval />
    </React.Fragment>
  );
};
