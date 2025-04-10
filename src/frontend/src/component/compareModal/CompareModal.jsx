/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Modal, Typography, Row, Col, Card, Image, Spin, Empty, Select, Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectCompareItems, addToCompare } from '../../redux/feature/compareSlice';
import api from '../../config/api';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

export default function CompareModal({ visible, onClose, currentProduct }) {
    const dispatch = useDispatch();
    const compareItems = useSelector(selectCompareItems);
    const [secondProduct, setSecondProduct] = useState(null);
    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const isCurrentInCompare = compareItems.some(
        (item) => item.productId.toString() === currentProduct?.productId.toString()
    );

    useEffect(() => {
        if (visible && currentProduct && !isCurrentInCompare) {
            dispatch(addToCompare({ ...currentProduct, productId: currentProduct.productId.toString() }));
        }
        if (visible && currentProduct) {
            setLoading(false);
        }
    }, [visible, currentProduct, isCurrentInCompare, dispatch]);

    useEffect(() => {
        if (visible && productsList.length === 0) {
            const fetchProducts = async () => {
                setLoading(true);
                try {
                    const response = await api.get('products');
                    console.log('API Response:', response.data);
                    if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
                        const processedProducts = response.data.data.items.map((product) => ({
                            ...product,
                            productId: product.productId.toString(),
                        }));
                        setProductsList(processedProducts);
                    } else {
                        console.error('response.data.data.items is not an array:', response.data.data);
                        toast.error('Dữ liệu sản phẩm không đúng định dạng.');
                    }
                } catch (error) {
                    toast.error('Không thể tải danh sách sản phẩm.');
                    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [visible]);

    const handleAddToCompare = () => {
        if (!selectedProductId || selectedProductId === currentProduct?.productId.toString()) {
            toast.error('Vui lòng chọn một sản phẩm khác để so sánh.');
            return;
        }
        const productToAdd = productsList.find((p) => p.productId === selectedProductId);
        if (productToAdd) {
            setSecondProduct(productToAdd);
            console.log('Second Product:', productToAdd);
            if (!compareItems.some((item) => item.productId === productToAdd.productId)) {
                dispatch(addToCompare(productToAdd));
            }
        }
    };

    const handleChangeProduct = () => {
        setSecondProduct(null);
        setSelectedProductId(null);
    };

    if (!currentProduct && !loading) {
        return (
            <Modal open={visible} onCancel={onClose} footer={null} width={1000} centered>
                <Empty description="Không có sản phẩm để so sánh" />
            </Modal>
        );
    }

    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            return typeof product.images[0] === 'string' ? product.images[0] : product.images[0].prodImageUrl;
        }
        if (product.productImages && product.productImages.length > 0) {
            return typeof product.productImages[0] === 'string'
                ? product.productImages[0]
                : product.productImages[0].prodImageUrl;
        }
        if (product.imageUrl) return product.imageUrl;
        return 'https://via.placeholder.com/200';
    };

    const renderOption = (product) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image
                src={getProductImage(product)}
                alt={product.productName}
                preview={false}
                style={{ width: 24, height: 24, marginRight: 8, objectFit: 'cover' }}
            />
            <span>{product.productName}</span>
        </div>
    );

    const compareCategories = [
        {
            title: 'Thông tin chung',
            fields: [
                {
                    key: 'brandName',
                    label: 'Thương hiệu',
                    render: (value) => <div style={{ height: '20px' }}>{value || 'N/A'}</div>,
                },
                { key: 'categoryName', label: 'Danh mục' },
            ],
        },
        {
            title: 'Giá & Đánh giá',
            fields: [
                {
                    key: 'sellPrice',
                    label: 'Giá bán',
                    render: (value) => (value ? `${value.toLocaleString()} VNĐ` : 'N/A'),
                    highlight: true,
                },
                {
                    key: 'discountedPrice',
                    label: 'Giá khuyến mãi',
                    render: (value) => (value > 0 ? `${value.toLocaleString()} VNĐ` : 'Không có khuyến mãi'),
                    highlight: true,
                },
                {
                    key: 'totalRating',
                    label: 'Đánh giá',
                    render: (value) => (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {value ? `${value}/5` : 'Chưa có đánh giá'}
                            {value > 0 && (
                                <div style={{ marginLeft: 8, display: 'flex' }}>
                                    {[...Array(Math.floor(value))].map((_, i) => (
                                        <span key={i} style={{ color: '#FFD700', marginRight: 2 }}>
                                            ★
                                        </span>
                                    ))}
                                    {value % 1 > 0 && <span style={{ color: '#FFD700', marginRight: 2 }}>★</span>}
                                </div>
                            )}
                        </div>
                    ),
                },
            ],
        },
        {
            title: 'Chi tiết sản phẩm',
            fields: [
                {
                    key: 'productDesc',
                    label: 'Mô tả',
                    render: (value) => <div style={{ height: '100px' }}>{value || 'N/A'}</div>,
                },
                {
                    key: 'ingredient',
                    label: 'Thành phần',
                    render: (value) => <div style={{ height: '100px' }}>{value || 'N/A'}</div>,
                },
            ],
        },
    ];

    const isDifferent = (key, product1, product2) => {
        if (!product1 || !product2) return false;
        return product1[key] !== product2[key];
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            style={{ height: '650px', overflowY: 'auto', overflowX: 'hidden' }}
            title={
                <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '8px 8px 0 0' }}>
                    <SwapOutlined style={{ fontSize: '24px', marginRight: '12px', color: '#D8959A' }} />
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>So sánh sản phẩm</span>
                </div>
            }
            transitionName=""
        >
            {loading || !currentProduct ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 20, color: '#888' }}>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div style={{ width: '100%' }}>
                    <Row gutter={[48, 16]} style={{ margin: 0 }}>
                        <Col span={12} style={{ display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
                            <Card
                                title={
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        color: '#D8959A',
                                        textAlign: 'center',
                                        height: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {currentProduct?.productName}
                                    </div>
                                }
                                cover={
                                    <div style={{
                                        height: 300,
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        background: '#f9f9f9',
                                        padding: '8px'
                                    }}>
                                        <Image
                                            alt={currentProduct?.productName}
                                            src={getProductImage(currentProduct)}
                                            style={{
                                                height: 290,
                                                objectFit: 'contain',
                                                width: '100%',
                                                borderRadius: '4px'
                                            }}
                                            placeholder={<div style={{ height: 300, background: '#f0f0f0' }} />}
                                        />
                                    </div>
                                }
                                style={{
                                    flex: 1,
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    height: '100%',
                                    margin: '0 4px'
                                }}
                                bodyStyle={{ padding: '16px', height: 'calc(100% - 350px)', overflowY: 'auto' }}
                            >
                                <div style={{ flex: 1 }}>
                                    {compareCategories.map((category) => (
                                        <div key={category.title} style={{ marginBottom: '24px' }}>
                                            <div style={{
                                                padding: '8px',
                                                backgroundColor: '#f5f5f5',
                                                borderRadius: '4px',
                                                marginBottom: '12px',
                                                borderLeft: '4px solid #D8959A',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <Text strong style={{ fontSize: '16px', color: '#333' }}>
                                                    {category.title}
                                                </Text>
                                            </div>
                                            <div style={{ padding: '8px' }}>
                                                {category.fields.map((field) => {
                                                    const isFieldDifferent = isDifferent(field.key, currentProduct, secondProduct);
                                                    const fieldHeight = field.key === 'brandName' ? 40 :
                                                        ['productDesc', 'ingredient'].includes(field.key) ? 120 : 60;

                                                    return (
                                                        <div
                                                            key={field.key}
                                                            style={{
                                                                marginBottom: '8px',
                                                                padding: '8px',
                                                                backgroundColor: isFieldDifferent && field.highlight && secondProduct ? '#fcf8e3' : 'transparent',
                                                                borderRadius: '4px',
                                                                height: `${fieldHeight}px`,
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '5px'
                                                            }}
                                                        >
                                                            <Text
                                                                strong
                                                                style={{
                                                                    fontSize: '14px',
                                                                    color: '#666',
                                                                    width: '130px',
                                                                    flexShrink: 0,
                                                                    textAlign: 'left'
                                                                }}
                                                            >
                                                                {field.label}:
                                                            </Text>
                                                            <div
                                                                style={{
                                                                    fontSize: '14px',
                                                                    color: '#333',
                                                                    flex: 1,
                                                                    textAlign: 'left',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'normal'
                                                                }}
                                                            >
                                                                {field.render
                                                                    ? field.render(currentProduct?.[field.key])
                                                                    : currentProduct?.[field.key] || 'N/A'}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>

                        <Col span={12} style={{ display: 'flex', flexDirection: 'column', padding: '0 8px' }}>
                            {secondProduct ? (
                                <Card
                                    title={
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '18px',
                                            color: '#D8959A',
                                            textAlign: 'center',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {secondProduct?.productName}
                                        </div>
                                    }
                                    cover={
                                        <div style={{
                                            height: 300,
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: '#f9f9f9',
                                            padding: '8px'
                                        }}>
                                            <Image
                                                alt={secondProduct.productName}
                                                src={getProductImage(secondProduct)}
                                                style={{
                                                    height: 290,
                                                    objectFit: 'contain',
                                                    width: '100%',
                                                    borderRadius: '4px'
                                                }}
                                                placeholder={<div style={{ height: 300, background: '#f0f0f0' }} />}
                                            />
                                        </div>
                                    }
                                    extra={
                                        <Button
                                            type="link"
                                            onClick={handleChangeProduct}
                                            style={{
                                                color: '#ffffff',
                                                backgroundColor: '#D8959A',
                                                borderRadius: '4px',
                                                padding: '2px 8px',
                                                position: 'absolute',
                                                right: '10px',
                                                top: '-30px',
                                                zIndex: 1,
                                                fontSize: '12px',
                                                height: 'auto',
                                                minHeight: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                            }}
                                            icon={<SwapOutlined style={{ fontSize: '12px' }} />}
                                        >
                                            Thay đổi
                                        </Button>
                                    }
                                    style={{
                                        flex: 1,
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        height: '100%',
                                        margin: '0 4px',
                                        position: 'relative'
                                    }}
                                    bodyStyle={{ padding: '16px', height: 'calc(100% - 350px)', overflowY: 'auto' }}
                                >
                                    <div style={{ flex: 1 }}>
                                        {compareCategories.map((category) => (
                                            <div key={category.title} style={{ marginBottom: '24px' }}>
                                                <div style={{
                                                    padding: '8px',
                                                    backgroundColor: '#f5f5f5',
                                                    borderRadius: '4px',
                                                    marginBottom: '12px',
                                                    borderLeft: '4px solid #D8959A',
                                                    height: '40px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <Text strong style={{ fontSize: '16px', color: '#333' }}>
                                                        {category.title}
                                                    </Text>
                                                </div>
                                                <div style={{ padding: '8px' }}>
                                                    {category.fields.map((field) => {
                                                        const isFieldDifferent = isDifferent(field.key, currentProduct, secondProduct);
                                                        const fieldHeight = field.key === 'brandName' ? 40 :
                                                            ['productDesc', 'ingredient'].includes(field.key) ? 120 : 60;

                                                        return (
                                                            <div
                                                                key={field.key}
                                                                style={{
                                                                    marginBottom: '8px',
                                                                    padding: '8px',
                                                                    backgroundColor: isFieldDifferent && field.highlight ? '#fcf8e3' : 'transparent',
                                                                    borderRadius: '4px',
                                                                    height: `${fieldHeight}px`,
                                                                    display: 'flex',
                                                                    alignItems: 'flex-start',
                                                                    gap: '10px'
                                                                }}
                                                            >
                                                                <Text
                                                                    strong
                                                                    style={{
                                                                        fontSize: '14px',
                                                                        color: '#666',
                                                                        width: '130px',
                                                                        flexShrink: 0,
                                                                        textAlign: 'left'
                                                                    }}
                                                                >
                                                                    {field.label}:
                                                                </Text>
                                                                <div
                                                                    style={{
                                                                        fontSize: '14px',
                                                                        color: '#333',
                                                                        flex: 1,
                                                                        textAlign: 'left',
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'normal'
                                                                    }}
                                                                >
                                                                    {field.render
                                                                        ? field.render(secondProduct?.[field.key])
                                                                        : secondProduct?.[field.key] || 'N/A'}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ) : (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                    border: '1px dashed #ddd',
                                    borderRadius: '8px',
                                    minHeight: '500px'
                                }}>
                                    <Title level={4}>Thêm sản phẩm để so sánh</Title>
                                    <Select
                                        showSearch
                                        placeholder="Tìm và chọn sản phẩm"
                                        style={{
                                            width: '100%',
                                            marginBottom: '10px',
                                            borderRadius: '4px',
                                            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
                                        }}
                                        onChange={(value) => setSelectedProductId(value)}
                                        value={selectedProductId}
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        }
                                        optionLabelProp="label"
                                    >
                                        {productsList
                                            .filter((p) => p.productId !== currentProduct?.productId.toString())
                                            .map((product) => (
                                                <Option
                                                    key={product.productId}
                                                    value={product.productId}
                                                    label={product.productName}
                                                >
                                                    {renderOption(product)}
                                                </Option>
                                            ))}
                                    </Select>
                                    <Button
                                        type="primary"
                                        onClick={handleAddToCompare}
                                        style={{
                                            backgroundColor: '#D8959A',
                                            borderColor: '#D8959A',
                                            width: '100%',
                                            borderRadius: '4px',
                                            transition: 'background-color 0.3s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = '#C07A80'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = '#D8959A'}
                                    >
                                        Thêm
                                    </Button>
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            )}
        </Modal>
    );
}