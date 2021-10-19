import * as React from "react";
import Magnifier from "react-magnifier";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Image } from "t9entries/main/types/main-types";
import "./style";

export const Images: React.SFC<{ images: Array<{ image: Image }> }> = ({ images }) => {
  return (
    <Carousel
      className="imagesList"
      showThumbs={false}
      showStatus={false}
      swipeable={false}
      autoPlay={true}
      stopOnHover={true}
      infiniteLoop={true}
    >
      {images.map((image, i) => (
        <div className="preview" key={`image-${i}`} >
          <Magnifier
            src={image.image.url}
            zoomImgSrc={image.image.url.replace("image/upload/w_1024,c_scale", "image/upload/w_1920,c_scale")}
            mgBorderWidth={5}
            mgTouchOffsetX={0}
          />
        </div>
      ))}
    </Carousel>
  );
};
