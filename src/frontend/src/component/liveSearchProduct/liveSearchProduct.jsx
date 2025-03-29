import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { Avatar, Empty, Input, List, Skeleton } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './liveSearchProduct.css';

// eslint-disable-next-line react/prop-types
export default function LiveSearchProduct({ onClose, autoFocus }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const searchContainerRef = useRef(null);
    
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

    // Add click outside listener
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                onClose();
            }
        }
        
        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

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

    const SearchResultSkeleton = () => (
        <>
            {[1, 2, 3].map((item) => (
                <div key={item} className="search-result-skeleton">
                    <div className="skeleton-item">
                        <Skeleton.Avatar active size={54} shape="square" style={{ marginRight: 16, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <Skeleton.Button
                                active
                                style={{ width: '80%', height: 16, marginBottom: 8 }}
                                size="small"
                                shape="round"
                            />
                            <Skeleton.Button active style={{ width: '40%', height: 14 }} size="small" shape="round" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
    
    return (
        <div className="live-search-container" style={{ width: '100%' }} ref={searchContainerRef}>
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
                    style={{ width: '100%', fontSize: '16px' }}
                />
            </div>

            <div className="search-results" style={{ width: '100%', marginTop: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                {loading ? (
                    <div className="search-loading">
                        <SearchResultSkeleton />
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
                                                style={{ padding: '12px 16px', cursor: 'pointer' }}
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
                                                            size={64}
                                                        />
                                                    }
                                                    title={<span style={{ fontSize: '16px' }}>{item.productName}</span>}
                                                    description={
                                                        <span
                                                            style={{
                                                                fontSize: '14px',
                                                                color: '#D8959A',
                                                                fontWeight: 'bold',
                                                            }}>
                                                            {`${item.sellPrice.toLocaleString('vi-VN')}₫`}
                                                        </span>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                ) : (
                                    <Empty description="Không tìm thấy sản phẩm nào" className="search-empty" />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
