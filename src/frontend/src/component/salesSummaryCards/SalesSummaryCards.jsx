/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, BarChartOutlined, TagOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function SalesSummaryCards({ salesSummary, formatCurrency }) {
    if (!salesSummary) return <div>No data available</div>;

    const cardStyles = {
        revenue: {
            background: 'linear-gradient(135deg, #52c41a 0%, #237804 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.4)',
            borderRadius: '12px',
        },
        orders: {
            background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
            borderRadius: '12px',
        },
        average: {
            background: 'linear-gradient(135deg, #722ed1 0%, #391085 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(114, 46, 209, 0.4)',
            borderRadius: '12px',
        },
        products: {
            background: 'linear-gradient(135deg, #fa541c 0%, #ad2102 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(250, 84, 28, 0.4)',
            borderRadius: '12px',
        },
        period: {
            background: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
        },
    };

    const whiteTextStyle = {
        color: 'white',
    };
    return (
        <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={cardStyles.revenue} bodyStyle={{ padding: '20px' }}>
                    <Statistic
                        title={<span style={whiteTextStyle}>Tổng doanh thu</span>}
                        value={salesSummary.totalRevenue}
                        formatter={(value) => formatCurrency(value)}
                        prefix={<DollarOutlined />}
                        valueStyle={{ ...whiteTextStyle, fontSize: '24px' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={cardStyles.orders} bodyStyle={{ padding: '20px' }}>
                    <Statistic
                        title={<span style={whiteTextStyle}>Tổng đơn hàng</span>}
                        value={salesSummary.totalOrders}
                        prefix={<ShoppingCartOutlined />}
                        valueStyle={{ ...whiteTextStyle, fontSize: '24px' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={cardStyles.average} bodyStyle={{ padding: '20px' }}>
                    <Statistic
                        title={<span style={whiteTextStyle}>Giá trị đơn hàng trung bình</span>}
                        value={salesSummary.averageOrderValue}
                        formatter={(value) => formatCurrency(value)}
                        prefix={<BarChartOutlined />}
                        valueStyle={{ ...whiteTextStyle, fontSize: '24px' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable style={cardStyles.products} bodyStyle={{ padding: '20px' }}>
                    <Statistic
                        title={<span style={whiteTextStyle}>Tổng sản phẩm đã bán</span>}
                        value={salesSummary.totalProductsSold}
                        prefix={<TagOutlined />}
                        valueStyle={{ ...whiteTextStyle, fontSize: '24px' }}
                    />
                </Card>
            </Col>
            {/* <Col span={24}>
                <Card style={cardStyles.period}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={5}>Khoảng thời gian báo cáo</Title>
                        <p style={{ fontSize: '16px', color: '#595959' }}>
                            {dayjs(salesSummary.startDate).format('MMM D, YYYY')} -{' '}
                            {dayjs(salesSummary.endDate).format('MMM D, YYYY')}
                        </p>
                    </div>
                </Card>
            </Col> */}
        </Row>
    );
}
