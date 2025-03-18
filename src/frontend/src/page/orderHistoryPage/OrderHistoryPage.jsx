import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { routes } from '../../routes';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Skeleton, Card, Typography, Image, Tag } from 'antd';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import api from '../../config/api'; // Using the configured api with interceptors
import { toast } from 'react-hot-toast';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

// Status mapping with icons and colors
const statusConfig = {
    Pending: { icon: <ClockCircleOutlined />, color: 'default' },
    Processing: { icon: <SyncOutlined spin />, color: '#E6B2BA' },
    Shipping: { icon: <SyncOutlined />, color: 'blue' },
    Shipped: { icon: <CheckCircleOutlined />, color: 'cyan' },
    Completed: { icon: <CheckCircleOutlined />, color: '#D8959A' },
    Cancelled: { icon: <CloseCircleOutlined />, color: 'error' },
};

// Utility function to convert to BigInt string
const toBigIntString = (value) => {
    try {
        return value != null ? BigInt(value).toString() : "N/A";
    } catch (error) {
        console.error(`Error converting to BigInt: ${value}`, error.message);
        return "N/A";
    }
};

// Utility function to format date to mm-dd-yy
const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits of year
    return `${month}-${day}-${year}`;
};

// ErrorBoundary component with PropTypes validation
const ErrorBoundaryFallback = ({ error }) => {
    ErrorBoundaryFallback.propTypes = {
        error: PropTypes.shape({
            message: PropTypes.string, // Validate that error can have a message
        }),
    };

    return (
        <Container style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', marginTop: '80px' }}>
            <Card
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    minHeight: 300,
                    width: '100%',
                    padding: '16px',
                }}
            >
                <Text type="danger">
                    {error?.message || 'An unexpected error occurred. Please try again later.'}
                </Text>
                <Button type="primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
                    Refresh Page
                </Button>
            </Card>
        </Container>
    );
};

