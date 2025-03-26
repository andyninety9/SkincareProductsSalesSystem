/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Row, Col, Alert } from 'antd';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    Line,
    ComposedChart,
    ReferenceLine,
} from 'recharts';

export default function DailySalesTrendChart({ dailySales, processDailySalesData, formatCurrency }) {
    if (!dailySales || dailySales.length === 0) {
        return (
            <Alert
                message="No Daily Sales Data"
                description="There is no daily sales data available for the selected date range."
                type="info"
                showIcon
                style={{ marginTop: '24px' }}
            />
        );
    }

    const processedData = processDailySalesData(dailySales);
    const maxRevenue = Math.ceil(Math.max(...processedData.map((item) => item.normalizedRevenue)) * 1.2);
    const maxOrders = Math.ceil(Math.max(...processedData.map((item) => item.orderCount)) * 1.2);

    return (
        <Card title="Daily Sales Trend" style={{ marginTop: '24px', marginBottom: '24px' }}>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="formattedDate" />
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        domain={[0, maxRevenue]}
                        label={{ value: 'Revenue (x1000)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, maxOrders]}
                        label={{ value: 'Orders', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip
                        formatter={(value, name) => {
                            if (name === 'Revenue') {
                                return [formatCurrency(value * 1000), name];
                            }
                            if (name === 'Trend') {
                                return [formatCurrency(value), name];
                            }
                            return [value, name];
                        }}
                    />
                    <Legend />
                    <Bar
                        yAxisId="left"
                        dataKey="normalizedRevenue"
                        name="Revenue"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orderCount"
                        name="Orders"
                        stroke="#ff7300"
                        strokeWidth={2}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="normalizedRevenue"
                        name="Trend Line"
                        stroke="#82ca9d"
                        dot={false}
                        activeDot={false}
                        strokeDasharray="5 5"
                    />
                    <ReferenceLine y={0} stroke="#000" yAxisId="left" />
                </ComposedChart>
            </ResponsiveContainer>
            <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold' }}>Total Revenue</p>
                        <p>{formatCurrency(dailySales.reduce((sum, item) => sum + item.revenue, 0))}</p>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold' }}>Total Orders</p>
                        <p>{dailySales.reduce((sum, item) => sum + item.orderCount, 0)}</p>
                    </div>
                </Col>
                <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold' }}>Total Products Sold</p>
                        <p>{dailySales.reduce((sum, item) => sum + item.productsSold, 0)}</p>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}
