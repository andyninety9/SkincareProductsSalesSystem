import React from "react";
import { Carousel } from "antd";
import "./carousel.scss";

const CarouselAntd = ({ img1, img2, img3, img4 }) => {
  return (
    <>
      <Carousel>
        <div>
          <img src={img1} alt="" />
        </div>
        <div>
          <img src={img2} alt="" />
        </div>
        <div>
          <img src={img3} alt="" />
        </div>
        <div>
          <img src={img4} alt="" />
        </div>
      </Carousel>
    </>
  );
};
export default CarouselAntd;
