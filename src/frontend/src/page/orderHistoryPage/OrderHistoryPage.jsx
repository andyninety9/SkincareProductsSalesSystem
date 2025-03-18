import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { routes } from '../../routes';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Skeleton, Card, Table, Typography, Image } from 'antd';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import api from '../../config/api'; // Using the configured api with interceptors
import { toast } from 'react-hot-toast';

const { Text } = Typography;

// Utility function to convert to BigInt string
const toBigIntString = (value) => {
    try {
        return value != null ? BigInt(value).toString() : "N/A";
    } catch (error) {
        console.error(`Error converting to BigInt: ${value}`, error.message);
        return "N/A";
    }
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
                    ...response.data.data,
                    orderId: toBigIntString(response.data.data.orderId), // Convert returned orderId to BigInt string
                    orderDate: response.data.data.orderDate || '2025-03-18T04:25:59',
                    orderStatus: response.data.data.orderStatus || 'Completed',
                    totalPrice: response.data.data.totalPrice || 861500,
                    products: response.data.data.products || [], // Ensure products array exists
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

    // Prepare data for the table (single row based on the first product)
    const tableData = product
        ? [
            {
                key: '1',
                images: product.images || [],
                brandName: product.brandName || 'Eucerin',
                productName: product.productName || 'Eucerin Hyaluron-Filler Night Cream',
                sellPrice: product.sellPrice || 600000,
                quantity: order.products && order.products.length > 0 ? order.products[0].quantity || 1 : 1,
                stocks: product.stocks || 39,
                totalPrice: (product.sellPrice || 600000) * (order.products && order.products.length > 0 ? order.products[0].quantity || 1 : 1),
            },
        ]
        : [];

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'images',
            key: 'images',
            render: (_, record) => (
                <div className="table-col-name">
                    <div className="table-col-name-img">
                        <img
                            src={record.images?.[0] || 'https://via.placeholder.com/100'}
                            alt={record.productName || 'Product Image'}
                            onError={(e) => {
                                console.error(`Failed to load image: ${record.images?.[0]}`);
                                e.target.src = 'https://via.placeholder.com/100';
                            }}
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="table-col-name-content">
                        <h5>{record.brandName}</h5>
                        <Text>{record.productName || 'Unnamed Product'}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Còn lại: {record.stocks !== undefined ? record.stocks : 'N/A'} sản phẩm
                        </Text>
                    </div>
                </div>
            ),
            width: '40%',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'sellPrice',
            key: 'sellPrice',
            render: (sellPrice) => (
                <Text className="font-bold">{(sellPrice || 0).toLocaleString()} đ</Text>
            ),
            width: '20%',
            align: 'center',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <Text>{quantity || 0}</Text>, // Static quantity, no controls
            width: '15%',
            align: 'center',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice) => (
                <Text className="font-bold">{(totalPrice || 0).toLocaleString()} đ</Text>
            ),
            width: '20%',
            align: 'center',
        },
        {
            title: 'Hành động',
            render: () => null, // No delete action for order history
            width: '5%',
            align: 'center',
        },
    ];

    return (
        <Container style={{ marginTop: '80px', padding: '24px', maxWidth: '1200px' }}>
            <Row>
                <Col>
                    <Card
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            minHeight: '300px',
                        }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 4 }} />
                        ) : fetchError ? (
                            <Text type="danger">{fetchError}</Text>
                        ) : order ? (
                            <>
                                <div className="order-header">
                                    <Text type="secondary">
                                        Đơn hàng #{toBigIntString(order.orderId) || '689691046673645600'} -{' '}
                                        {order.orderDate || '2025-03-18T04:25:59'}
                                    </Text>
                                    <Text type="danger">
                                        Trạng thái: {order.orderStatus || 'Completed'} - Đánh giá ngay với nhận 300 Xu
                                    </Text>
                                </div>
                                <Table
                                    columns={columns}
                                    dataSource={tableData}
                                    pagination={false}
                                    size="middle"
                                    style={{ marginTop: '16px' }}
                                />
                                <div className="order-footer" style={{ marginTop: '16px', textAlign: 'right' }}>
                                    <Text type="danger" strong>
                                        Thành tiền: đ{order.totalPrice?.toLocaleString() || '861500'} đ
                                    </Text>
                                    <Button type="primary" danger style={{ marginLeft: '16px' }}>
                                        Đánh Giá
                                    </Button>
                                    <Button style={{ marginLeft: '8px' }}>Liên Hệ Người Bán</Button>
                                    <Button style={{ marginLeft: '8px' }}>Mua Lại</Button>
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