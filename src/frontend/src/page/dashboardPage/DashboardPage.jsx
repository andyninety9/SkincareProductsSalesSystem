import { useEffect, useState } from 'react';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import api from '../../config/api';
import { Card, Row, Col, Statistic, DatePicker, Button, Typography, Spin, List, Avatar, Select } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, BarChartOutlined, TagOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Area,
    LineChart,
    Line,
    AreaChart,
    Cell,
} from 'recharts';

const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function DashboardPage() {
    const [salesSummary, setSalesSummary] = useState(null);
    const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'day'));
    const [toDate, setToDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const [productsFromDate, setProductsFromDate] = useState(dayjs().subtract(7, 'day'));
    const [productsToDate, setProductsToDate] = useState(dayjs());

    // Add these chart options
    const chartOptions = [
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Line Chart', value: 'line' },
        { label: 'Area Chart', value: 'area' },
        { label: 'Pie Chart', value: 'pie' },
    ];

    const handleFetchSalesSummary = async (from = fromDate, to = toDate) => {
        setLoading(true);
        try {
            const fromDateStr = from.format('YYYY-MM-DD');
            const toDateStr = to.format('YYYY-MM-DD');

            const response = await api.get(`report/sales-summary?fromDate=${fromDateStr}&toDate=${toDateStr}`);
            setSalesSummary(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleProductsDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setProductsFromDate(dates[0]);
            setProductsToDate(dates[1]);
        }
    };

    const handleApplyProductsDateRange = () => {
        handleFetchTopSellingProducts(productsFromDate, productsToDate);
    };

    const handleFetchTopSellingProducts = async (from = fromDate, to = toDate) => {
        setLoading(true);
        try {
            const fromDateStr = from.format('YYYY-MM-DD');
            const toDateStr = to.format('YYYY-MM-DD');

            const response = await api.get(`report/top-saling-products?fromDate=${fromDateStr}&toDate=${toDateStr}`);
            setTopSellingProducts(response.data.data.topSellingProducts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchSalesSummary(fromDate, toDate);
        handleFetchTopSellingProducts(productsFromDate, productsToDate);
    }, []);

    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setFromDate(dates[0]);
            setToDate(dates[1]);
        }
    };

    const handleApplyDateRange = () => {
        handleFetchSalesSummary(fromDate, toDate);
    };

    // Format currency with thousands separator
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const processChartData = (data) => {
        const combinedData = [];
        const productMap = new Map();

        // Group by productId and combine quantities and revenue
        data.forEach((item) => {
            if (productMap.has(item.productId)) {
                const existingItem = productMap.get(item.productId);
                existingItem.quantitySold += item.quantitySold;
                existingItem.revenue += item.revenue;
            } else {
                productMap.set(item.productId, { ...item });
            }
        });

        // Convert map values to array
        productMap.forEach((item) => {
            combinedData.push(item);
        });

        return combinedData;
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <ManageOrderHeader />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: '250px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                        }}>
                        <Title level={2}>Dashboard</Title>
                        <div>
                            <RangePicker
                                value={[fromDate, toDate]}
                                onChange={handleDateRangeChange}
                                style={{ marginRight: '16px' }}
                            />
                            <Button type="primary" onClick={handleApplyDateRange}>
                                Apply
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : salesSummary ? (
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
                    ) : (
                        <div>No data available</div>
                    )}
                    {topSellingProducts.length > 0 && (
                        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                            <Col xs={24} lg={12}>
                                <Card
                                    title={
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}>
                                            <span>Top Selling Products Chart</span>
                                            <Select
                                                value={chartType}
                                                onChange={setChartType}
                                                options={chartOptions}
                                                style={{ width: 120 }}
                                            />
                                        </div>
                                    }
                                    style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ flex: 1, minHeight: 0 }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            {chartType === 'bar' && (
                                                <BarChart data={processChartData(topSellingProducts)}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="productName" />
                                                    <YAxis
                                                        yAxisId="left"
                                                        orientation="left"
                                                        stroke="#8884d8"
                                                        label={{
                                                            value: 'Quantity',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                        }}
                                                    />
                                                    <YAxis
                                                        yAxisId="right"
                                                        orientation="right"
                                                        stroke="#82ca9d"
                                                        label={{ value: 'Revenue', angle: 90, position: 'insideRight' }}
                                                    />
                                                    <Tooltip
                                                        formatter={(value, name) =>
                                                            name === 'revenue' ? formatCurrency(value) : value
                                                        }
                                                    />
                                                    <Legend />
                                                    <Bar
                                                        yAxisId="left"
                                                        dataKey="quantitySold"
                                                        name="Quantity Sold"
                                                        fill="#8884d8"
                                                    />
                                                    <Bar
                                                        yAxisId="right"
                                                        dataKey="revenue"
                                                        name="Revenue"
                                                        fill="#82ca9d"
                                                    />
                                                </BarChart>
                                            )}
                                            {chartType === 'line' && (
                                                <LineChart
                                                    data={processChartData(topSellingProducts)}
                                                    margin={{ top: 50, right: 30, left: 20, bottom: 5 }} // Added bottom margin
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="productName"
                                                        tick={{
                                                            fontSize: 11,
                                                            fill: '#333',
                                                            width: 120, // Limit text width
                                                        }}
                                                        interval={0}
                                                        angle={-65} // Steeper angle
                                                        textAnchor="end"
                                                        height={100} // Increased height
                                                        padding={{ left: 10, right: 10 }}
                                                    />
                                                    <YAxis
                                                        yAxisId="left"
                                                        orientation="left"
                                                        stroke="#8884d8"
                                                        label={{
                                                            value: 'Quantity Sold',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                        }}
                                                    />
                                                    <YAxis
                                                        yAxisId="right"
                                                        orientation="right"
                                                        stroke="#82ca9d"
                                                        label={{
                                                            value: 'Revenue (VND)',
                                                            angle: 90,
                                                            position: 'insideRight',
                                                        }}
                                                    />
                                                    <Tooltip
                                                        formatter={(value, name) =>
                                                            name === 'revenue' ? formatCurrency(value) : value
                                                        }
                                                        labelFormatter={(label) => `Product: ${label}`}
                                                    />
                                                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                                                    <Line
                                                        yAxisId="left"
                                                        type="monotone"
                                                        dataKey="quantitySold"
                                                        name="Quantity Sold"
                                                        stroke="#8884d8"
                                                        activeDot={{ r: 8 }}
                                                        dot={{ stroke: '#8884d8', strokeWidth: 2, r: 6, fill: 'white' }}
                                                        isAnimationActive={true}
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="revenue"
                                                        name="Revenue"
                                                        stroke="#82ca9d"
                                                        activeDot={{ r: 8 }}
                                                        dot={{ stroke: '#82ca9d', strokeWidth: 2, r: 6, fill: 'white' }}
                                                        isAnimationActive={true}
                                                    />
                                                </LineChart>
                                            )}
                                            {chartType === 'area' && (
                                                <AreaChart data={topSellingProducts}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="productName" />
                                                    <YAxis />
                                                    <Tooltip
                                                        formatter={(value, name) =>
                                                            name === 'revenue' ? formatCurrency(value) : value
                                                        }
                                                    />
                                                    <Legend />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="quantitySold"
                                                        name="Quantity Sold"
                                                        stroke="#8884d8"
                                                        fill="#8884d8"
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="revenue"
                                                        name="Revenue"
                                                        stroke="#82ca9d"
                                                        fill="#82ca9d"
                                                    />
                                                </AreaChart>
                                            )}
                                            {chartType === 'pie' && (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-around',
                                                        height: '100%',
                                                    }}>
                                                    <div style={{ width: '45%', height: '100%' }}>
                                                        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                            Quantity Sold
                                                        </p>
                                                        <ResponsiveContainer width="100%" height={250}>
                                                            <PieChart>
                                                                <Pie
                                                                    data={processChartData(topSellingProducts)}
                                                                    nameKey="productName"
                                                                    dataKey="quantitySold"
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    innerRadius={0}
                                                                    outerRadius={65}
                                                                    fill="#8884d8"
                                                                    paddingAngle={5}
                                                                    // Format percentage to show rounded value
                                                                    label={({ percent }) =>
                                                                        `${(percent * 100).toFixed(1)}%`
                                                                    }
                                                                    labelLine={{
                                                                        stroke: '#555',
                                                                        strokeWidth: 1,
                                                                        strokeDasharray: '3 3',
                                                                    }}>
                                                                    {processChartData(topSellingProducts).map(
                                                                        (entry, index) => (
                                                                            <Cell
                                                                                key={`cell-${index}`}
                                                                                fill={`hsl(${
                                                                                    (index * 30) % 360
                                                                                }, 70%, 60%)`}
                                                                            />
                                                                        )
                                                                    )}
                                                                </Pie>
                                                                <Tooltip
                                                                    formatter={(value) => value}
                                                                    labelFormatter={(name) => `Product: ${name}`}
                                                                />
                                                                <Legend
                                                                    layout="vertical"
                                                                    align="right"
                                                                    verticalAlign="middle"
                                                                    wrapperStyle={{
                                                                        fontSize: '12px',
                                                                        maxWidth: '40%',
                                                                        overflowY: 'auto',
                                                                        maxHeight: '200px',
                                                                    }}
                                                                />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                    <div style={{ width: '45%', height: '100%' }}>
                                                        <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                            Revenue
                                                        </p>
                                                        <ResponsiveContainer width="100%" height={250}>
                                                            <PieChart>
                                                                <Pie
                                                                    data={processChartData(topSellingProducts)}
                                                                    nameKey="productName"
                                                                    dataKey="revenue"
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    innerRadius={0}
                                                                    outerRadius={65}
                                                                    fill="#82ca9d"
                                                                    paddingAngle={5}
                                                                    // Format percentage to show rounded value
                                                                    label={({ percent }) =>
                                                                        `${(percent * 100).toFixed(1)}%`
                                                                    }
                                                                    labelLine={{
                                                                        stroke: '#555',
                                                                        strokeWidth: 1,
                                                                        strokeDasharray: '3 3',
                                                                    }}>
                                                                    {processChartData(topSellingProducts).map(
                                                                        (entry, index) => (
                                                                            <Cell
                                                                                key={`cell-${index}`}
                                                                                fill={`hsl(${
                                                                                    (index * 30) % 360
                                                                                }, 70%, 60%)`}
                                                                            />
                                                                        )
                                                                    )}
                                                                </Pie>
                                                                <Tooltip
                                                                    formatter={(value) => formatCurrency(value)}
                                                                    labelFormatter={(name) => `Product: ${name}`}
                                                                />
                                                                <Legend
                                                                    layout="vertical"
                                                                    align="right"
                                                                    verticalAlign="middle"
                                                                    wrapperStyle={{
                                                                        fontSize: '12px',
                                                                        maxWidth: '40%',
                                                                        overflowY: 'auto',
                                                                        maxHeight: '200px',
                                                                    }}
                                                                />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            )}
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </Col>

                            <Col xs={24} lg={12}>
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
                                                <Button
                                                    size="small"
                                                    type="primary"
                                                    onClick={handleApplyProductsDateRange}>
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
                                                        title={
                                                            <span style={{ fontSize: '14px', color: '#666' }}>
                                                                Quantity Sold
                                                            </span>
                                                        }
                                                        value={item.quantitySold}
                                                        valueStyle={{
                                                            fontSize: '16px',
                                                            fontWeight: '600',
                                                            color: '#1d39c4',
                                                        }}
                                                    />
                                                    <Statistic
                                                        title={
                                                            <span style={{ fontSize: '14px', color: '#666' }}>
                                                                Revenue
                                                            </span>
                                                        }
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
                            </Col>
                        </Row>
                    )}
                </div>
            </div>
        </div>
    );
}
