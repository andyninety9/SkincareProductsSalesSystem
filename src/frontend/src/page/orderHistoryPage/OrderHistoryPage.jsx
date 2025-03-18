import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import '@fontsource/marko-one';
import '@fontsource/nunito';
import { Layout, Typography, Avatar, Button, Tabs, Skeleton } from 'antd';
import Cookies from 'js-cookie';
import api from '../../config/api';
import { toast } from 'react-hot-toast';


const { Header, Content } = Layout;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const fetchOrderHistory = async (tab = 'all') => {
        try {
            setLoading(true);
            let endpoint = 'Order/history';
            if (tab === 'pending') endpoint = 'Order/pending';
            else if (tab === 'shipping') endpoint = 'Order/shipping';
            else if (tab === 'delivering') endpoint = 'Order/delivering';
            else if (tab === 'completed') endpoint = 'Order/completed';
            else if (tab === 'canceled') endpoint = 'Order/canceled';
            else if (tab === 'returned') endpoint = 'Order/returned';

            const response = await api.get(endpoint);
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                setOrders(response.data.data);
            } else {
                console.warn('Unexpected API response:', response);
                setOrders([]);
                toast.error('Failed to load order history.');
            }
        } catch (error) {
            console.error('Error fetching order history:', error);
            setOrders([]);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                navigate(routes.login);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderHistory(activeTab);
    }, [activeTab]);

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Content style={{
                marginTop: 80,
                padding: '24px',
                maxWidth: '1200px',
                width: '100%'
            }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    className="order-history-tabs"
                    centered
                >
                    <TabPane tab="Tất cả" key="all" />
                    <TabPane tab="Chờ thanh toán" key="pending" />
                    <TabPane tab="Vận chuyển" key="shipping" />
                    <TabPane tab="Chờ giao hàng" key="delivering" />
                    <TabPane tab="Hoàn thành" key="completed" />
                    <TabPane tab="Đã hủy" key="canceled" />
                    <TabPane tab="Trả hàng/Hoàn tiền" key="returned" />
                </Tabs>

                <div className="order-history-list">
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className="order-item">
                                <div className="order-item-header">
                                    <Text type="secondary">Đơn hàng sản phẩm từ: {order.date || '06-04-2025'}</Text>
                                    <Text type="danger">Đánh giá ngay với nhận 300 Xu</Text>
                                </div>
                                <div className="order-item-content">
                                    <Avatar
                                        size={64}
                                        src={<img src={order.productImage || 'https://via.placeholder.com/64'} alt="product" />}
                                    />
                                    <div className="order-item-details">
                                        <Text strong>{order.productName || 'Áo khoác cẩn Hoodie zip Dalla phối ren với tay form rỗng Regods - Hoodie zip Dalla'}</Text>
                                        <Text type="secondary">Phân loại hàng: {order.category || 'Den,L'}</Text>
                                        <Text type="secondary">x{order.quantity || 1}</Text>
                                        <Text delete type="danger">
                                            đ{order.originalPrice || '600,000'}
                                        </Text>
                                        <Text type="danger">đ{order.finalPrice || '378,000'}</Text>
                                    </div>
                                    <div className="order-item-actions">
                                        <Button type="primary" danger style={{ marginBottom: 8 }}>
                                            Đánh Giá
                                        </Button>
                                        <Button>Chat</Button>
                                        <Button>Xem Shop</Button>
                                        <Text type="success">Giao hàng thành công ?</Text>
                                        <Text type="danger">HOÀN THÀNH</Text>
                                    </div>
                                </div>
                                <div className="order-item-footer">
                                    <Text type="danger">Thành tiền: đ{order.total || '289,460'}</Text>
                                    <Button type="primary" danger>
                                        Đánh Giá
                                    </Button>
                                    <Button>Liên Hệ Người Bán</Button>
                                    <Button>Mua Lại</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <Text>No orders found.</Text>
                    )}
                </div>
            </Content>
        </Layout>
    );
};

export default OrderHistoryPage;