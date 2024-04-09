import Carousel from "react-bootstrap/Carousel";
import "components/Carousel.css";

function CarouselInterval() {
  return (
    <Carousel slide={false}>
      <Carousel.Item className="slide-item">
        <div className="image-item">
          <h1>How to use</h1>
          <img src="/test_image.png"></img>
        </div>
        {/* <ExampleCarouselImage text="First slide" /> */}
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className="slide-item">
        <div className="image-item">
          <h1>Services</h1>
          <img src="/test_image.png"></img>
        </div>
        {/* <ExampleCarouselImage text="Second slide" /> */}
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item className="slide-item">
        <div className="image-item">
          <h1>About us</h1>
          <img src="/test_image.png"></img>
        </div>
        {/* <ExampleCarouselImage text="Third slide" /> */}
        <Carousel.Caption></Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselInterval;
