import { Table, Button, Input, Card, message, Pagination, Select } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import EyeInvisibleOutlined from "@ant-design/icons/lib/icons/EyeInvisibleOutlined";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import { useState, useEffect } from "react";
import api from '../../config/api';

const { Option } = Select;

const orders = Array.from({ length: 50 }, (_, index) => ({
    orderNumber: (12345678 + index).toString(),
    dateTime: "20/01/2025",
    customerName: "Abc",
    items: 2,
    total: "100$",
    status: "Pending",
}));

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [visibleOrders, setVisibleOrders] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [pageSize, setPageSize] = useState(10);

    const fetchOrders = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(null);
            // console.log("Making API request to /api/Orders...");
            const response = await api.get("/Orders", {
                params: {
                    page: page,
                    pageSize: pageSize,
                },
            });
            console.log("API response:", response.data);
            const data = response.data;

            if (data.statusCode === 200) {
                const formattedOrders = data.data.items.map(order => ({
                    orderNumber: order.orderId ? order.orderId.toString() : "N/A",
                    dateTime: order.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A",
                    customerName: order.customerName || "N/A",
                    items: order.products ? order.products.length : 0,
                    total: order.totalPrice ? `${order.totalPrice.toLocaleString()} VND` : "N/A",
                    status: order.orderStatus || "N/A",
                }));
                setOrders(formattedOrders);
                setTotal(data.data.totalItems || data.data.items.length); // Update total for pagination
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
            setError(error.message || "An error occurred while fetching orders");
        } finally {
            setLoading(false);
        }
    };

    const getPageSizeOptions = () => {
        const defaultPageSize = 10; // Use the default page size for calculation
        const totalPages = Math.ceil(total / defaultPageSize); // Calculate total pages with default pageSize
        if (totalPages <= 10) {
            return ["10"]; // Only 10/page if content fits within 10 pages at default pageSize
        }
        return ["10", "20", "30"]; // Enable all options if content exceeds 10 pages at default pageSize
    };

    useEffect(() => {
        fetchOrders(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const isPageSizeChangeDisabled = () => {
        const defaultPageSize = 10;
        const totalPages = Math.ceil(total / defaultPageSize);
        return totalPages <= 10; // True if content fits within 10 pages at default pageSize
    };

    const CustomPageSizeChanger = () => {
        const disabled = isPageSizeChangeDisabled();

        return (
            <div style={{ display: "flex", alignItems: "center", marginLeft: "16px" }}>
                <span style={{ marginRight: "8px" }}>Items per page:</span>
                <Select
                    value={pageSize}
                    onChange={(value) => {
                        if (!disabled || value === 10) { // Allow change to 10 even if disabled
                            setPageSize(value);
                            setCurrentPage(1); // Reset to first page on pageSize change
                        }
                    }}
                    style={{ width: 80 }}
                >
                    <Option value={10}>10</Option>
                    <Option value={20} disabled={disabled}>20</Option>
                    <Option value={30} disabled={disabled}>30</Option>
                </Select>
            </div>
        );
    };

    const toggleVisibility = (orderNumber) => {
        setVisibleOrders(prev => ({
            ...prev,
            [orderNumber]: !prev[orderNumber],
        }));
    };

    const columns = [
        { title: "Order Number", dataIndex: "orderNumber", key: "orderNumber", align: "center" },
        { title: "Date Time", dataIndex: "dateTime", key: "dateTime", align: "center" },
        { title: "Customer Name", dataIndex: "customerName", key: "customerName", align: "center" },
        { title: "Items", dataIndex: "items", key: "items", align: "center" },
        { title: "Total", dataIndex: "total", key: "total", align: "center" },
        {
            title: "Order Status",
            dataIndex: "status",
            align: "center",
            key: "status",
            render: (status) => <Button
                style={{
                    backgroundColor: "#AEBCFF",
                    borderColor: "#AEBCFF",
                    borderRadius: "12px",
                    width: "150px"
                }}>{status}</Button>,
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={visibleOrders[record.orderNumber] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    style={{ color: "black", fontSize: "18px" }}
                    onClick={() => toggleVisibility(record.orderNumber)}
                />
            ),
        },
    ];

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <div>
                <ManageOrderHeader />
            </div>


            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                {/* Fixed Sidebar */}
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
                                pagination={false} // Disable default pagination to use custom one
                            />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "16px" }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false} // Disable default size changer
                                    position={["bottomCenter"]}
                                />
                                <CustomPageSizeChanger />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
