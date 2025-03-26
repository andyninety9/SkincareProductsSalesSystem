import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { routes } from '../../routes';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Skeleton, Card, Typography, Image, Steps, Popover } from 'antd';
import PropTypes from 'prop-types';
import api from '../../config/api';
import { toast } from 'react-hot-toast';
import '../../component/manageOrderSteps/ManageOrderSteps.css';
import ReviewProductModal from './ReviewProductModal';
import ReturnRequestModal from './ReturnRequestModal';
import CancelOrderModal from './CancelOrderModal';

const { Text, Title } = Typography;
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
    return typeof status === 'string' ? statusMap[status] || 0 : Number.isNaN(status) ? 0 : status;
};
const getStatusColor = (status) => {
    const colorMap = {
        Pending: '#faad14', // Warning yellow
        Processing: '#1890ff', // Info blue
        Shipping: '#722ed1', // Purple
        Shipped: '#52c41a', // Success green
        Completed: '#52c41a', // Success green
        Cancelled: '#f5222d', // Error red
    };
    return colorMap[status] || '#d9d9d9';
};

const customDot = (dot, { status, index, currentStep, logs }) => {
    // Find the log entry that corresponds to this step
    const log = logs?.find((log) => log.newStatusOrderId === index + 1);

    return (
        <Popover
            content={
                <div>
                    <p
                        style={{
                            color: index <= currentStep ? '#C87E83' : undefined,
                            marginBottom: '4px',
                        }}>
                        {statusSteps[index].title}
                    </p>
                    {log ? (
                        <>
                            <p style={{ fontSize: '12px', margin: '4px 0' }}>
                                {new Date(log.createdAt).toLocaleString('vi-VN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            {log.note && <p style={{ fontSize: '12px' }}>Ghi chú: {log.note}</p>}
                        </>
                    ) : index <= currentStep ? (
                        <p style={{ fontSize: '12px', color: '#888' }}>Không có thông tin</p>
                    ) : null}
                </div>
            }>
            {dot}
        </Popover>
    );
};

const ErrorBoundaryFallback = ({ error }) => {
    ErrorBoundaryFallback.propTypes = {
        error: PropTypes.shape({
            message: PropTypes.string,
        }),
    };
    const getStatusTimestamp = (logs, statusId) => {
        if (!logs || logs.length === 0) return null;
        const log = logs.find((log) => log.newStatusOrderId === statusId);
        return log ? new Date(log.createdAt) : null;
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
                }}>
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
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [returnModalVisible, setReturnModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const handleReviewProduct = (product) => {
        setSelectedProduct(product);
        setReviewModalVisible(true);
    };

    const handleCancelOrder = async (reason) => {
        try {
            setLoading(true);
            const response = await api.post(`orders/cancel`, {
                orderId: toBigIntString(order.orderId),
                note: reason || 'User cancelled order',
            });
            if (response.data.statusCode === 200) {
                toast.success('Đã hủy đơn hàng thành công!');
                setCancelModalVisible(false);
                setCancelReason('');
                fetchOrderDetails(order.orderId);
            } else {
                toast.error(response.data.message || 'Đã xảy ra lỗi khi hủy đơn hàng');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Đã xảy ra lỗi khi hủy đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSuccess = (message) => {
        toast.success(message || 'Cảm ơn bạn đã đánh giá sản phẩm!');
    };

    const fetchOrderDetails = async (orderId) => {
        try {
            if (!orderId || orderId === 'N/A') {
                throw new Error('Invalid Order ID.');
            }

            const bigIntOrderId = toBigIntString(orderId);
            console.log(
                `Fetching order details for orderId: ${bigIntOrderId} at endpoint: orders/user/${bigIntOrderId}`
            );
            const response = await api.get(`orders/user/${bigIntOrderId}`);
            console.log('API Response:', response);
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                const orderData = response.data.data;
                setOrder({
                    orderId: toBigIntString(orderData.orderId),
                    orderDate: orderData.orderDate,
                    orderStatus: orderData.orderStatus,
                    totalPrice: orderData.totalPrice,
                    products: orderData.products || [],
                    payment: orderData.payment || {},
                    customerName: orderData.customerName,
                    customerEmail: orderData.customerEmail,
                    shippingAddress: orderData.shippingAddress,
                    delivery: orderData.delivery,
                    warranty: orderData.warranty,
                    orderLogs: orderData.orderLogs,
                });

                // Fetch details for all products in the order
                if (orderData.products && orderData.products.length > 0) {
                    fetchAllProductDetails(orderData.products);
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

    const fetchAllProductDetails = async (orderProducts) => {
        try {
            const productPromises = orderProducts.map(async (orderProduct) => {
                const id = toBigIntString(orderProduct.productId);
                console.log(`Fetching product details for productId: ${id} at endpoint: products/${id}`);
                const response = await api.get(`products/${id}`);
                if (response?.data?.statusCode === 200 && response?.data?.data) {
                    return {
                        ...response.data.data,
                        // orderId: BigInt(response.data.data.ordId),
                        quantity: orderProduct.quantity,
                        unitPrice: orderProduct.unitPrice,
                    };
                }
                return null;
            });

            const fetchedProducts = await Promise.all(productPromises);
            setProducts(fetchedProducts.filter((product) => product !== null));
        } catch (error) {
            console.error('Error fetching product details:', error);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchOrderDetails(orderId);
    }, [orderId]);

    if (isRouteErrorResponse(error)) {
        return <ErrorBoundaryFallback error={error} />;
    }

    return (
        <Container
            style={{
                marginTop: '80px',
                padding: '24px',
                maxWidth: '1200px',
                marginBottom: '80px',
                overflow: 'hidden',
            }}>
            <ReviewProductModal
                visible={reviewModalVisible}
                onClose={() => setReviewModalVisible(false)}
                product={selectedProduct}
                orderId={order?.orderId}
                orderStatus={order?.orderStatus}
                onSuccess={handleReviewSuccess}
            />
            <Row className="mb-3">
                <Col>
                    <Title
                        level={2}
                        style={{
                            color: '#333',
                            margin: '0 0 24px 0',
                            padding: '0 8px',
                            borderLeft: '5px solid #D8959A',
                            fontWeight: '600',
                        }}>
                        Chi tiết đặt hàng
                    </Title>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            minHeight: '300px',
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                        }}>
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : fetchError ? (
                            <Text style={{ color: '#D8959A' }}>{fetchError}</Text>
                        ) : order ? (
                            <>
                                {/* Header */}
                                <div
                                    className="order-header"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #f0f0f0',
                                        paddingBottom: '16px',
                                    }}>
                                    <div>
                                        <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                            Đơn hàng <span style={{ color: '#D8959A' }}>#{order.orderId}</span>
                                        </Text>
                                        <div style={{ marginTop: '6px' }}>
                                            <Text type="secondary" style={{ fontSize: '13px' }}>
                                                Đặt ngày: {formatDate(order.orderDate)}
                                            </Text>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            backgroundColor: getStatusColor(order.orderStatus),
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                        }}>
                                        {order.orderStatus}
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Customer Information */}
                                <div
                                    className="customer-info"
                                    style={{
                                        marginTop: '20px',
                                        padding: '16px',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px',
                                    }}>
                                    <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '12px' }}>
                                        Thông tin khách hàng
                                    </Text>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
                                                Họ tên
                                            </Text>
                                            <Text style={{ fontSize: '15px' }}>{order.customerName || 'N/A'}</Text>
                                        </div>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
                                                Email
                                            </Text>
                                            <Text style={{ fontSize: '15px' }}>{order.customerEmail || 'N/A'}</Text>
                                        </div>
                                    </div>
                                    {order.shippingAddress?.detail && (
                                        <div style={{ marginTop: '12px' }}>
                                            <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
                                                Địa chỉ
                                            </Text>
                                            <Text style={{ fontSize: '15px' }}>{order.shippingAddress.detail}</Text>
                                        </div>
                                    )}
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Steps */}
                                <div
                                    className="manage-order-steps"
                                    style={{
                                        marginTop: '24px',
                                        marginBottom: '24px',
                                        padding: '20px 0',
                                        backgroundColor: '#fafafa',
                                        borderRadius: '8px',
                                    }}>
                                    <Steps
                                        current={getNumericStatus(order.orderStatus)}
                                        progressDot={(dot, props) =>
                                            customDot(dot, {
                                                ...props,
                                                currentStep: getNumericStatus(order.orderStatus),
                                                logs: order.orderLogs,
                                            })
                                        }
                                        items={statusSteps.map((step, index) => {
                                            // Find log entry for this status step if it exists
                                            const log = order.orderLogs?.find(
                                                (log) => log.newStatusOrderId === index + 1
                                            );

                                            // If log exists, add the timestamp to the description
                                            let description = step.description;
                                            if (log) {
                                                const timestamp = new Date(log.createdAt).toLocaleString('vi-VN', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                });
                                                description = (
                                                    <span>
                                                        {step.description}
                                                        <br />
                                                        <small
                                                            style={{
                                                                fontSize: '11px',
                                                                color:
                                                                    index <= getNumericStatus(order.orderStatus)
                                                                        ? '#D8959A'
                                                                        : '#888',
                                                                fontWeight:
                                                                    index <= getNumericStatus(order.orderStatus)
                                                                        ? 'bold'
                                                                        : 'normal',
                                                            }}>
                                                            {timestamp}
                                                        </small>
                                                    </span>
                                                );
                                            }

                                            return {
                                                ...step,
                                                description: description,
                                            };
                                        })}
                                        disabled={true}
                                    />
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Products */}
                                <div className="products-section" style={{ marginTop: '24px' }}>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: '16px',
                                            marginBottom: '16px',
                                            display: 'block',
                                            borderBottom: '2px solid #D8959A',
                                            paddingBottom: '8px',
                                        }}>
                                        Sản phẩm đã đặt
                                    </Text>

                                    {products.length > 0 ? (
                                        <div
                                            style={{
                                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                            }}>
                                            {products.map((product, index) => (
                                                <div
                                                    key={product.productId}
                                                    className="product-item"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '16px',
                                                        padding: '16px',
                                                        backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                                                        borderBottom:
                                                            index < products.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                    }}>
                                                    <Image
                                                        src={product.images?.[0] || 'https://via.placeholder.com/100'}
                                                        alt={product.productName || 'Product Image'}
                                                        onError={(e) => {
                                                            console.error(
                                                                `Failed to load image: ${product.images?.[0]}`
                                                            );
                                                            e.target.src = 'https://via.placeholder.com/100';
                                                        }}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            border: '1px solid #f0f0f0',
                                                        }}
                                                    />
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            height: '100px',
                                                            overflow: 'hidden',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                        }}>
                                                        <Text strong>{product.productName}</Text>
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                fontSize: '12px',
                                                                wordBreak: 'break-word',
                                                                overflowWrap: 'break-word',
                                                                whiteSpace: 'normal',
                                                                maxWidth: '100%',
                                                                display: 'block',
                                                            }}>
                                                            {product.productDesc}
                                                        </Text>

                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                            }}>
                                                            <div
                                                                style={{
                                                                    padding: '2px 8px',
                                                                    backgroundColor: '#F5F5F5',
                                                                    borderRadius: '4px',
                                                                    fontSize: '14px',
                                                                }}>
                                                                x{product.quantity}
                                                            </div>
                                                            <Button
                                                                size="small"
                                                                type="link"
                                                                onClick={() => handleReviewProduct(product)}
                                                                disabled={order.orderStatus !== 'Completed'}
                                                                style={{
                                                                    color:
                                                                        order.orderStatus === 'Completed'
                                                                            ? '#D8959A'
                                                                            : '#999',
                                                                    cursor:
                                                                        order.orderStatus === 'Completed'
                                                                            ? 'pointer'
                                                                            : 'not-allowed',
                                                                }}>
                                                                Đánh giá sản phẩm
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right', width: '120px' }}>
                                                        {product.discountedPrice > 0 && (
                                                            <Text
                                                                delete
                                                                style={{
                                                                    fontSize: '12px',
                                                                    display: 'block',
                                                                    color: '#999',
                                                                }}>
                                                                đ{product.sellPrice.toLocaleString()}
                                                            </Text>
                                                        )}
                                                        <Text
                                                            style={{
                                                                color: '#D8959A',
                                                                fontWeight: 'bold',
                                                                fontSize: '16px',
                                                            }}>
                                                            đ
                                                            {(product.discountedPrice > 0
                                                                ? product.discountedPrice
                                                                : product.sellPrice
                                                            ).toLocaleString()}
                                                        </Text>
                                                        <Text type="secondary" style={{ fontSize: '13px' }}>
                                                            Tổng: đ
                                                            {(product.unitPrice * product.quantity).toLocaleString()}
                                                        </Text>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : order.products && order.products.length > 0 ? (
                                        <Skeleton active paragraph={{ rows: 2 }} />
                                    ) : (
                                        <Text type="secondary">Không có thông tin sản phẩm</Text>
                                    )}
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Delivery Information */}
                                {order.delivery && (
                                    <>
                                        <div className="delivery-section" style={{ marginTop: '16px' }}>
                                            <Text strong style={{ fontSize: '16px' }}>
                                                Thông tin vận chuyển
                                            </Text>
                                            {order.delivery.deliveryService && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                                        Dịch vụ vận chuyển: {order.delivery.deliveryService}
                                                    </Text>
                                                </div>
                                            )}
                                            {order.delivery.deliveryPhone && (
                                                <div style={{ marginTop: '4px' }}>
                                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                                        Số điện thoại: {order.delivery.deliveryPhone}
                                                    </Text>
                                                </div>
                                            )}
                                            {order.delivery.deliveryStatus && (
                                                <div style={{ marginTop: '4px' }}>
                                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                                        Trạng thái: {order.delivery.deliveryStatus}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                        <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />
                                    </>
                                )}

                                {/* Warranty Information */}
                                {order.warranty && (
                                    <>
                                        <div className="warranty-section" style={{ marginTop: '16px' }}>
                                            <Text strong style={{ fontSize: '16px' }}>
                                                Thông tin bảo hành
                                            </Text>
                                            <div style={{ marginTop: '8px' }}>
                                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                                    Ngày bắt đầu: {formatDate(order.warranty.startDate)}
                                                </Text>
                                            </div>
                                            <div style={{ marginTop: '4px' }}>
                                                <Text type="secondary" style={{ fontSize: '14px' }}>
                                                    Ngày kết thúc: {formatDate(order.warranty.endDate)}
                                                </Text>
                                            </div>
                                        </div>
                                        <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />
                                    </>
                                )}

                                {/* Payment */}
                                <div
                                    className="order-summary"
                                    style={{
                                        marginTop: '24px',
                                        backgroundColor: '#f9f9f9',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}>
                                    <div style={{ width: '350px' }}>
                                        {/* Calculate subtotal from products */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '8px',
                                            }}>
                                            <Text>Tạm tính:</Text>
                                            <Text>
                                                đ
                                                {products
                                                    .reduce(
                                                        (sum, product) => sum + product.sellPrice * product.quantity,
                                                        0
                                                    )
                                                    .toLocaleString()}
                                            </Text>
                                        </div>

                                        {/* Display discount if applicable */}
                                        {(() => {
                                            const regularTotal = products.reduce(
                                                (sum, product) => sum + product.sellPrice * product.quantity,
                                                0
                                            );
                                            const actualProductsTotal = products.reduce(
                                                (sum, product) => sum + product.unitPrice * product.quantity,
                                                0
                                            );
                                            const discount = regularTotal - actualProductsTotal;

                                            return discount > 0 ? (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '8px',
                                                        color: '#52c41a',
                                                    }}>
                                                    <Text style={{ color: '#52c41a' }}>Giảm giá:</Text>
                                                    <Text style={{ color: '#52c41a' }}>
                                                        -đ{discount.toLocaleString()}
                                                    </Text>
                                                </div>
                                            ) : null;
                                        })()}

                                        {/* Shipping fee */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '8px',
                                            }}>
                                            <Text>Phí vận chuyển:</Text>
                                            <Text>
                                                đ
                                                {(order.payment?.paymentAmount - order.totalPrice > 0
                                                    ? order.payment.paymentAmount - order.totalPrice
                                                    : 0
                                                ).toLocaleString()}
                                            </Text>
                                        </div>

                                        {/* Final total */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                borderTop: '1px solid #e8e8e8',
                                                marginTop: '12px',
                                                paddingTop: '12px',
                                            }}>
                                            <Text strong>Thành tiền:</Text>
                                            <Text
                                                style={{
                                                    color: '#D8959A',
                                                    fontWeight: 'bold',
                                                    fontSize: '18px',
                                                }}>
                                                đ
                                                {order.payment?.paymentAmount.toLocaleString() ||
                                                    order.totalPrice.toLocaleString()}
                                            </Text>
                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: '16px',
                                                fontSize: '13px',
                                            }}>
                                            <Text type="secondary">Phương thức thanh toán:</Text>
                                            <Text strong>{order.payment?.paymentMethod || 'Không xác định'}</Text>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

                                {/* Footer */}
                                <div
                                    className="order-footer"
                                    style={{
                                        marginTop: '24px',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: '12px',
                                        borderTop: '1px solid #f0f0f0',
                                        paddingTop: '20px',
                                    }}>
                                    {order.orderStatus === 'Pending' && (
                                        <Button
                                            danger
                                            size="large"
                                            onClick={() => setCancelModalVisible(true)}
                                            style={{
                                                fontWeight: 'bold',
                                            }}>
                                            Hủy Đơn Hàng
                                        </Button>
                                    )}
                                    <Button
                                        type="default"
                                        size="large"
                                        disabled={order.orderStatus !== 'Completed'}
                                        style={{
                                            borderColor: '#D8959A',
                                            color: order.orderStatus === 'Completed' ? '#D8959A' : '#d9d9d9',
                                        }}
                                        onClick={() => {
                                            setReturnModalVisible(true);
                                        }}>
                                        <span style={{ fontWeight: 'bold' }}>Yêu Cầu Hoàn Trả</span>
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            backgroundColor: '#D8959A',
                                            borderColor: '#D8959A',
                                        }}
                                        onClick={() => {
                                            /* Handle reorder functionality */
                                            toast.success('Đặt lại đơn hàng thành công!');
                                        }}>
                                        <span style={{ fontWeight: 'bold' }}>Mua Lại</span>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}
                    </Card>
                </Col>
            </Row>
            <CancelOrderModal
                visible={cancelModalVisible}
                onClose={() => setCancelModalVisible(false)}
                onSubmit={handleCancelOrder}
                loading={loading}
            />
            <ReturnRequestModal
                visible={returnModalVisible}
                onClose={() => setReturnModalVisible(false)}
                order={order}
                products={products}
            />
        </Container>
    );
};

export default OrderHistoryPage;
