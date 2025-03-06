import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { Avatar, Empty, Input, List, Spin } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './liveSearchProduct.css';

// eslint-disable-next-line react/prop-types
export default function LiveSearchProduct({ onClose, autoFocus }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setSearchResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        const debounceTimer = setTimeout(() => {
            performSearch(searchTerm);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const performSearch = async (term) => {
        try {
            const response = await api.get(`products?keyword=${encodeURIComponent(term)}`);
            setSearchResults(response.data.data.items);
        } catch (error) {
            console.error('Error searching products:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        onClose();
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };
    return (
        // Trong hàm return của LiveSearchProduct.jsx
        <div className="live-search-container">
            <div className="search-header">
                <Input
                    placeholder="Tìm kiếm sản phẩm..."
                    prefix={<SearchOutlined style={{ color: '#D8959A' }} />}
                    suffix={<CloseOutlined onClick={onClose} style={{ cursor: 'pointer', color: '#888' }} />}
                    value={searchTerm}
                    onChange={handleInputChange}
                    size="large"
                    autoFocus={autoFocus}
                    className="search-input"
                />
            </div>

            <div className="search-results">
                {loading ? (
                    <div className="search-loading">
                        <Spin size="default" />
                    </div>
                ) : (
                    <>
                        {searchTerm && searchTerm.length >= 2 && (
                            <>
                                {searchResults.length > 0 ? (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={searchResults}
                                        renderItem={(item) => (
                                            <List.Item
                                                className="search-result-item"
                                                style={{ padding: '8px 16px' }}
                                                onClick={() => handleProductClick(item.productId)}>
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            src={
                                                                item?.images?.length > 0
                                                                    ? item.images[0].prodImageUrl
                                                                    : 'https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg'
                                                            }
                                                            shape="square"
                                                            size={54}
                                                        />
                                                    }
                                                    title={item.productName}
                                                    description={`${item.sellPrice.toLocaleString('vi-VN')}₫`}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Empty description="Không tìm thấy sản phẩm nào" className="search-empty" />
                                )}

                                {searchResults.length > 5 && (
                                    <div className="view-all-results">
                                        <button
                                            onClick={() => {
                                                navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                                                onClose();
                                            }}
                                            className="view-all-btn">
                                            Xem tất cả kết quả
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
