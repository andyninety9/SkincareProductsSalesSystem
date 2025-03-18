import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { routes } from '../../routes';
import '@fontsource/marko-one';
import '@fontsource/nunito';
import { Layout, Typography, Button, Skeleton, Card } from 'antd';
import api from '../../config/api'; // Using the configured api with interceptors
import { toast } from 'react-hot-toast';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

// Utility function to convert to BigInt string
const toBigIntString = (value) => {
    try {
        return value != null ? BigInt(value).toString() : "N/A";
    } catch (error) {
        console.error(`Error converting to BigInt: ${value}`, error.message);
        return "N/A";
    }
};

const OrderHistoryPage = () => {
    const { orderId } = useParams(); // Extract orderId from URL parameter
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add state to track errors

    const fetchOrderDetails = async (orderId) => {
        try {
            if (!orderId || orderId === "N/A") {
                setOrder(null);
                setLoading(false);
                setError('Invalid Order ID.');
                toast.error('Order ID is invalid or missing.');
                return;
            }

            const bigIntOrderId = toBigIntString(orderId); // Convert orderId to BigInt string for request
            console.log(`Fetching order details for orderId: ${bigIntOrderId}`); // Debug log
            const response = await api.get(`orders/user/${bigIntOrderId}`);
            console.log('API Response:', response); // Debug log
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                setOrder({
                    ...response.data.data,
                    orderId: toBigIntString(response.data.data.orderId), // Convert returned orderId to BigInt string
                });
                setError(null);
            } else if (response?.data?.status === 400 && response?.data?.type === "NotFound") {
                console.warn('Order not found:', orderId);
                setOrder(null);
                setError('Order not found.');
                toast.error('Order not found.');
            } else {
                console.warn('Unexpected API response:', response);
                setOrder(null);
                setError(`Failed to load order details. Status: ${response?.data?.status}`);
                toast.error('Failed to load order details.');
            }
        } catch (error) {
            console.error('Error fetching order details:', error.response || error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                navigate(routes.login);
            } else {
                setOrder(null);
                setError(`Error fetching order: ${error.message}`);
                toast.error('Error fetching order details.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails(orderId);
    }, [orderId]); // Re-run effect if orderId changes

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
                        minHeight: 300, // Ensure it has a minimum height for consistency
                    }}
                    bodyStyle={{ padding: '16px' }}
                >
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : error ? (
                        <Text type="danger">{error}</Text>
                    ) : order ? (
                        <div className="order-details">
                            <div className="order-item-header">
                                <Text type="secondary">
                                    Đơn hàng #{order.orderId} - {order.orderDate || '2025-03-18T04:25:59'}
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
                    ) : (
                        <Text>Không có đơn hàng nào.</Text>
                    )}
                </Card>
            </Content>
        </Layout>
    );
};

export default OrderHistoryPage;