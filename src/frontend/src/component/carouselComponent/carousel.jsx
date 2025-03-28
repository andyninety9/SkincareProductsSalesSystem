/* eslint-disable react/prop-types */
import React from 'react';
import { Carousel } from 'antd';
import './carousel.scss';

const CarouselAntd = ({ img1, img2, img3, img4 }) => {
    return (
        <>
            <Carousel>
                <div>
                    <img src={img1} alt="" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                    <img src={img2} alt="" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                    <img src={img3} alt="" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                    <img src={img4} alt="" style={{ objectFit: 'cover' }} />
                </div>
            </Carousel>
        </>
    );
};
export default CarouselAntd;
