/* eslint-disable react/prop-types */
import React from 'react';
import { Card, DatePicker, Button, List, Avatar, Statistic } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function TopSellingProductsList({
    topSellingProducts,
    processChartData,
    formatCurrency,
    productsFromDate,
    productsToDate,
    handleProductsDateRangeChange,
    handleApplyProductsDateRange,
}) {
    return (
        <Card
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <span>Top Selling Products</span>
                    <div>
                        <RangePicker
                            value={[productsFromDate, productsToDate]}
                            onChange={handleProductsDateRangeChange}
                            style={{ marginRight: '8px' }}
                            size="small"
                        />
                        <Button size="small" type="primary" onClick={handleApplyProductsDateRange}>
                            Apply
                        </Button>
                    </div>
                </div>
            }
            style={{ height: '500px', display: 'flex', flexDirection: 'column' }}
            bodyStyle={{ padding: '0 24px', flex: 1, overflow: 'hidden' }}>
            <List
                itemLayout="horizontal"
                dataSource={processChartData(topSellingProducts)}
                style={{
                    height: '100%',
                    overflow: 'auto',
                    padding: '5px',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                }}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: '12px 16px',
                            marginBottom: '8px',
                            background: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                            border: '1px solid #f0f0f0',
                            transition: 'all 0.3s ease',
                        }}
                        className="product-list-item">
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    size={80}
                                    shape="square"
                                    src={item.imageUrl}
                                    style={{
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        objectFit: 'cover',
                                    }}
                                />
                            }
                            title={
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        color: '#303030',
                                        display: 'block',
                                        marginBottom: '4px',
                                    }}>
                                    {item.productName}
                                </span>
                            }
                            description={
                                <span style={{ color: '#666', fontSize: '14px' }}>
                                    Unit Price:{' '}
                                    <span style={{ fontWeight: '500', color: '#1890ff' }}>
                                        {formatCurrency(item.unitPrice)}
                                    </span>
                                </span>
                            }
                            style={{ marginRight: '16px', flex: 2 }}
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                flex: 1,
                            }}>
                            <Statistic
                                title={<span style={{ fontSize: '14px', color: '#666' }}>Quantity Sold</span>}
                                value={item.quantitySold}
                                valueStyle={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#1d39c4',
                                }}
                            />
                            <Statistic
                                title={<span style={{ fontSize: '14px', color: '#666' }}>Revenue</span>}
                                value={formatCurrency(item.revenue)}
                                valueStyle={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#389e0d',
                                }}
                            />
                        </div>
                    </List.Item>
                )}
            />
        </Card>
    );
}
