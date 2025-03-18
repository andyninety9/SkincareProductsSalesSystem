import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { routes } from '../../routes';
import '@fontsource/marko-one';
import '@fontsource/nunito';
import { Layout, Typography, Button, Skeleton, Card, Table, Select, Collapse, Image } from 'antd';
import PropTypes from 'prop-types'; // Import PropTypes for validation
import api from '../../config/api'; // Using the configured api with interceptors
import { toast } from 'react-hot-toast';

const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

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
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Content
                style={{
                    marginTop: 80,
                    padding: '24px',
                    maxWidth: '1200px',
                    width: '100%',
                }}
            >
                <Card
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        minHeight: 300,
                    }}
                    bodyStyle={{ padding: '16px' }}
                >
                    <Text type="danger">
                        {error?.message || 'An unexpected error occurred. Please try again later.'}
                    </Text>
                    <Button type="primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>
                        Refresh Page
                    </Button>
                </Card>
            </Content>
        </Layout>
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
    const [selectedSection, setSelectedSection] = useState(null); // Default to null, show orderSummary

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

    const sectionColumns = [
        {
            title: 'Section',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <a
                    onClick={() => setSelectedSection(record.key)}
                    style={{ cursor: 'pointer', color: record.key === selectedSection ? '#D8959A' : 'inherit' }}
                >
                    {text}
                </a>
            ),
        },
    ];

    const sectionData = [
        { key: 'orderSummary', name: 'Order Summary' },
        { key: 'payment', name: 'Payment Details' },
        { key: 'products', name: 'Products' },
        { key: 'delivery', name: 'Delivery Details' },
    ];

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Content
                style={{
                    marginTop: 80,
                    padding: '24px',
                    maxWidth: '1200px',
                    width: '100%',
                }}
            >
                <Card
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        minHeight: 300,
                    }}
                    bodyStyle={{ padding: '16px' }}
                >
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : fetchError ? (
                        <Text type="danger">{fetchError}</Text>
                    ) : order ? (
                        <>
                            {/* Default Order Summary with Product Details */}
                            {!selectedSection && (
                                <div className="order-details">
                                    <div className="order-item-header">
                                        <Text type="secondary">
                                            Đơn hàng #{toBigIntString(order.orderId) || '689691046673645600'} - {order.orderDate || '2025-03-18T04:25:59'}
                                        </Text>
                                        <Text type="danger">
                                            Trạng thái: {order.orderStatus || 'Completed'} - Đánh giá ngay với nhận 300 Xu
                                        </Text>
                                    </div>
                                    <div className="order-item-details-expanded">
                                        <div className="order-item-details">
                                            <Text strong>Tổng tiền:</Text>
                                            <Text type="danger">đ{order.totalPrice || 861500}</Text>
                                        </div>
                                        {product && (
                                            <>
                                                <Text strong>Product Name:</Text>
                                                <Text>{product.productName || 'Eucerin Hyaluron-Filler Night Cream'}</Text>
                                                <Text strong>Product Description:</Text>
                                                <Text>{product.productDesc || 'Kem dưỡng đêm chống lão hóa cho da khô.'}</Text>
                                                <Text strong>Cost Price:</Text>
                                                <Text>đ{product.costPrice || 500000}</Text>
                                                <Text strong>Sell Price:</Text>
                                                <Text>đ{product.sellPrice || 600000}</Text>
                                                <Text strong>Discounted Price:</Text>
                                                <Text>đ{product.discountedPrice || 0}</Text>
                                                <Text strong>Brand Name:</Text>
                                                <Text>{product.brandName || 'Eucerin'}</Text>
                                                <Text strong>Images:</Text>
                                                {product.images && product.images.length > 0 ? (
                                                    product.images.map((imageUrl, index) => (
                                                        <Image
                                                            key={index}
                                                            src={imageUrl || 'https://image.cocoonvietnam.com/uploads/Website_Avatar_Sua_rua_mat_Sen_Hau_Giang_140ml_573f5b39f6.jpg'}
                                                            alt={`Product Image ${index + 1}`}
                                                            style={{ width: '100px', marginRight: '8px' }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Text>No images available</Text>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="order-item-footer" style={{ marginBottom: '16px' }}>
                                        <Text type="danger">Thành tiền: đ{order.totalPrice || 861500}</Text>
                                        <Button type="primary" danger>
                                            Đánh Giá
                                        </Button>
                                        <Button>Liên Hệ Người Bán</Button>
                                        <Button>Mua Lại</Button>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Text strong>View All Details: </Text>
                                        <Select
                                            defaultValue=""
                                            style={{ width: 200, marginLeft: '8px' }}
                                            onChange={(value) => setSelectedSection(value === 'all' ? 'all' : null)}
                                        >
                                            <Option value="">Select an Option</Option>
                                            <Option value="all">View All Details</Option>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {/* Table for navigation to all sections */}
                            <Table
                                columns={sectionColumns}
                                dataSource={sectionData}
                                rowKey="key"
                                pagination={false}
                                size="small"
                                style={{ marginBottom: '16px', marginTop: '16px' }}
                                onRow={(record) => ({
                                    onClick: () => setSelectedSection(record.key),
                                })}
                            />

                            {/* Details for selected section or all details */}
                            {selectedSection === 'orderSummary' && (
                                <div className="order-details">
                                    <div className="order-item-header">
                                        <Text type="secondary">
                                            Đơn hàng #{toBigIntString(order.orderId) || '689691046673645600'} - {order.orderDate || '2025-03-18T04:25:59'}
                                        </Text>
                                        <Text type="danger">
                                            Trạng thái: {order.orderStatus || 'Completed'} - Đánh giá ngay với nhận 300 Xu
                                        </Text>
                                    </div>
                                    <div className="order-item-details-expanded">
                                        <div className="order-item-details">
                                            <Text strong>Tổng tiền:</Text>
                                            <Text type="danger">đ{order.totalPrice || 861500}</Text>
                                        </div>
                                        {product && (
                                            <>
                                                <Text strong>Product Name:</Text>
                                                <Text>{product.productName || 'Eucerin Hyaluron-Filler Night Cream'}</Text>
                                                <Text strong>Product Description:</Text>
                                                <Text>{product.productDesc || 'Kem dưỡng đêm chống lão hóa cho da khô.'}</Text>
                                                <Text strong>Cost Price:</Text>
                                                <Text>đ{product.costPrice || 500000}</Text>
                                                <Text strong>Sell Price:</Text>
                                                <Text>đ{product.sellPrice || 600000}</Text>
                                                <Text strong>Discounted Price:</Text>
                                                <Text>đ{product.discountedPrice || 0}</Text>
                                                <Text strong>Brand Name:</Text>
                                                <Text>{product.brandName || 'Eucerin'}</Text>
                                                <Text strong>Images:</Text>
                                                {product.images && product.images.length > 0 ? (
                                                    product.images.map((imageUrl, index) => (
                                                        <Image
                                                            key={index}
                                                            src={imageUrl || 'https://image.cocoonvietnam.com/uploads/Website_Avatar_Sua_rua_mat_Sen_Hau_Giang_140ml_573f5b39f6.jpg'}
                                                            alt={`Product Image ${index + 1}`}
                                                            style={{ width: '100px', marginRight: '8px' }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Text>No images available</Text>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="order-item-footer">
                                        <Text type="danger">Thành tiền: đ{order.totalPrice || 861500}</Text>
                                        <Button type="primary" danger>
                                            Đánh Giá
                                        </Button>
                                        <Button>Liên Hệ Người Bán</Button>
                                        <Button>Mua Lại</Button>
                                    </div>
                                </div>
                            )}

                            {selectedSection === 'payment' && order.payment && (
                                <div className="order-details">
                                    <Text strong>Payment Details:</Text>
                                    <p>Payment ID: {order.payment.paymentId || 'N/A'}</p>
                                    <p>Order ID: {toBigIntString(order.payment.orderId) || 'N/A'}</p>
                                    <p>Payment Method: {order.payment.paymentMethod || 'N/A'}</p>
                                    <p>Payment Amount: đ{order.payment.paymentAmount || 'N/A'}</p>
                                </div>
                            )}

                            {selectedSection === 'products' && order.products && (
                                <div className="order-details">
                                    <Text strong>Products:</Text>
                                    {order.products.map((product, index) => (
                                        <div key={index} style={{ marginBottom: 8 }}>
                                            <p>Product ID: {product.productId || 'N/A'}</p>
                                            <p>Product Name: {product.productName || 'N/A'}</p>
                                            <p>Quantity: {product.quantity || 'N/A'}</p>
                                            <p>Unit Price: đ{product.unitPrice || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedSection === 'delivery' && order.delivery && (
                                <div className="order-details">
                                    <Text strong>Delivery Details:</Text>
                                    <p>Delivery ID: {toBigIntString(order.delivery.deliveryId) || 'N/A'}</p>
                                    <p>Delivery Service: {order.delivery.deliveryService || 'N/A'}</p>
                                    <p>Delivery Phone: {order.delivery.deliveryPhone || 'N/A'}</p>
                                    <p>Delivery Status: {order.delivery.deliveryStatus || 'N/A'}</p>
                                    <p>Created At: {order.delivery.createdAt || 'N/A'}</p>
                                </div>
                            )}

                            {/* View All Details */}
                            {selectedSection === 'all' && (
                                <div className="order-details">
                                    <Collapse defaultActiveKey={['1', '2', '3']}>
                                        {order.payment && (
                                            <Panel header="Payment Details" key="1">
                                                <p>Payment ID: {order.payment.paymentId || 'N/A'}</p>
                                                <p>Order ID: {toBigIntString(order.payment.orderId) || 'N/A'}</p>
                                                <p>Payment Method: {order.payment.paymentMethod || 'N/A'}</p>
                                                <p>Payment Amount: đ{order.payment.paymentAmount || 'N/A'}</p>
                                            </Panel>
                                        )}
                                        {order.products && (
                                            <Panel header="Products" key="2">
                                                {order.products.map((product, index) => (
                                                    <div key={index} style={{ marginBottom: 8 }}>
                                                        <p>Product ID: {product.productId || 'N/A'}</p>
                                                        <p>Product Name: {product.productName || 'N/A'}</p>
                                                        <p>Quantity: {product.quantity || 'N/A'}</p>
                                                        <p>Unit Price: đ{product.unitPrice || 'N/A'}</p>
                                                    </div>
                                                ))}
                                            </Panel>
                                        )}
                                        {order.delivery && (
                                            <Panel header="Delivery Details" key="3">
                                                <p>Delivery ID: {toBigIntString(order.delivery.deliveryId) || 'N/A'}</p>
                                                <p>Delivery Service: {order.delivery.deliveryService || 'N/A'}</p>
                                                <p>Delivery Phone: {order.delivery.deliveryPhone || 'N/A'}</p>
                                                <p>Delivery Status: {order.delivery.deliveryStatus || 'N/A'}</p>
                                                <p>Created At: {order.delivery.createdAt || 'N/A'}</p>
                                            </Panel>
                                        )}
                                    </Collapse>
                                </div>
                            )}
                        </>
                    ) : (
                        <Text>Không có đơn hàng nào.</Text>
                    )}
                </Card>
            </Content>
        </Layout>
    );
};

export default OrderHistoryPage;