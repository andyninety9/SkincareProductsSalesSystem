import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import amuse from '../../assets/amuse.png';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';
import CardProduct from '../../component/cardProduct/card'; // Import CardProduct

const EventProductsCarousel = ({ event }) => {
    const [products, setProducts] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetProductDetail = async (productId) => {
        try {
            const response = await api.get(`products/${productId.toString()}`);
            const processedItems = {
                ...response.data.data,
                productId: response.data.data.productId
                    ? response.data.data.productId.toString()
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

            const productIds = eventDetails.map((item) => BigInt(item.productId));

            const detailsPromises = productIds.map((id) => handleGetProductDetail(id));
            const fetchedDetails = await Promise.all(detailsPromises);
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
            spaceBetween={30}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            modules={[Navigation]}
            style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
            {loading ? (
                <div>Loading products...</div>
            ) : (
                productDetails.map((product) => (
                    <SwiperSlide
                        key={product.productId}
                        style={{
                            width: 'calc(25% - 30px)',
                            height: '480px',
                            margin: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                        }}>
                        <CardProduct product={product} /> 
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
