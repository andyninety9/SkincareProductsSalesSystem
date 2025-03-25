import './card.scss';
import { Button, notification, Rate, Tag } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { addToCart, increaseQuantity, selectCartItems } from '../../redux/feature/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Cookies from 'js-cookie';

const bigIntOrNumberType = PropTypes.oneOfType([
    PropTypes.number,
    function (props, propName, componentName) {
        if (
            props[propName] !== undefined &&
            typeof props[propName] !== 'number' &&
            typeof props[propName] !== 'bigint'
        ) {
            return new Error(
                `Invalid prop '${propName}' of type '${typeof props[
                    propName
                ]}' supplied to '${componentName}', expected 'number' or 'bigint'.`
            );
        }
    },
]);

CardProduct.propTypes = {
    product: PropTypes.shape({
        productId: bigIntOrNumberType,
        images: PropTypes.arrayOf(
            PropTypes.shape({
                prodImageId: bigIntOrNumberType,
                prodImageUrl: PropTypes.string,
            })
        ),
        // ... other properties remain the same
        productName: PropTypes.string,
        productDesc: PropTypes.string,
        sellPrice: PropTypes.number,
        costPrice: PropTypes.number,
        discountedPrice: PropTypes.number,
        stocks: PropTypes.number,
        totalRating: PropTypes.number,
        ingredient: PropTypes.string,
        instruction: PropTypes.string,
        prodUseFor: PropTypes.string,
        brandName: PropTypes.string,
        categoryName: PropTypes.string,
        statusName: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        reviewCount: PropTypes.number,
        totalsold: PropTypes.number,
    }),
};
export default function CardProduct({ product }) {
    const navigate = useNavigate();
    const dispatch = useDispatch(); 
    const cartItems = useSelector(selectCartItems); // Giỏ hàng từ Redux
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
    const userAuth = Cookies.get('user');

    // 🔥 Chuyển từ `id` → `productId`
    const productId = product?.productId;

    // 🔥 Hàm định dạng số theo VND
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleCheckLogin = () => {
        if (!userAuth) {
            notification.error({
                message: 'Chưa đăng nhập!',
                description: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
            });
            navigate('/login');
            return false;
        }
        return true;
    };

    // 🔥 Xử lý khi bấm vào card
    //  const handleClick = (event) => {
    //     // Kiểm tra xem có phải bấm vào nút "Thêm vào giỏ hàng" không
    //     if (
    //         event.target.closest('.buy-now-btn')
    //         event.target.closest('button[type="primary"]')
    //     ) {
    //         return; // Nếu bấm vào nút "Thêm vào giỏ hàng", không làm gì
    //     }

    //     if (!productId) {
    //         return;
    //     }
    //     navigate(`/product/${productId}`);
    // };

    const handleClick = (event) => {
        if (
            event.target.closest('.buy-now-btn') || 
            event.target.closest('.buy-now-immediate')
        ) {
            return; 
        }

        if (!productId) {
            return;
        }
        navigate(`/product/${productId}`);
    };

    const handleAddToCart = () => {
        if (!handleCheckLogin()) return; 


        const productToAdd = {
            ...product,
            productId: product.productId ? product.productId.toString() : product.productId,
            quantity, 
        };


        const existingProduct = cartItems.find(
            (item) => item.productId && product.productId && item.productId.toString() === product.productId.toString()
        );

        if (existingProduct) {

            dispatch(
                increaseQuantity({
                    productId: product.productId.toString(),
                    quantity,
                })
            );
        } else {

            dispatch(addToCart(productToAdd));
        }


        const updatedCartItems = [...cartItems];
        if (!existingProduct) {
            updatedCartItems.push(productToAdd);
        }
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        notification.success({
            message: 'Thêm vào giỏ hàng thành công!',
            description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng.`,
        });
    };

    const handleBuyNow = (event) => {
        event.stopPropagation();
        if (!handleCheckLogin()) return;
    
        const productToAdd = {
            ...product,
            productId: product.productId ? product.productId.toString() : product.productId,
            quantity,
        };
    
        const existingProduct = cartItems.find(
            (item) => item.productId && product.productId && item.productId.toString() === product.productId.toString()
        );
    
        if (existingProduct) {
            dispatch(
                increaseQuantity({
                    productId: product.productId.toString(),
                    quantity,
                })
            );
        } else {
            dispatch(addToCart(productToAdd));
        }
    
        const updatedCartItems = [...cartItems];
        if (!existingProduct) {
            updatedCartItems.push(productToAdd);
        }
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    
        notification.success({
            message: 'Đã thêm vào giỏ hàng!',
            description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng.`,
        });
    
        navigate('/cart');
    };

    return (
        <div
            className="cardProduct"
            onClick={handleClick}
            style={{ cursor: 'pointer', userSelect: 'none', position: 'relative' }}>
            {product?.stocks === 0 && (
                <Tag color="red" style={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold' }}>
                    Sold Out
                </Tag>
            )}
            <img
                src={
                    product?.images?.length > 0
                        ? product.images[0].prodImageUrl
                        : 'https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg'
                }
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
                        {product?.productName || 'Không có tên'}
                    </p>
                    <p
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}>
                        {product?.productDesc || 'Không có mô tả'}
                    </p>
                    
                </div>

                <div className="cardProduct-content-right">
                    {product?.discountedPrice ? (
                        <>
                            <div>
                                <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>
                                    Giá giảm còn:
                                </span>
                                <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                    {formatCurrency(product.discountedPrice)}
                                </span>
                            </div>
                            <div>
                                <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>
                                    Giá niêm yết:
                                </span>
                                <span style={{ textDecoration: 'line-through', fontSize: '14px', color: '#888' }}>
                                    {formatCurrency(product.sellPrice)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div>
                            <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>Giá niêm yết:</span>
                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                {product?.sellPrice ? formatCurrency(product.sellPrice) : 'Liên hệ'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <button className="buy-now-btn" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
            </button>

            <Button className="buy-now-immediate" type="primary" onClick={handleBuyNow}>
                Mua ngay
            </Button>

        </div>
    );
}
