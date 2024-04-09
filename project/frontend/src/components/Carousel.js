import Carousel from "react-bootstrap/Carousel";
import "components/Carousel.css";

function CarouselInterval() {
  return (
    <div className="container">
      <Carousel data-bs-theme="dark">
        <Carousel.Item className="slide-item">
          <div className="image-item">
            <img src="/landing/1.process.png" className="image"></img>
          </div>
          {/* <ExampleCarouselImage text="First slide" /> */}
        </Carousel.Item>
        <Carousel.Item className="slide-item">
          <div className="image-item">
            <img src="/landing/2.process.png" className="image"></img>
          </div>
          {/* <ExampleCarouselImage text="Second slide" /> */}
        </Carousel.Item>
        <Carousel.Item className="slide-item">
          <div className="image-item">
            <img src="/landing/3.process.png" className="image"></img>
          </div>
          {/* <ExampleCarouselImage text="Third slide" /> */}
        </Carousel.Item>
        <Carousel.Item className="slide-item">
          <div className="image-item">
            <img src="/landing/4.process.png" className="image"></img>
          </div>
          {/* <ExampleCarouselImage text="Third slide" /> */}
        </Carousel.Item>
        <Carousel.Item className="slide-item">
          <div className="image-item">
            <img src="/landing/5.process.png" className="image"></img>
          </div>
          {/* <ExampleCarouselImage text="Third slide" /> */}
        </Carousel.Item>
        <Carousel.Item className="slide-item">
          <div className="image-item">
            <img src="/landing/6.process.png" className="image"></img>
          </div>
          {/* <ExampleCarouselImage text="Third slide" /> */}
        </Carousel.Item>
        <Carousel.Item className="slide-item">
            <img src="/landing/7.process.png" className="image"></img>
          {/* <ExampleCarouselImage text="Third slide" /> */}
        </Carousel.Item>
        <Carousel.Item className="slide-item">
            <img src="/landing/8.process.png" className="image"></img>
          {/* <ExampleCarouselImage text="Third slide" /> */}
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default CarouselInterval;
