import './card.scss';
import { Rate, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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

    // 🔥 Chuyển từ `id` → `productId`
    const productId = product?.productId;

    // 🔥 Hàm định dạng số theo VND
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // 🔥 Xử lý khi bấm vào card
    const handleClick = () => {
        // console.log('🛠 Debug product:', product);

        if (!productId) {
            // console.error('❌ Không tìm thấy ID sản phẩm!');
            return;
        }

        // console.log('✅ Navigating to:', `/product/${productId}`);
        navigate(`/product/${productId}`);
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

            <button className="buy-now-btn">
                Thêm vào giỏ hàng
            </button>
        </div>
    );
}
