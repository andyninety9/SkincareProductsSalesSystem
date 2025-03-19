/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CardEvent from '../cardEvent/CardEvent';
import event3 from '../../assets/event3.png';
import api from '../../config/api';
const EventProductsCarousel = ({ event }) => {
    const [products, setProducts] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGetProductDetail = async (productId) => {
        try {
            const response = await api.get(`products/${productId}`);
            const processedItems = {
                ...response.data.data,
                productId: response.data.data.productId
                    ? response.data.data.productId.toString() // Convert to string to avoid BigInt issues
                    : response.data.data.productId,
            };
            return processedItems;
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
        }
    };

    const handleGetEventDetail = async () => {
        try {
            if (!event || !event.eventId) return;

            setLoading(true);
            const eventId = event.eventId.toString();
            const response = await api.get(`events/${eventId}`);

            const eventDetails = response.data.data.eventDetails || [];
            setProducts(eventDetails);

            // Extract product IDs from event details
            const productIds = eventDetails.map((item) => item.productId);

            // Fetch details for each product
            const detailsPromises = productIds.map((id) => handleGetProductDetail(id));
            const fetchedDetails = await Promise.all(detailsPromises);

            // Filter out any null results (failed requests)
            const validDetails = fetchedDetails.filter((detail) => detail !== null);
            setProductDetails(validDetails);
        } catch (error) {
            console.error('Error fetching event details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetEventDetail();
    }, [event]);

    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={0}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            modules={[Navigation]}
            style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            {loading ? (
                <div>Loading products...</div>
            ) : (
                productDetails.map((product, index) => (
                    <SwiperSlide key={product.productId || index}>
                        <CardEvent
                            imageSrc={product.images?.[0] || event3}
                            productName={product.productName}
                            price={product.price}
                        />
                    </SwiperSlide>
                ))
            )}

            {/* Navigation buttons */}
            <div className="swiper-button-prev" style={{ color: '#000' }}></div>
            <div className="swiper-button-next" style={{ color: '#000' }}></div>
        </Swiper>
    );
};

export default EventProductsCarousel;