const OrderHistoryPage = () => {
    const { orderId } = useParams(); // Extract orderId from URL parameter
    const navigate = useNavigate();
    const error = useRouteError(); // Capture errors for React Router ErrorBoundary
    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null); // Track fetch-specific errors

    const fetchOrderDetails = async (orderId) => {
        try {
            if (!orderId || orderId === "N/A") {
                throw new Error('Invalid Order ID.');
            }

            const bigIntOrderId = toBigIntString(orderId); // Convert orderId to BigInt string for request
            console.log(`Fetching order details for orderId: ${bigIntOrderId} at endpoint: orders/user/${bigIntOrderId}`);
            const response = await api.get(`orders/user/${bigIntOrderId}`);
            console.log('API Response:', response);
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                setOrder({
                    orderId: toBigIntString(response.data.data.orderId),
                    orderDate: response.data.data.orderDate,
                    orderStatus: response.data.data.orderStatus,
                    totalPrice: response.data.data.totalPrice,
                    products: response.data.data.products || [],
                    rewardPoints: response.data.data.rewardPoints || 300, // Assuming rewardPoints from API
                    payment: response.data.data.payment || {}, // Add payment details
                    shippingAddress: response.data.data.shippingAddress || {}, // Add shipping address
                });
                // Fetch product details using the first product's ID
                if (response.data.data.products && response.data.data.products.length > 0) {
                    fetchProductDetails(response.data.data.products[0].productId);
                }
                setFetchError(null);
            } else if (response?.data?.status === 400 && response?.data?.type === "NotFound") {
                console.warn('Order not found:', orderId);
                setOrder(null);
                setFetchError('Order not found.');
            } else {
                console.warn('Unexpected API response:', response);
                setOrder(null);
                setFetchError(`Failed to load order details. Status: ${response?.data?.status}`);
            }
        } catch (error) {
            console.error('Error fetching order details:', error.response || error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                navigate(routes.login);
            } else if (error.response?.status === 403) {
                setFetchError('Access denied. Please check your role or permissions.');
            } else {
                setOrder(null);
                setFetchError(`Error fetching order: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetails = async (productId) => {
        try {
            const Id = toBigIntString(productId);
            console.log(`Fetching product details for productId: ${Id} at endpoint: products/${Id}`);
            const response = await api.get(`products/${Id}`);
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                setProduct(response.data.data);
            } else {
                console.warn('Product not found or unexpected response:', response);
                setProduct(null);
            }
        } catch (error) {
            console.error('Error fetching product details:', error.response || error);
            setProduct(null);
        }
    };

    useEffect(() => {
        fetchOrderDetails(orderId);
    }, [orderId]);

    // Handle errors thrown during rendering or data fetching
    if (isRouteErrorResponse(error)) {
        return <ErrorBoundaryFallback error={error} />;
    }

    // Determine the effective price (use discountedPrice if available and greater than 0, otherwise use sellPrice)
    const effectivePrice = product
        ? product.discountedPrice > 0
            ? product.discountedPrice
            : product.sellPrice
        : 0;

    // Calculate total price based on effective price and quantity
    const calculatedTotal = order && order.products && order.products.length > 0 && product
        ? effectivePrice * order.products[0].quantity
        : 0;

    // Dynamic delivery status message based on orderStatus
    const getDeliveryStatus = (status) => {
        switch (status) {
            case 'Shipped':
            case 'Completed':
                return 'Đã giao hàng';
            case 'Processing':
            case 'Shipping':
                return 'Đang xử lý';
            case 'Pending':
                return 'Chờ xử lý';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return 'Trạng thái không xác định';
        }
    };

    return (
        <Container style={{ marginTop: '80px', padding: '24px', maxWidth: '1200px' }}>
            <Row>
                <Col>
                    <Card
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            minHeight: '300px',
                            padding: '16px',
                        }}
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : fetchError ? (
                            <Text type="danger">{fetchError}</Text>
                        ) : order && product ? (
                            <>
                                {/* Header */}
                                <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text type="secondary">
                                            Đơn hàng #{order.orderId} - {formatDate(order.orderDate)}
                                        </Text>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <Text type="success">{getDeliveryStatus(order.orderStatus)}</Text>
                                        <Tag
                                            icon={statusConfig[order.orderStatus]?.icon}
                                            color={statusConfig[order.orderStatus]?.color || 'default'}
                                            style={{
                                                borderRadius: 5,
                                                height: '30px',
                                                width: '100px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '12px',
                                                padding: '0 8px',
                                            }}
                                        >
                                            {order.orderStatus}
                                        </Tag>
                                    </div>
                                </div>

                                {/* Product Section */}
                                <div className="product-section" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <Image
                                        src={product.images?.[0] || 'https://via.placeholder.com/100'}
                                        alt={product.productName || 'Product Image'}
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${product.images?.[0]}`);
                                            e.target.src = 'https://via.placeholder.com/100';
                                        }}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <Text>
                                            ({product.productName})
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Phân loại hàng: {product.productDesc}
                                        </Text>
                                        <Text style={{ marginTop: '8px' }}>
                                            x{order.products[0].quantity}
                                        </Text>
                                        <div style={{ marginTop: '8px' }}>
                                            {product.discountedPrice > 0 && (
                                                <Text delete style={{ marginRight: '8px' }}>
                                                    đ{product.sellPrice.toLocaleString()}
                                                </Text>
                                            )}
                                            <Text type="danger" strong>
                                                đ{effectivePrice.toLocaleString()}
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Payment Section */}
                                <div className="payment-section" style={{ marginTop: '16px' }}>
                                    <Text strong style={{ fontSize: '16px' }}>
                                        Thông tin thanh toán
                                    </Text>
                                    <div style={{ marginTop: '8px' }}>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            Phương thức thanh toán: {order.payment?.paymentMethod || 'Không xác định'}
                                        </Text>
                                    </div>
                                    <div style={{ marginTop: '4px' }}>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            Số tiền thanh toán: đ{order.payment?.paymentAmount?.toLocaleString() || 'N/A'}
                                        </Text>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="address-section" style={{ marginTop: '16px' }}>
                                    <Text strong style={{ fontSize: '16px' }}>
                                        Địa chỉ giao hàng
                                    </Text>
                                    <div style={{ marginTop: '8px' }}>
                                        <Text type="secondary" style={{ fontSize: '14px' }}>
                                            {order.shippingAddress?.detail || 'Địa chỉ không được cung cấp.'}
                                        </Text>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Footer */}
                                <div className="order-footer" style={{ textAlign: 'right' }}>
                                    <Text type="danger" strong style={{ fontSize: '18px' }}>
                                        Thành tiền: đ{order.totalPrice.toLocaleString()}
                                    </Text>
                                    <div style={{ marginTop: '16px' }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Đặt hàng ngày: {formatDate(order.orderDate)}
                                        </Text>
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Đánh giá để nhận {order.rewardPoints || 300} Xu
                                        </Text>
                                    </div>
                                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <Button type="primary" danger>
                                            Đánh Giá
                                        </Button>
                                        <Button>Liên Hệ Người Bán</Button>
                                        <Button>Mua Lại</Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Text>Không có đơn hàng nào.</Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderHistoryPage;