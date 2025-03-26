import { useState, useEffect } from 'react';
import api from '../config/api';
import dayjs from 'dayjs';

export default function useDashboardData() {
    const [salesSummary, setSalesSummary] = useState(null);
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [loading, setLoading] = useState(false);

    // Date states
    const [fromDate, setFromDate] = useState(dayjs().subtract(7, 'day'));
    const [toDate, setToDate] = useState(dayjs());
    const [productsFromDate, setProductsFromDate] = useState(dayjs().subtract(7, 'day'));
    const [productsToDate, setProductsToDate] = useState(dayjs());

    // Format currency helper
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Process daily sales data
    const processDailySalesData = (data) => {
        if (!data || data.length === 0) {
            console.warn('No data to process for daily sales');
            return [];
        }

        try {
            const processedData = data.map((item, index) => {
                const formattedDate = dayjs(item.date).format('MMM DD');
                const trend = index > 0 ? item.revenue - data[index - 1].revenue : 0;
                const trendIndicator =
                    index > 0 && item.revenue < data[index - 1].revenue
                        ? Math.max(item.orderCount, data[index - 1].orderCount, 5)
                        : 0;

                // Add normalized revenue (divided by 100,000 for display)
                const normalizedRevenue = item.revenue / 100000;

                return {
                    ...item,
                    formattedDate,
                    normalizedRevenue,
                    trend,
                    trendDirection: trend >= 0 ? 'up' : 'down',
                    trendIndicator,
                };
            });
            return processedData;
        } catch (error) {
            console.error('Error processing daily sales data:', error);
            return [];
        }
    };

    // Reload all dashboard data
    const reloadDashboardData = async () => {
        setLoading(true);
        try {
            // Call all fetch functions in parallel
            await Promise.all([
                handleFetchSalesSummary(fromDate, toDate),
                handleFetchDailySales(fromDate, toDate),
                handleFetchTopSellingProducts(productsFromDate, productsToDate),
            ]);
        } catch (error) {
            console.error('Error reloading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process chart data
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

    // API Calls
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

    const handleFetchDailySales = async (from = fromDate, to = toDate) => {
        setLoading(true);
        try {
            const fromDateStr = from.format('YYYY-MM-DD');
            const toDateStr = to.format('YYYY-MM-DD');
            const response = await api.get(`report/daily-sales?fromDate=${fromDateStr}&toDate=${toDateStr}`);

            const dailySalesData = response.data?.data?.dailySales || [];

            if (dailySalesData && dailySalesData.length > 0) {
                setDailySales(dailySalesData);
            } else {
                setDailySales([]);
            }
        } catch (error) {
            console.error('Error fetching daily sales:', error);
            setDailySales([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchTopSellingProducts = async (from = productsFromDate, to = productsToDate) => {
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

    // Date handlers
    const handleDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setFromDate(dates[0]);
            setToDate(dates[1]);
        }
    };

    const handleProductsDateRangeChange = (dates) => {
        if (dates && dates.length === 2) {
            setProductsFromDate(dates[0]);
            setProductsToDate(dates[1]);
        }
    };

    const handleApplyDateRange = () => {
        handleFetchSalesSummary(fromDate, toDate);
        handleFetchDailySales(fromDate, toDate);
    };

    const handleApplyProductsDateRange = () => {
        handleFetchTopSellingProducts(productsFromDate, productsToDate);
    };

    // Initial data fetch
    useEffect(() => {
        handleFetchSalesSummary();
        handleFetchTopSellingProducts();
        handleFetchDailySales();
    }, []);

    return {
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
    };
}
