import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, DatePicker, Button, Spin, Tooltip, Tabs } from 'antd';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import useDashboardData from '../../hooks/useDashboardData';
import SalesSummaryCards from '../../component/salesSummaryCards/SalesSummaryCards';
import TopSellingProductsChart from '../../component/topSellingProductsChart/TopSellingProductsChart';
import TopSellingProductsList from '../../component/topSellingProductsList/TopSellingProductsList';
import DailySalesTrendChart from '../../component/dailySalesTrendChart/DailySalesTrendChart';
import { ReloadOutlined } from '@ant-design/icons';
import UserStatisticsTab from '../userStatisticsTab/UserStatisticsTab';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function DashboardPage() {
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    const {
        salesSummary,
        dailySales,
        topSellingProducts,
        loading,
        fromDate,
        toDate,
        productsFromDate,
        productsToDate,
        formatCurrency,
        processDailySalesData,
        processChartData,
        handleDateRangeChange,
        handleApplyDateRange,
        handleProductsDateRangeChange,
        handleApplyProductsDateRange,
        reloadDashboardData,
    } = useDashboardData();

    const formatLastUpdateTime = () => {
        return lastUpdateTime.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    // Handle reload button click
    const handleReloadData = () => {
        reloadDashboardData();
        setLastUpdateTime(new Date());
    };

    // Set initial update time
    useEffect(() => {
        setLastUpdateTime(new Date());
    }, []);
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
                    </div>
                    {/* Sales Summary Cards */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Tabs defaultActiveKey="sales" style={{ marginBottom: 16 }}>
                            <TabPane tab="Sales Dashboard" key="sales">
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                                    <div style={{ marginRight: '16px', fontSize: '14px', color: '#888' }}>
                                        Cập nhật lần cuối: {formatLastUpdateTime()}
                                    </div>
                                    <RangePicker
                                        value={[fromDate, toDate]}
                                        onChange={handleDateRangeChange}
                                        style={{ marginRight: '16px' }}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={handleApplyDateRange}
                                        style={{ marginRight: '8px' }}>
                                        Apply
                                    </Button>
                                    <Tooltip title="Tải lại dữ liệu">
                                        <Button
                                            type="primary"
                                            icon={<ReloadOutlined />}
                                            onClick={handleReloadData}
                                            loading={loading}
                                        />
                                    </Tooltip>
                                </div>
                                <SalesSummaryCards salesSummary={salesSummary} formatCurrency={formatCurrency} />

                                {/* Daily Sales Trend Chart */}
                                <DailySalesTrendChart
                                    dailySales={dailySales}
                                    processDailySalesData={processDailySalesData}
                                    formatCurrency={formatCurrency}
                                />

                                {/* Top Selling Products */}
                                <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                                    <Col xs={24} lg={12}>
                                        <TopSellingProductsChart
                                            topSellingProducts={topSellingProducts}
                                            processChartData={processChartData}
                                            formatCurrency={formatCurrency}
                                        />
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <TopSellingProductsList
                                            topSellingProducts={topSellingProducts}
                                            processChartData={processChartData}
                                            formatCurrency={formatCurrency}
                                            productsFromDate={productsFromDate}
                                            productsToDate={productsToDate}
                                            handleProductsDateRangeChange={handleProductsDateRangeChange}
                                            handleApplyProductsDateRange={handleApplyProductsDateRange}
                                        />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="User Statistics" key="users">
                                <UserStatisticsTab />
                            </TabPane>
                        </Tabs>
                    )}
                </div>
            </div>
        </div>
    );
}
