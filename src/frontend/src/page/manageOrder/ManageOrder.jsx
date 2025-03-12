import { Table, Button, Input, Card, message, Pagination } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import EyeInvisibleOutlined from "@ant-design/icons/lib/icons/EyeInvisibleOutlined";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import ManageOrderSteps from "../../component/manageOrderSteps/ManageOrderSteps";
import { useState, useEffect } from "react";
import api from '../../config/api';

// Define mapping for string statuses to numeric values
const stringStatusToNumeric = {
    "Pending": 1,
    "Processing": 2,
    "Shipping": 3,
    "Shipped": 4,
    "Completed": 5,
    "Cancel": 6,
};

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [visibleOrders, setVisibleOrders] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null); // Added to force re-render
    const pageSize = 10;

    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            console.log(`fetchOrders called for page ${page} after status update`);
            const response = await api.get("/Orders", {
                params: {
                    page: page,
                    pageSize: pageSize,
                    timestamp: Date.now(), // Cache-busting parameter
                },
            });
            console.log("Raw API response:", response.data);
            const data = response.data;

            if (response.data.statusCode === 200 && Array.isArray(response.data.data.items)) {
                const formattedOrders = response.data.data.items.map((order) => {
                    // Map string orderStatus to numeric value, or use numeric status directly
                    const numericStatus = typeof order.orderStatus === 'string'
                        ? stringStatusToNumeric[order.orderStatus] || 1 // Default to Pending if invalid
                        : Number(order.orderStatus) || 1; // Handle numeric status, default to Pending if invalid

                    console.log(`Order ${order.orderId} raw orderId:`, order.orderId, typeof order.orderId);
                    console.log(`Order ${order.orderId} raw status:`, order.orderStatus, typeof order.orderStatus);
                    console.log(`Order ${order.orderId} mapped numeric status:`, numericStatus);

                    let orderIdBigInt;
                    try {
                        orderIdBigInt = BigInt(order.orderId);
                    } catch (error) {
                        console.error(`Error converting orderId ${order.orderId} to BigInt:`, error.message);
                        orderIdBigInt = null;
                    }
                    if (typeof order.orderId === 'number') {
                        console.warn(`Order ${order.orderId} has a numeric orderId, which may cause precision issues. Backend should send orderId as a string or BigInt.`);
                    }
                    const formattedOrder = {
                        ...order,
                        orderId: orderIdBigInt, // Store orderId as BigInt
                        orderNumber: orderIdBigInt ? orderIdBigInt.toString() : "N/A", // String for display
                        dateTime: order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A",
                        customerName: order.customerName || "N/A",
                        items: order.products ? order.products.length : 0,
                        total: order.totalPrice ? `${order.totalPrice.toLocaleString()} VND` : "N/A",
                        status: numericStatus, // Use the mapped numeric status
                        products: order.products || [],
                    };
                    console.log(`Order ${order.orderId} formatted orderId:`, formattedOrder.orderId, typeof formattedOrder.orderId);
                    console.log(`Order ${order.orderId} formatted status:`, formattedOrder.status);
                    return formattedOrder;
                });
                setOrders(formattedOrders);
                setLastUpdated(Date.now()); // Force re-render
                setTotal(data.data.totalItems || data.data.items.length);
            } else {
                setError(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error.message);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error setting up request:", error.message);
            }
            setError(error.response?.data?.message || error.message || "An error occurred while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const toggleVisibility = (orderNumber) => {
        setVisibleOrders(prev => ({
            ...prev,
            [orderNumber]: !prev?.[orderNumber],
        }));
    };

    const columns = [
        { title: "Order Number", dataIndex: "orderNumber", key: "orderNumber", align: "center" },
        { title: "Date Time", dataIndex: "dateTime", key: "dateTime", align: "center" },
        { title: "Customer Name", dataIndex: "customerName", key: "customerName", align: "center" },
        { title: "Items", dataIndex: "items", key: "items", align: "center" },
        { title: "Total", dataIndex: "total", key: "total", align: "center" },
    ];

    const productColumns = [
        { title: "Product ID", dataIndex: "productId", key: "productId", align: "center" },
        { title: "Product Name", dataIndex: "productName", key: "productName", align: "center" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity", align: "center" },
        {
            title: "Unit Price",
            dataIndex: "unitPrice",
            key: "unitPrice",
            align: "center",
            render: (price) => `${price.toLocaleString()} VND`
        },
    ];

    const expandableConfig = {
        expandedRowRender: (record) => {
            console.log(`Rendering expanded row for order:`, record.orderNumber, record.orderId, typeof record.orderId, record.status);
            return (
                <div style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <strong>Order Status:</strong>
                        <ManageOrderSteps
                            status={record.status} // Pass the pre-mapped numeric status
                            currentOrderId={record.orderId}
                            onStatusUpdate={() => fetchOrders(currentPage)}
                        />
                    </div>
                    <Table
                        columns={productColumns}
                        dataSource={record.products}
                        rowKey="productId"
                        pagination={false}
                        style={{ margin: "0 16px" }}
                    />
                </div>
            );
        },
        rowExpandable: (record) => record.products && record.products.length > 0,
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <div>
                <ManageOrderHeader />
            </div>

            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <div>
                    <ManageOrderSidebar />
                </div>

                <div
                    style={{
                        flex: 1,
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        marginLeft: "250px"
                    }}
                >
                    <div style={{ maxWidth: "100%", margin: "0 auto" }}>
                        <h1 style={{ fontSize: "40px", textAlign: "left", width: "100%" }}>Orders</h1>

                        {error && (
                            <div style={{ color: "red", marginBottom: "16px" }}>
                                Error: {error}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "70px", marginBottom: "16px", justifyContent: "flex-start" }}>
                            {[...Array(4)].map((_, i) => (
                                <Card key={i} style={{ textAlign: "center", width: "180px", backgroundColor: "#FFFCFC", height: "120px", borderRadius: "12px" }}>
                                    <h2 style={{ fontSize: "18px", fontFamily: "Nunito, sans-serif" }}>Total Orders</h2>
                                    <p style={{ fontSize: "40px", color: "#C87E83", fontFamily: "Nunito, sans-serif" }}>123</p>
                                </Card>
                            ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "30px", marginTop: "30px" }}>
                            <Input placeholder="Tìm kiếm khách hàng ..." style={{ width: "450px" }} suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} />
                            <Button
                                style={{
                                    backgroundColor: "#AEBCFF",
                                    borderColor: "#AEBCFF",
                                    borderRadius: "12px",
                                    width: "150px",
                                    marginLeft: "auto",
                                }}
                            >
                                Pending
                            </Button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <Table
                                dataSource={orders}
                                columns={columns}
                                rowKey="orderNumber"
                                scroll={{ x: "100%" }}
                                loading={loading}
                                pagination={false}
                                expandable={expandableConfig}
                            />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={(page) => setCurrentPage(page)}
                                    position={["bottomCenter"]}
                                    showSizeChanger={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}