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

    return (
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
            <Col span={24}>
                <Card
                    title={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                            <span>Daily Sales Trend</span>
                            <span style={{ fontSize: '12px', color: '#666' }}>{dailySales.length} days of data</span>
                        </div>
                    }
                    style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, minHeight: '400px', border: '1px solid #ddd' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={processDailySalesData(dailySales)}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="formattedDate" />
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    label={{
                                        value: 'Revenue (VND)',
                                        angle: -90,
                                        position: 'insideLeft',
                                    }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    label={{ value: 'Count', angle: 90, position: 'insideRight' }}
                                />
                                <Tooltip
                                    formatter={(value, name) => {
                                        if (name === 'revenue') return formatCurrency(value);
                                        return value;
                                    }}
                                />
                                <Legend />

                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue"
                                    fill="#8884d8"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                />

                                <Bar yAxisId="right" dataKey="orderCount" name="Orders" fill="#82ca9d" barSize={20} />

                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="productsSold"
                                    name="Products Sold"
                                    stroke="#ff7300"
                                    activeDot={{ r: 8 }}
                                    strokeWidth={2}
                                />
                                {processDailySalesData(dailySales).map((entry, index) => {
                                    if (index === 0) return null;
                                    return entry.trend < 0 ? (
                                        <ReferenceLine
                                            key={`ref-${index}`}
                                            x={entry.formattedDate}
                                            stroke="#ff4d4f"
                                            strokeWidth={80}
                                            strokeOpacity={0.2}
                                        />
                                    ) : null;
                                })}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </Col>
        </Row>
    );
}
