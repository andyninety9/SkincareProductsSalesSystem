import { Table, Button, Input, Modal, Form, DatePicker, notification, Checkbox, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api";

const { Option } = Select;

export default function ManageEvent() {
    const [events, setEvents] = useState([]);
    const [products, setProducts] = useState([]);  // Sản phẩm
    const [selectedProducts, setSelectedProducts] = useState([]);  // Sản phẩm đã chọn
    const [isProductModalVisible, setIsProductModalVisible] = useState(false);  // Modal chọn sản phẩm
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const pageSize = 10;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get("Events?page=1&pageSize=100");
                if (response.data.statusCode === 200 && Array.isArray(response.data.data.items)) {
                    setEvents(response.data.data.items);
                } else {
                    console.error("Invalid API response:", response.data);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get("Products");

            // Debugging: Check API response
            console.log(response.data);  // Add this line to inspect the full response

            if (response.status === 200) {
                setProducts(response.data.products);  // Ensure this points to the correct data structure
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            notification.error({
                message: 'Error',
                description: 'There was an error fetching products.',
                placement: 'topRight',
            });
        }
    };

    const showProductModal = () => {
        setIsProductModalVisible(true);
        fetchProducts();  // Lấy danh sách sản phẩm khi mở modal
    };

    const handleProductSelection = (product) => {
        setSelectedProducts(prev => [...prev, product]);
    };

    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const filteredEvents = sortedEvents.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const handleAddEvent = async (values) => {
        try {
            // Tạo sự kiện mới mà không cần truyền status
            const response = await api.post("Events/create", {
                ...values,
                startTime: values.startTime.toISOString(),
                endTime: values.endTime.toISOString(),
            });
    
            console.log("Create Event Response:", response);  // In ra để kiểm tra
    
            if (response.status === 200 || response.status === 201) {
                const createdEvent = response.data.data;
                setEvents([...events, createdEvent]);
                setIsModalVisible(false);
                form.resetFields();
    
                // Sau khi sự kiện được tạo thành công, bạn sẽ lấy sản phẩm đã chọn
                const productsToAdd = selectedProducts;
    
                if (productsToAdd.length > 0) {
                    // Gọi API để thêm sản phẩm vào sự kiện
                    for (const product of productsToAdd) {
                        await addProductToEvent(createdEvent.eventId, product.productId);
                    }
                    // Hiển thị thông báo thành công
                    notification.success({
                        message: 'Products Added',
                        description: 'The selected products have been successfully added to the event.',
                        placement: 'topRight',
                    });
                }
    
                // Kích hoạt sự kiện
                await activateEvent(createdEvent.eventId);
    
                // Hiển thị thông báo thành công
                notification.success({
                    message: 'Event Created',
                    description: 'The event has been successfully created and products added.',
                    placement: 'topRight',
                });
            } else {
                console.error("Failed to create event:", response.data);
                notification.error({
                    message: 'Error',
                    description: `Error creating event: ${response.data.message || 'Unknown error'}`,
                    placement: 'topRight',
                });
            }
        } catch (error) {
            console.error("Error creating event:", error);
            notification.error({
                message: 'Error',
                description: `There was an error creating the event: ${error.message}`,
                placement: 'topRight',
            });
        }
    };
    

    const handleAddProductsToEvent = async (eventId) => {
        try {
            for (const product of selectedProducts) {
                await api.post("/api/Events/add-product", {
                    eventId: eventId,
                    productId: product.productId,
                });
            }
            notification.success({
                message: 'Products Added',
                description: 'The selected products have been successfully added to the event.',
                placement: 'topRight',
            });
            setIsProductModalVisible(false);
        } catch (error) {
            console.error("Error adding products:", error);
            notification.error({
                message: 'Error',
                description: 'There was an error adding products.',
                placement: 'topRight',
            });
        }
    };

    const activateEvent = async (eventId) => {
        try {
            // Kích hoạt sự kiện để cập nhật giá sản phẩm
            await api.put(`/events/${eventId}/activate`);
            console.log(`Event ${eventId} activated successfully.`);
        } catch (error) {
            console.error(`Error activating event ${eventId}:`, error);
        }
    };

    const columns = [
        { title: "Event ID", dataIndex: "eventId", key: "eventId", align: "center", render: (text) => text.toString() },
        { title: "Event Name", dataIndex: "eventName", key: "eventName", align: "center" },
        { title: "Start Time", dataIndex: "startTime", key: "startTime", align: "center", render: formatDate },
        { title: "End Time", dataIndex: "endTime", key: "endTime", align: "center", render: formatDate },
        { title: "Description", dataIndex: "eventDesc", key: "eventDesc", align: "center" },
        { title: "Discount (%)", dataIndex: "discountPercent", key: "discountPercent", align: "center" },
        {
            title: "Status",
            dataIndex: "statusEvent",
            key: "statusEvent",
            align: "center",
            render: (status) => (
                <Button style={{ backgroundColor: status ? "#AEBCFF" : "#FFB6C1", borderRadius: "12px", width: "150px" }}>
                    {status ? "Ongoing" : "Finished"}
                </Button>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (text, record) => (
                <Button onClick={showProductModal} type="primary">Select Product</Button>
            ),
        },
    ];

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <ManageOrderHeader />
            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", marginLeft: "250px" }}>
                    <h1 style={{ fontSize: "40px", textAlign: "left" }}>Events</h1>
                    <Button
                        type="primary"
                        style={{ borderRadius: "5px", marginBottom: "5", backgroundColor: "#D8959A" }}
                        onClick={() => setIsModalVisible(true)}
                    >
                        Add New Event
                    </Button>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px" }}>
                        <Select
                            defaultValue="newest"
                            style={{ width: 200, borderRadius: "12px" }}
                            onChange={setSortOrder}
                        >
                            <Option value="newest">Newest Events</Option>
                            <Option value="oldest">Oldest Events</Option>
                        </Select>
                        <Input
                            placeholder="Search for an event..."
                            style={{ width: "450px", borderRadius: "12px" }}
                            suffix={<SearchOutlined />}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Table
                        dataSource={filteredEvents}
                        columns={columns}
                        rowKey="eventId"
                        pagination={{
                            position: ["bottomCenter"],
                            current: currentPage,
                            pageSize,
                            total: filteredEvents.length,
                            onChange: setCurrentPage,
                        }}
                        locale={{ emptyText: "No data available" }}
                    />
                    <Modal
                        title="Add New Event"
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                        destroyOnClose
                    >
                        <Form form={form} onFinish={handleAddEvent} layout="vertical">
                            <Form.Item
                                name="eventName"
                                label="Event Name"
                                rules={[{ required: true, message: "Please enter the event name" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="startTime"
                                label="Start Time"
                                rules={[{ required: true, message: "Please select the start time" }]}
                            >
                                <DatePicker
                                    showTime={{ format: "HH:mm:ss" }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="endTime"
                                label="End Time"
                                rules={[{ required: true, message: "Please select the end time" }]}
                            >
                                <DatePicker
                                    showTime={{ format: "HH:mm:ss" }}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="eventDesc"
                                label="Description"
                                rules={[{ required: true, message: "Please enter the event description" }]}
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                name="discountPercent"
                                label="Discount (%)"
                                rules={[{ required: true, message: "Please enter the discount percentage" }]}
                            >
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
                                    Create Event
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        title="Select Products"
                        visible={isProductModalVisible}
                        onCancel={() => setIsProductModalVisible(false)}
                        footer={null}
                        destroyOnClose
                    >
                        <Table
                            dataSource={products}
                            columns={[
                                { title: "Product ID", dataIndex: "productId", key: "productId" },
                                { title: "Product Name", dataIndex: "productName", key: "productName" },
                                { title: "Brand", dataIndex: "brandName", key: "brandName" },
                                { title: "Category", dataIndex: "categoryName", key: "categoryName" },
                                {
                                    title: "Select",
                                    render: (_, record) => (
                                        <Checkbox onChange={() => handleProductSelection(record)} />
                                    ),
                                },
                            ]}
                            rowKey="productId"
                        />

                        <Button
                            type="primary"
                            onClick={() => handleAddProductsToEvent(1)}  // Pass actual eventId here
                            style={{ marginTop: "20px" }}
                        >
                            Add Selected Products
                        </Button>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
