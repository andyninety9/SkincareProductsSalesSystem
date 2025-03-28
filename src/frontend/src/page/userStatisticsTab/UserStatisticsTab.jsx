import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Button, Progress, Spin, Badge } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    ShoppingOutlined,
    RiseOutlined,
    EyeOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../config/api';
import moment from 'moment';

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
    const [onlineVisitors, setOnlineVisitors] = useState(0);
    const today = moment();
    const tenDaysAgo = moment().subtract(10, 'days');
    const defaultDateRange = [tenDaysAgo, today];

    const [dateRange, setDateRange] = useState([null, null]);
    const [summaryDateRange, setSummaryDateRange] = useState([null, null]);
    const [locationDateRange, setLocationDateRange] = useState([null, null]);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    useEffect(() => {
        // Initial data loading
        setLoading(true);
        const fetchInitialData = async () => {
            try {
                const dateParams = buildDateRangeParams(summaryDateRange);
                const summaryResponse = await api.get(`report/user-overview?${dateParams}`);

                if (summaryResponse.data && summaryResponse.data.data) {
                    setUserData({
                        totalUsers: summaryResponse.data.data.totalUser || 0,
                        newUsers: summaryResponse.data.data.newUsers || 0,
                        activeUsers: summaryResponse.data.data.activeUsers || 0,
                        userGrowthRate: summaryResponse.data.data.userGrowthRate || 0,
                        usersByAge: [],
                        usersByLocation: [],
                        topSpendingUsers: [],
                    });
                }
            } catch (err) {
                console.log(err);
                setUserData({
                    totalUsers: 0,
                    newUsers: 0,
                    activeUsers: 0,
                    userGrowthRate: 0,
                    usersByAge: [],
                    usersByLocation: [],
                    topSpendingUsers: [],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
        handleGetUserByAge();
        handleGetUserByLocation();
        handleFetchVisitorsData();
    }, []);

    const handleFetchVisitorsData = async () => {
        try {
            const response = await api.get('gateway-stats/online');
            console.log(response);
            if (response.data && response.data.onlineVisitors !== undefined) {
                setOnlineVisitors(response.data.onlineVisitors);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const formatDateParam = (date) => {
        if (!date) return null;
        return date.format('YYYY-MM-DD');
    };
    const buildDateRangeParams = (dateRange) => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            // Default to 10 days ago if no date range provided
            const today = moment().format('YYYY-MM-DD');
            const tenDaysAgo = moment().subtract(10, 'days').format('YYYY-MM-DD');
            return `fromDate=${tenDaysAgo}&toDate=${today}`;
        }

        const fromDate = formatDateParam(dateRange[0]);
        const toDate = formatDateParam(dateRange[1]);
        return `fromDate=${fromDate}&toDate=${toDate}`;
    };

    const handleGetUserSummary = async () => {
        setSummaryLoading(true);
        try {
            // This uses summaryDateRange specifically
            const dateParams = buildDateRangeParams(summaryDateRange);
            const response = await api.get(`report/user-overview?${dateParams}`);
            console.log(response);

            if (response.data && response.data.data) {
                // Update userData state with the API data
                setUserData((prevData) => ({
                    ...prevData,
                    totalUsers: response.data.data.totalUser || prevData.totalUsers,
                    newUsers: response.data.data.newUsers || prevData.newUsers,
                    activeUsers: response.data.data.activeUsers || prevData.activeUsers,
                    userGrowthRate: response.data.data.userGrowthRate || prevData.userGrowthRate,
                }));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleGetUserByAge = async () => {
        try {
            const response = await api.get('report/user-by-age-groups');
            console.log(response);

            if (response.data && response.data.data && response.data.data.userByAgeGroup) {
                const ageGroups = response.data.data.userByAgeGroup.ageGroups || [];

                // Transform the API data format to match our chart's expected format
                const formattedAgeGroups = ageGroups.map((item) => ({
                    age: item.ageGroup,
                    count: item.count,
                }));

                // Update userData with the age groups
                setUserData((prevData) => ({
                    ...prevData,
                    usersByAge: formattedAgeGroups,
                }));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleGetUserByLocation = async () => {
        setLocationLoading(true);
        try {
            const dateParams = buildDateRangeParams(locationDateRange);
            const response = await api.get(`report/user-by-location?${dateParams}`);
            console.log(response);

            if (response.data && response.data.data && response.data.data.userByLocationGroup) {
                const locationData = response.data.data.userByLocationGroup.userByLocation || [];

                // Transform the API data format to match our chart's expected format
                const formattedLocationData = locationData.map((item) => ({
                    city: item.location,
                    count: item.userCount,
                }));

                // Update userData with the location data
                setUserData((prevData) => ({
                    ...prevData,
                    usersByLocation: formattedLocationData,
                }));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLocationLoading(false);
        }
    };

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleApplyDateRange = async () => {
        setLoading(true);
        try {
            const dateParams = buildDateRangeParams(dateRange);
            const summaryResponse = await api.get(`report/user-overview?${dateParams}`);

            if (summaryResponse.data && summaryResponse.data.data) {
                setUserData({
                    totalUsers: summaryResponse.data.data.totalUser || 0,
                    newUsers: summaryResponse.data.data.newUsers || 0,
                    activeUsers: summaryResponse.data.data.activeUsers || 0,
                    userGrowthRate: summaryResponse.data.data.userGrowthRate || 0,
                    usersByAge: userData.usersByAge,
                    usersByLocation: userData.usersByLocation,
                    topSpendingUsers: userData.topSpendingUsers,
                });
            }
        } catch (err) {
            console.log(err);
            // Keeping existing data on error instead of resetting everything
        } finally {
            setLoading(false);
        }
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
            {/* Online Visitors Card */}
            <Card style={{ marginBottom: '16px' }}>
                <Statistic
                    title="Online Visitors Now"
                    value={onlineVisitors}
                    prefix={<Badge status="success" />}
                    valueStyle={{ color: '#52c41a' }}
                    suffix={<EyeOutlined style={{ fontSize: '16px' }} />}
                />
            </Card>

            {/* User Summary Section with Date Picker */}
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>User Summary</span>
                        <div>
                            <RangePicker
                                value={summaryDateRange}
                                onChange={(dates) => setSummaryDateRange(dates)}
                                style={{ marginRight: '8px' }}
                            />
                            <Button
                                type="primary"
                                onClick={handleGetUserSummary}
                                loading={summaryLoading}
                                icon={<CalendarOutlined />}>
                                Apply
                            </Button>
                        </div>
                    </div>
                }
                style={{ marginBottom: '16px' }}>
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
                                        (
                                        {userData.totalUsers > 0
                                            ? Math.round((userData.activeUsers / userData.totalUsers) * 100)
                                            : 0}
                                        %)
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
            </Card>

            {/* User Demographics */}
            <Row gutter={[16, 16]}>
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
                    <Card
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Users by Location</span>
                                <div>
                                    <RangePicker
                                        value={locationDateRange}
                                        onChange={(dates) => setLocationDateRange(dates)}
                                        style={{ marginRight: '8px' }}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={handleGetUserByLocation}
                                        loading={locationLoading}
                                        icon={<CalendarOutlined />}>
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        }>
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
