/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import CardEvent from '../cardEvent/CardEvent';
import event3 from '../../assets/event3.png';
import amuse from '../../assets/amuse.png';
import api from '../../config/api';
import { Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const EventProductsCarousel = ({ event }) => {
    const [products, setProducts] = useState([]);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetProductDetail = async (productId) => {
        try {
            // Truyền productId dưới dạng chuỗi khi gọi API
            const response = await api.get(`products/${productId.toString()}`);
            const processedItems = {
                ...response.data.data,
                productId: response.data.data.productId
                    ? response.data.data.productId.toString()
                    : response.data.data.productId,
            };
            console.log('processedItems:', processedItems);

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
            const eventId = event.eventId.toString(); // eventId truyền lên API dưới dạng chuỗi
            const response = await api.get(`events/${eventId}`);

            const eventDetails = response.data.data.eventDetails || [];
            setProducts(eventDetails);

            // Extract product IDs from event details and ensure they are BigInt
            const productIds = eventDetails.map((item) => BigInt(item.productId));

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

    // 🔥 Format currency similar to CardProduct
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // 🔥 Handle card click similar to CardProduct
    const handleCardClick = (productId) => {
        if (!productId) {
            return;
        }
        navigate(`/product/${productId.toString()}`); // Truyền productId dưới dạng chuỗi
    };

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
                productDetails.map((product, index) => (
                    <SwiperSlide key={product.productId || index}
                    style={{
                        width: 'calc(25% - 30px)',  // Đảm bảo chiều rộng của mỗi card
                        height: '480px',             // Tăng chiều cao của card
                        margin: '10px',              // Thêm margin giữa các card
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',   
                    }}
                    >
                        {/* <CardEvent
                            imageSrc={product.images?.[0] || event3}
                            productName={product.productName}
                            price={product.price}
                        /> */}

                        <div
                            className="cardProduct"
                            onClick={() => handleCardClick(product.productId)}
                            style={{ cursor: 'pointer', userSelect: 'none', position: 'relative' }}>
                            {product?.stocks === 0 && (
                                <Tag color="red" style={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold' }}>
                                    Sold Out
                                </Tag>
                            )}
                            <img
                                // src={product?.productImages?.length > 0 ? product.images[0].prodImageUrl : amuse}
                                src={product?.images && product.images[0] ? product.images[0] : amuse}
                                alt={product?.productName || 'Product'}
                            />
                            <div className="cardProduct-content">
                                <div className="cardProduct-content-left">
                                    <Rate value={product?.totalRating || 0} disabled className="cardProduct-content-left-rate" />
                                    <p
                                        style={{
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                        }}>
                                        {product?.productName || 'No name'}
                                    </p>
                                    <p
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}>
                                        {product?.productDesc || 'No description'}
                                    </p>
                                </div>
                                <div className="cardProduct-content-right">
                                    {product?.discountedPrice ? (
                                        <>
                                            <div>
                                                <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>
                                                    Discounted Price:
                                                </span>
                                                <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                                    {formatCurrency(product.discountedPrice)}
                                                </span>
                                            </div>
                                            <div>
                                                <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>
                                                    Listed Price:
                                                </span>
                                                <span style={{ textDecoration: 'line-through', fontSize: '14px', color: '#888' }}>
                                                    {formatCurrency(product.sellPrice)}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div>
                                            <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>Listed Price:</span>
                                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                                {product?.sellPrice ? formatCurrency(product.sellPrice) : 'Contact for price'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
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
