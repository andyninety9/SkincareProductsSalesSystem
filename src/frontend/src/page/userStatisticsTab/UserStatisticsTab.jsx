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
        retentionRates: {
            after1Month: 0,
            after3Month: 0,
            after6Month: 0,
            after12Month: 0,
        },
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

        const loadAllData = async () => {
            try {
                // Load data in sequence to avoid race conditions
                await fetchInitialData();
                await handleGetUserByAge();
                await handleGetUserByLocation();
                await handleFetchVisitorsData();
                await handleFetchReportSpendingUser();
                await handleGetUserRetentionRate();
            } catch (err) {
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);

    // Also modify fetchInitialData to not reset usersByAge
    const fetchInitialData = async () => {
        try {
            const dateParams = buildDateRangeParams(summaryDateRange);
            const summaryResponse = await api.get(`report/user-overview?${dateParams}`);

            if (summaryResponse.data && summaryResponse.data.data) {
                setUserData((prevData) => ({
                    ...prevData,
                    totalUsers: summaryResponse.data.data.totalUser || 0,
                    newUsers: summaryResponse.data.data.newUsers || 0,
                    activeUsers: summaryResponse.data.data.activeUsers || 0,
                    userGrowthRate: summaryResponse.data.data.userGrowthRate || 0,
                    // Don't reset age, location or top spenders here
                }));
            }
        } catch (err) {
            console.log(err);
            // Only reset basic stats on error, not all data
        }
    };

    const handleFetchReportSpendingUser = async () => {
        try {
            const response = await api.get('report/spending-user?fromDate=2025-01-01&toDate=2025-03-29');
            console.log('Spending user response:', response);

            if (
                response.data &&
                response.data.data &&
                response.data.data.topSpendingUsers &&
                response.data.data.topSpendingUsers.topSpendingUsers
            ) {
                const spendingUsers = response.data.data.topSpendingUsers.topSpendingUsers.map((user, index) => ({
                    // Use string directly to avoid BigInt issues
                    id: String(BigInt(user.userId)),
                    name: user.userName || 'Unknown User',
                    totalSpent: Number(user.totalSpent) || 0,
                    orderCount: Number(user.orderCount) || 0,
                    avgOrderValue: Number(user.avgOrderValue) || 0,
                    rank: index + 1,
                }));

                console.log('Processed spending users:', spendingUsers);

                setUserData((prevData) => ({
                    ...prevData,
                    topSpendingUsers: spendingUsers,
                }));
            } else {
                console.log('Invalid data structure for top spending users');
            }
        } catch (err) {
            console.error('Error fetching top spending users:', err);
        }
    };

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

    const handleGetUserRetentionRate = async () => {
        try {
            const response = await api.get('report/user-retention-rate');
            console.log(response);

            if (response.data && response.data.data) {
                // Update userData with the retention rate data
                setUserData((prevData) => ({
                    ...prevData,
                    retentionRates: {
                        after1Month: response.data.data.after1Month || 0,
                        after3Month: response.data.data.after3Month || 0,
                        after6Month: response.data.data.after6Month || 0,
                        after12Month: response.data.data.after12Month || 0,
                    },
                }));
            }
        } catch (err) {
            console.log(err);
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
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            render: (rank) => {
                if (rank === 1) {
                    return <div style={{ color: '#f5b505', fontWeight: 'bold', fontSize: '18px' }}>🥇 1st</div>;
                } else if (rank === 2) {
                    return <div style={{ color: '#a8a8a8', fontWeight: 'bold', fontSize: '16px' }}>🥈 2nd</div>;
                } else if (rank === 3) {
                    return <div style={{ color: '#cd7f32', fontWeight: 'bold', fontSize: '16px' }}>🥉 3rd</div>;
                }
                return <div style={{ color: '#666' }}>{rank}th</div>;
            },
        },
        {
            title: 'User ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{id}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => <span style={record.rank <= 3 ? { fontWeight: 'bold' } : {}}>{name}</span>,
        },
        {
            title: 'Total Spent',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            render: (value, record) => (
                <div style={record.rank <= 3 ? { color: '#1890ff', fontWeight: 'bold' } : {}}>
                    {formatCurrency(value)}
                </div>
            ),
            sorter: (a, b) => a.totalSpent - b.totalSpent,
        },
        {
            title: 'Orders',
            dataIndex: 'orderCount',
            key: 'orderCount',
            render: (value) => (
                <Badge
                    count={value}
                    style={{
                        backgroundColor: '#52c41a',
                        minWidth: '28px',
                        height: '20px',
                        padding: '0 8px',
                        borderRadius: '10px',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                    overflowCount={999}
                />
            ),
        },
        {
            title: 'Avg. Order Value',
            key: 'avgOrderValue',
            render: (_, record) => (
                <div style={{ color: '#722ed1' }}>{formatCurrency(record.totalSpent / record.orderCount)}</div>
            ),
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
                {userData.topSpendingUsers && userData.topSpendingUsers.length > 0 ? (
                    <Table
                        dataSource={userData.topSpendingUsers}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        rowClassName={(record) => {
                            if (record.rank === 1) return 'top-spender-first';
                            if (record.rank === 2) return 'top-spender-second';
                            if (record.rank === 3) return 'top-spender-third';
                            return '';
                        }}
                        onRow={(record) => ({
                            style: {
                                background:
                                    record.rank === 1
                                        ? '#fffbe6'
                                        : record.rank === 2
                                        ? '#f6ffed'
                                        : record.rank === 3
                                        ? '#e6f7ff'
                                        : 'transparent',
                            },
                        })}
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>No spending data available</div>
                )}
            </Card>

            {/* User Retention Rate */}
            <Card title="User Retention Rate" style={{ marginTop: 16 }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 1 Month</p>
                            <Progress
                                type="circle"
                                percent={userData.retentionRates.after1Month}
                                format={(percent) => `${percent.toFixed(1)}%`}
                                strokeColor={userData.retentionRates.after1Month > 50 ? '#52c41a' : '#faad14'}
                            />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 3 Months</p>
                            <Progress
                                type="circle"
                                percent={userData.retentionRates.after3Month}
                                format={(percent) => `${percent.toFixed(1)}%`}
                                strokeColor={userData.retentionRates.after3Month > 40 ? '#52c41a' : '#faad14'}
                            />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 6 Months</p>
                            <Progress
                                type="circle"
                                percent={userData.retentionRates.after6Month}
                                format={(percent) => `${percent.toFixed(1)}%`}
                                strokeColor={userData.retentionRates.after6Month > 30 ? '#52c41a' : '#faad14'}
                            />
                        </div>
                    </Col>
                    <Col span={6}>
                        <div style={{ textAlign: 'center' }}>
                            <p>After 1 Year</p>
                            <Progress
                                type="circle"
                                percent={userData.retentionRates.after12Month}
                                format={(percent) => `${percent.toFixed(1)}%`}
                                strokeColor={userData.retentionRates.after12Month > 20 ? '#52c41a' : '#faad14'}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default UserStatisticsTab;
