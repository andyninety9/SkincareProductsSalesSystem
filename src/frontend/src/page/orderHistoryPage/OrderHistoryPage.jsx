import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { routes } from '../../routes';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Skeleton, Card, Typography, Image, Steps, Popover } from 'antd';
import PropTypes from 'prop-types';
import api from '../../config/api';
import { toast } from 'react-hot-toast';
import '../../component/manageOrderSteps/ManageOrderSteps.css';

const { Text } = Typography;
const statusSteps = [
    { title: 'Chờ xử lý', description: 'Đơn hàng đang chờ xác nhận' }, // Pending
    { title: 'Đang xử lý', description: 'Đơn hàng đang được chuẩn bị' }, // Processing
    { title: 'Đang vận chuyển', description: 'Đơn hàng đang trên đường giao' }, // Shipping
    { title: 'Đã vận chuyển', description: 'Đơn hàng đã được vận chuyển' }, // Shipped
    { title: 'Hoàn thành', description: 'Đơn hàng đã được giao' }, // Completed
    { title: 'Đã hủy', description: 'Đơn hàng đã bị hủy' }, // Cancelled
];

// Convert to BigInt string
const toBigIntString = (value) => {
    try {
        return value != null ? BigInt(value).toString() : 'N/A';
    } catch (error) {
        console.error(`Error converting to BigInt: ${value}`, error.message);
        return 'N/A';
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}-${day}-${year}`;
};

const getNumericStatus = (status) => {
    const statusMap = {
        Pending: 0,
        Processing: 1,
        Shipping: 2,
        Shipped: 3,
        Completed: 4,
        Cancelled: 5,
    };
    return typeof status === 'string' ? (statusMap[status] || 0) : (Number.isNaN(status) ? 0 : status);
};

const customDot = (dot, { status, index, currentStep }) => (
    <Popover
        content={
            <span style={{ color: index <= currentStep ? '#C87E83' : undefined }}>
                Step {index + 1} status: {status}
            </span>
        }
    >
        {dot}
    </Popover>
);

const ErrorBoundaryFallback = ({ error }) => {
    ErrorBoundaryFallback.propTypes = {
        error: PropTypes.shape({
            message: PropTypes.string,
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
                <Text style={{ color: '#D8959A' }}>
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
    const { orderId } = useParams();
    const navigate = useNavigate();
    const error = useRouteError();
    const [order, setOrder] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null)

    const fetchOrderDetails = async (orderId) => {
        try {
            if (!orderId || orderId === 'N/A') {
                throw new Error('Invalid Order ID.');
            }

            const bigIntOrderId = toBigIntString(orderId);
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
                    payment: response.data.data.payment || {},
                });
                if (response.data.data.products && response.data.data.products.length > 0) {
                    fetchProductDetails(response.data.data.products[0].productId);
                }
                setFetchError(null);
            } else if (response?.data?.status === 400 && response?.data?.type === 'NotFound') {
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


    if (isRouteErrorResponse(error)) {
        return <ErrorBoundaryFallback error={error} />;
    }
    const effectivePrice = product
        ? product.discountedPrice > 0
            ? product.discountedPrice
            : product.sellPrice
        : 0;

    const calculatedTotal = order && order.products && order.products.length > 0 && product
        ? effectivePrice * order.products[0].quantity
        : 0;

    const currentStep = getNumericStatus(order?.orderStatus);

    return (
        <Container style={{ marginTop: '80px', padding: '24px', maxWidth: '1200px', marginBottom: '80px', overflow: 'hidden' }}>
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
                            <Text style={{ color: '#D8959A' }}>{fetchError}</Text>
                        ) : order && product ? (
                            <>
                                {/* Header */}
                                <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Text type="secondary">
                                            Đơn hàng #{order.orderId}
                                        </Text>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Steps */}
                                <div className="manage-order-steps" style={{ marginTop: '16px', marginBottom: '40px' }}>
                                    <Steps
                                        current={currentStep}
                                        progressDot={(dot, props) => customDot(dot, { ...props, currentStep })}
                                        items={statusSteps}
                                        disabled={true}
                                    />
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Product */}
                                <div className="product-section" style={{
                                    marginTop: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}>
                                    <Image
                                        src={product.images?.[0] || 'https://via.placeholder.com/100'}
                                        alt={product.productName || 'Product Image'}
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${product.images?.[0]}`);
                                            e.target.src = 'https://via.placeholder.com/100';
                                        }}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        flex: 1,
                                        height: '100px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text>{product.productName}</Text>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: '12px',
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                                whiteSpace: 'normal',
                                                maxWidth: '100%',
                                                display: 'block',
                                            }}
                                        >
                                            {product.productDesc}
                                        </Text>


                                        <Text>x{order.products[0].quantity}</Text>
                                        <div>
                                            {product.discountedPrice > 0 && (
                                                <Text delete style={{ marginRight: '8px' }}>
                                                    đ{product.sellPrice.toLocaleString()}
                                                </Text>
                                            )}
                                            <Text style={{ color: '#D8959A', fontWeight: 'bold' }}>
                                                đ{effectivePrice.toLocaleString()}
                                            </Text>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Payment */}
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

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Footer */}
                                <div className="order-footer" style={{ textAlign: 'right' }}>
                                    <Text style={{ color: '#D8959A', fontWeight: 'bold', fontSize: '18px' }}>
                                        Thành tiền: đ{order.totalPrice.toLocaleString()}
                                    </Text>
                                    <div style={{ marginTop: '16px' }}>
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Ngày đặt hàng: {formatDate(order.orderDate)}
                                        </Text>
                                    </div>
                                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <Button
                                            type="primary"
                                            style={{ backgroundColor: '#D8959A', borderColor: '#D8959A' }}
                                        >
                                            Đánh Giá
                                        </Button>
                                        <Button>Mua Lại</Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderHistoryPage;