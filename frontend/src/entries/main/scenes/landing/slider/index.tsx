import * as React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Slide } from "t9entries/main/types/main-types";
import "./style";

export const Slider: React.FC<{ slides?: Slide[] }> = ({ slides }) => {
  return (
    <Carousel
      className="rellax slider"
      data-rellax-speed="-7"
      showIndicators={false}
      interval={4000}
      showThumbs={false}
      swipeable={false}
      emulateTouch={false}
      showStatus={false}
      autoPlay={true}
      infiniteLoop={true}
    >
      {slides ?
        slides.map((slide, slideIndex) => (
          <div key={"slide-" + slideIndex}>
            <img className="slide" src={slide.image.url} />
          </div>
        )) :
        <div>
          {/* tslint:disable-next-line: max-line-length */}
          <img className="slide" src="/w/svg/logo.svg" style={{ backgroundSize: "60%" }} />
        </div>
      }
    </Carousel>
  );
};
