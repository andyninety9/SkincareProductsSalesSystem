/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, BarChartOutlined, TagOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function SalesSummaryCards({ salesSummary, formatCurrency }) {
    if (!salesSummary) return <div>No data available</div>;

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                    <Statistic
                        title="Total Revenue"
                        value={salesSummary.totalRevenue}
                        formatter={(value) => formatCurrency(value)}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                    <Statistic
                        title="Total Orders"
                        value={salesSummary.totalOrders}
                        prefix={<ShoppingCartOutlined />}
                        valueStyle={{ color: '#1677ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                    <Statistic
                        title="Average Order Value"
                        value={salesSummary.averageOrderValue}
                        formatter={(value) => formatCurrency(value)}
                        prefix={<BarChartOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card hoverable>
                    <Statistic
                        title="Total Products Sold"
                        value={salesSummary.totalProductsSold}
                        prefix={<TagOutlined />}
                        valueStyle={{ color: '#fa541c' }}
                    />
                </Card>
            </Col>
            <Col span={24}>
                <Card>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={5}>Report Period</Title>
                        <p>
                            {dayjs(salesSummary.startDate).format('MMM D, YYYY')} -{' '}
                            {dayjs(salesSummary.endDate).format('MMM D, YYYY')}
                        </p>
                    </div>
                </Card>
            </Col>
        </Row>
    );
}
