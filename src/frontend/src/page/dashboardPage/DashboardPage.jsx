import React from 'react';
import { Row, Col, Typography, DatePicker, Button, Spin } from 'antd';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import useDashboardData from '../../hooks/useDashboardData';
import SalesSummaryCards from '../../component/salesSummaryCards/SalesSummaryCards';
import TopSellingProductsChart from '../../component/topSellingProductsChart/TopSellingProductsChart';
import TopSellingProductsList from '../../component/topSellingProductsList/TopSellingProductsList';
import DailySalesTrendChart from '../../component/dailySalesTrendChart/DailySalesTrendChart';


const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function DashboardPage() {
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
    } = useDashboardData();

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

                    {/* Daily Sales Trend Chart */}
                    <DailySalesTrendChart
                        dailySales={dailySales}
                        processDailySalesData={processDailySalesData}
                        formatCurrency={formatCurrency}
                    />

                    {/* Sales Summary Cards */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <SalesSummaryCards salesSummary={salesSummary} formatCurrency={formatCurrency} />
                    )}

                    {/* Top Selling Products */}
                    {topSellingProducts.length > 0 && (
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
                    )}
                </div>
            </div>
        </div>
    );
}
