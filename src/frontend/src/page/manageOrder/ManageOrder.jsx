import { Table, Button, Input, Card, message, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
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

// BigInt conversion
const toBigIntString = (value) => {
    try {
        return value != null ? BigInt(value).toString() : "N/A";
    } catch (error) {
        console.error(`Error converting to BigInt: ${value}`, error.message);
        return "N/A";
    }
};
const fetchApiData = async (endpoint, params = {}, setter, errorSetter, errorMsg) => {
    try {
        const response = await api.get(endpoint, { params });
        if (response.data.statusCode === 200 && response.data.data) {
            setter(response.data.data);
            return response.data.data;
        }
        throw new Error(response.data.message || "Unexpected response");
    } catch (error) {
        const fullErrorMsg = error.response?.data?.message || error.message || errorMsg;
        errorSetter(fullErrorMsg);
        message.error(fullErrorMsg);
        console.error(`Error fetching ${endpoint}:`, error.message);
        throw error;
    }
};

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [visibleOrders, setVisibleOrders] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Kept for inline error display
    const [orderDetails, setOrderDetails] = useState({});
    const pageSize = 10;

    const fetchOrders = async (page = 1) => {
        setLoading(true);
        try {
            const data = await fetchApiData(
                "/Orders",
                { page, pageSize, timestamp: Date.now() },
                (items) => {
                    const formattedOrders = items.items.map((order) => ({
                        ...order,
                        orderId: BigInt(order.orderId),
                        orderNumber: toBigIntString(order.orderId),
                        dateTime: order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A",
                        customerName: order.customerName || "N/A",
                        items: order.products?.length || 0,
                        total: order.totalPrice ? `${order.totalPrice.toLocaleString()} VND` : "N/A",
                        status: order.orderStatus in stringStatusToNumeric ? stringStatusToNumeric[order.orderStatus] : order.orderStatus || 1,
                        products: order.products || [],
                    }));
                    setOrders(formattedOrders);
                    setTotal(items.totalItems || items.items.length);
                },
                setError,
                "Failed to fetch orders"
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (orderId) => {
        await fetchApiData(
            `orders/${orderId}`,
            {},
            (data) => setOrderDetails((prev) => ({ ...prev, [orderId]: data })),
            setError,
            `Failed to load payment details for order ${orderId}`
        );
    };

    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    const toggleVisibility = (orderNumber) => {
        setVisibleOrders((prev) => {
            const newVisibility = !prev[orderNumber];
            if (newVisibility) {
                const order = orders.find((o) => o.orderNumber === orderNumber);
                if (order && order.orderId && !orderDetails[order.orderId]) {
                    fetchOrderDetails(order.orderId.toString());
                }
            }
            return { ...prev, [orderNumber]: newVisibility };
        });
    };

    const columns = [
        { title: "Order Number", dataIndex: "orderNumber", key: "orderNumber", width: 150 },
        { title: "Date Time", dataIndex: "dateTime", key: "dateTime", width: 200 },
        { title: "Customer Name", dataIndex: "customerName", key: "customerName", width: 200 },
        { title: "Items", dataIndex: "items", key: "items", width: 100 },
        { title: "Total", dataIndex: "total", key: "total", width: 150 },
    ];
    const productColumns = [
        { title: "Product ID", dataIndex: "productId", key: "productId" },
        { title: "Product Name", dataIndex: "productName", key: "productName" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice", render: (price) => `${price.toLocaleString()} VND` },
    ];

    const paymentColumns = [
        { title: "Payment ID", dataIndex: "paymentId", key: "paymentId" },
        { title: "Order ID", dataIndex: "orderId", key: "orderId" },
        { title: "Payment Method", dataIndex: "paymentMethod", key: "paymentMethod" },
        { title: "Payment Amount", dataIndex: "paymentAmount", key: "paymentAmount", render: (amount) => amount ? `${amount.toLocaleString()} VND` : "N/A" },
    ];

    const expandableConfig = {
        expandedRowRender: (record) => {
            const detailedOrder = orderDetails[record.orderId] || {};
            return (
                <div className="expanded-row-content" style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "32px" }}>
                        <strong>- Order Status:</strong>
                        <ManageOrderSteps
                            status={record.status}
                            currentOrderId={record.orderId}
                            onStatusUpdate={() => fetchOrders(currentPage)}
                        />
                    </div>
                    <div style={{ marginBottom: "32px" }}>
                        <strong>- Products:</strong>
                        <Table
                            className="manage-order-table"
                            columns={productColumns}
                            dataSource={record.products}
                            rowKey="productId"
                            pagination={false}
                            style={{ margin: "0 16px" }}
                        />
                    </div>
                    <div style={{ marginBottom: "32px" }}>
                        <strong>- Payment Information:</strong>
                        <Table
                            className="manage-order-table"
                            columns={paymentColumns}
                            dataSource={detailedOrder.payment ? [detailedOrder.payment] : []}
                            rowKey="paymentId"
                            pagination={false}
                            style={{ margin: "0 16px" }}
                            loading={!orderDetails[record.orderId] && visibleOrders[record.orderNumber]}
                        />
                    </div>
                </div>
            );
        },
        rowExpandable: () => true,
        onExpand: (expanded, record) => toggleVisibility(record.orderNumber),
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
                        </div>
                        <div style={{ width: "100%" }}>
                            <Table
                                dataSource={orders}
                                columns={columns}
                                rowKey="orderNumber"
                                loading={loading}
                                pagination={false}
                                expandable={expandableConfig}
                                className="manage-order-table"
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