import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CardEvent from '../cardEvent/CardEvent';
import event3 from '../../assets/event3.png';
const EventProductsCarousel = () => {
    const products = [
        {
            imageSrc: 'event3',
            productName: 'DermProtect Barrier Defense',
            price: '1.800.000vnd'
        },
        {
            imageSrc: 'event3',
            productName: 'DermProtect Another Product',
            price: '2.500.000vnd'
        },
        {
            imageSrc: 'event3',
            productName: 'DermProtect Defense Sample',
            price: '3.200.000vnd'
        },
        {
            imageSrc: 'event3',
            productName: 'DermProtect Barrier Defense',
            price: '1.800.000vnd'
        },
        {
            imageSrc: 'event3',
            productName: 'DermProtect Another Product',
            price: '2.500.000vnd'
        },
        {
            imageSrc: 'event3',
            productName: 'DermProtect Defense Sample',
            price: '3.200.000vnd'
        },
    ];

    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={0}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            modules={[Navigation]}
            style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
        >
            {products.map((product, index) => (
                <SwiperSlide key={index}>
                    <CardEvent
                        imageSrc={event3}
                        productName={product.productName}
                        price={product.price}
                    />
                </SwiperSlide>
            ))}

            {/* Navigation buttons */}
            <div className="swiper-button-prev" style={{ color: '#000' }}></div>
            <div className="swiper-button-next" style={{ color: '#000' }}></div>
        </Swiper>
    );
};

export default EventProductsCarousel;
