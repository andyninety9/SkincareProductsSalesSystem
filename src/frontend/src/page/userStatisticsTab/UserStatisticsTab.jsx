import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Button, Progress, Spin } from 'antd';
import { UserOutlined, TeamOutlined, ShoppingOutlined, RiseOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;

const UserStatisticsTab = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        totalUsers: 0,
        newUsers: 0,
        activeUsers: 0,
        userGrowthRate: 0,
        usersByAge: [],
        usersByLocation: [],
        topSpendingUsers: [],
    });
    const [dateRange, setDateRange] = useState([null, null]);

    useEffect(() => {
        // This would be replaced with your actual API call
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Sample data - replace with actual API response
            setUserData({
                totalUsers: 2458,
                newUsers: 126,
                activeUsers: 1854,
                userGrowthRate: 8.7,
                usersByAge: [
                    { age: '18-24', count: 425 },
                    { age: '25-34', count: 890 },
                    { age: '35-44', count: 654 },
                    { age: '45-54', count: 321 },
                    { age: '55+', count: 168 },
                ],
                usersByLocation: [
                    { city: 'Hà Nội', count: 845 },
                    { city: 'Hồ Chí Minh', count: 921 },
                    { city: 'Đà Nẵng', count: 354 },
                    { city: 'Cần Thơ', count: 178 },
                    { city: 'Khác', count: 160 },
                ],
                topSpendingUsers: [
                    { id: 1, name: 'Nguyễn Văn A', totalSpent: 15800000, orderCount: 12 },
                    { id: 2, name: 'Trần Thị B', totalSpent: 12450000, orderCount: 9 },
                    { id: 3, name: 'Lê Văn C', totalSpent: 11200000, orderCount: 7 },
                    { id: 4, name: 'Phạm Thị D', totalSpent: 9800000, orderCount: 8 },
                    { id: 5, name: 'Hoàng Văn E', totalSpent: 8500000, orderCount: 6 },
                ],
            });
            setLoading(false);
        }, 1500);
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleApplyDateRange = () => {
        fetchUserData();
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    // Chart data for user demographics
    const ageChartData = {
        labels: userData.usersByAge.map((item) => item.age),
        datasets: [
            {
                label: 'Users by Age',
                data: userData.usersByAge.map((item) => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
            },
        ],
    };

    const locationChartData = {
        labels: userData.usersByLocation.map((item) => item.city),
        datasets: [
            {
                label: 'Users by Location',
                data: userData.usersByLocation.map((item) => item.count),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
            },
        ],
    };

    // Table columns for top spending users
    const columns = [
        {
            title: 'User ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Total Spent',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            render: (value) => formatCurrency(value),
            sorter: (a, b) => a.totalSpent - b.totalSpent,
        },
        {
            title: 'Orders',
            dataIndex: 'orderCount',
            key: 'orderCount',
        },
        {
            title: 'Avg. Order Value',
            key: 'avgOrderValue',
            render: (_, record) => formatCurrency(record.totalSpent / record.orderCount),
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            {/* Date Range Filter */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <RangePicker value={dateRange} onChange={handleDateRangeChange} style={{ marginRight: '16px' }} />
                <Button type="primary" onClick={handleApplyDateRange}>
                    Apply
                </Button>
            </div>

            {/* User Summary Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={userData.totalUsers}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="New Users (This Month)"
                            value={userData.newUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Users"
                            value={userData.activeUsers}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                            suffix={
                                <div style={{ fontSize: '14px', color: '#888' }}>
                                    ({Math.round((userData.activeUsers / userData.totalUsers) * 100)}%)
                                </div>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="User Growth Rate"
                            value={userData.userGrowthRate}
                            precision={1}
                            prefix={<RiseOutlined />}
                            suffix="%"
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* User Demographics */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                    <Card title="Users by Age Group">
                        <Bar
                            data={ageChartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                            }}
                            height={300}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Users by Location">
                        <Bar
                            data={locationChartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                            }}
                            height={300}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Top Spending Users */}
            <Card title="Top Spending Users" style={{ marginTop: 16 }}>
                <Table dataSource={userData.topSpendingUsers} columns={columns} rowKey="id" pagination={false} />
            </Card>

            {/* User Retention Rate */}
            <Card title="User Retention Rate" style={{ marginTop: 16 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 1 Month</p>
                            <Progress type="circle" percent={78} />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 3 Months</p>
                            <Progress type="circle" percent={65} />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 6 Months</p>
                            <Progress type="circle" percent={52} />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 1 Year</p>
                            <Progress type="circle" percent={38} />
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default UserStatisticsTab;
