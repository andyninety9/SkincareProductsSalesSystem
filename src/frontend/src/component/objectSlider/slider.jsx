// SwiperSlider.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import "swiper/css";
import "swiper/css/navigation";
import "./slider.scss";
const ObjectSlider = ({
  children,
  slidesPerView,
  spaceBetween,
  navigationClass,
  height,
}) => {
  return (
    <div className="swiper-area">
      <CiCircleChevLeft className={`custom-prev ${navigationClass}`} />
      <Swiper
        style={{ height: height }}
        slidesPerView={slidesPerView}
        spaceBetween={spaceBetween}
        navigation={{
          prevEl: `.custom-prev.${navigationClass}`,
          nextEl: `.custom-next.${navigationClass}`,
        }}
        modules={[Navigation]}
        className="product-slider"
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>{child}</SwiperSlide>
        ))}
      </Swiper>
      <CiCircleChevRight className={`custom-next ${navigationClass}`} />
    </div>
  );
};

export default ObjectSlider;
