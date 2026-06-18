import React from "react";
import { Carousel } from "react-bootstrap";
import banner1 from "../../assets/images/banners/slide-lg-1.jpg";
import banner2 from "../../assets/images/banners/slide-lg-2.jpg";
import "./Slider.css"; // optional

const Slider = () => {
  return (
    <Carousel fade interval={3000} pause={false}>
      <Carousel.Item>
        <img
          className="d-block w-100 banner-img"
          src={banner1}
          alt="First slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 banner-img"
          src={banner2}
          alt="Second slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
