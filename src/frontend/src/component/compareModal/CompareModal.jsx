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

const CompareModal = ({ visible, onClose, currentProduct }) => {
    const dispatch = useDispatch();
    const compareItems = useSelector(selectCompareItems);
    const [secondProduct, setSecondProduct] = useState(null);
    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    // Check if current product is in compareItems
    const isCurrentInCompare = compareItems.some(
        (item) => item.productId.toString() === currentProduct?.productId.toString()
    );

    // Add current product to compareItems silently when modal opens
    useEffect(() => {
        if (visible && currentProduct && !isCurrentInCompare) {
            dispatch(addToCompare({ ...currentProduct, productId: currentProduct.productId.toString() }));
        }
    }, [visible, currentProduct, isCurrentInCompare, dispatch]);

    // Fetch all products when modal opens
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

    // Handle adding a second product to compare with toast
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
                toast.success('Đã thêm sản phẩm để so sánh!');
            }
        }
    };

    // Reset second product to allow adding another
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

    // Fields to compare
    const compareFields = [
        { key: 'productName', label: 'Tên sản phẩm' },
        { key: 'productDesc', label: 'Mô tả' },
        { key: 'sellPrice', label: 'Giá bán', render: (value) => (value ? `${value.toLocaleString()} VNĐ` : 'N/A') },
        { key: 'totalRating', label: 'Đánh giá', render: (value) => (value ? `${value}/5` : 'Chưa có đánh giá') },
        { key: 'ingredient', label: 'Thành phần' },
    ];

    // Helper function to get the product image
    const getProductImage = (product) => {
        if (product.images && product.images.length > 0) {
            return typeof product.images[0] === 'string' ? product.images[0] : product.images[0].prodImageUrl;
        }
        if (product.productImages && product.productImages.length > 0) {
            return typeof product.productImages[0] === 'string' ? product.productImages[0] : product.productImages[0].prodImageUrl;
        }
        if (product.imageUrl) return product.imageUrl;
        return 'https://via.placeholder.com/200';
    };

    // Custom render for dropdown options with image
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

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SwapOutlined style={{ fontSize: '20px', marginRight: '10px', color: '#D8959A' }} />
                    <span>So sánh sản phẩm</span>
                </div>
            }>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <p style={{ marginTop: 20 }}>Đang tải dữ liệu...</p>
                </div>
            ) : (
                <div className="compare-content" style={{ width: '100%' }}>
                    <Row gutter={32}>
                        {/* Left Column: Current Product */}
                        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                            <Card
                                className="compare-card"
                                title={currentProduct?.productName}
                                cover={
                                    <Image
                                        alt={currentProduct?.productName}
                                        src={getProductImage(currentProduct)}
                                        style={{ height: 200, objectFit: 'cover', width: '100%' }}
                                    />
                                }
                                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ flex: 1 }}>
                                    {compareFields.map((field) => (
                                        <div key={field.key} style={{ marginBottom: '10px' }}>
                                            <Text strong>{field.label}: </Text>
                                            <Text>
                                                {field.render
                                                    ? field.render(currentProduct?.[field.key])
                                                    : currentProduct?.[field.key] || 'N/A'}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Col>

                        {/* Right Column: Second Product or Selection */}
                        <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                            {secondProduct ? (
                                <Card
                                    className="compare-card"
                                    title={secondProduct.productName}
                                    cover={
                                        <Image
                                            alt={secondProduct.productName}
                                            src={getProductImage(secondProduct)}
                                            style={{ height: 200, objectFit: 'cover', width: '100%' }}
                                        />
                                    }
                                    extra={
                                        <Button type="link" onClick={handleChangeProduct} style={{ color: '#D8959A' }}>
                                            Thay đổi
                                        </Button>
                                    }
                                    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ flex: 1 }}>
                                        {compareFields.map((field) => (
                                            <div key={field.key} style={{ marginBottom: '10px' }}>
                                                <Text strong>{field.label}: </Text>
                                                <Text>
                                                    {field.render
                                                        ? field.render(secondProduct[field.key])
                                                        : secondProduct[field.key] || 'N/A'}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', width: '100%' }}>
                                    <Title level={4}>Thêm sản phẩm để so sánh</Title>
                                    <Select
                                        showSearch
                                        placeholder="Tìm và chọn sản phẩm"
                                        style={{ width: '100%', marginBottom: '10px' }}
                                        onChange={(value) => setSelectedProductId(value)}
                                        value={selectedProductId}
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().includes(input.toLowerCase())
                                        } // Filter by label (productName)
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
                                        style={{ backgroundColor: '#D8959A', borderColor: '#D8959A', width: '100%' }}>
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
};

export default CompareModal;