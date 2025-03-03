import './card.scss';
import { Rate } from 'antd';

export default function CardProduct({ product }) {
    // 🔥 Hàm định dạng số theo VND
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="cardProduct">
            <img
                src={
                    product?.images && product?.images.length > 0
                        ? product?.images[0].prodImageUrl
                        : 'https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg'
                }
                alt={product?.productName || 'Product'}
            />

            <div className="cardProduct-content">
                <div className="cardProduct-content-left">
                    <Rate defaultValue={3} className="cardProduct-content-left-rate" />
                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{product?.productName}</p>
                    <p>{product?.productDesc}</p>
                </div>

                {/* 🔥 Format `sellPrice` thành số tiền VND */}
                <div className="cardProduct-content-right">
                    {product?.sellPrice ? formatCurrency(product.sellPrice) : 'Liên hệ'}
                </div>
            </div>
        </div>
    );
}
