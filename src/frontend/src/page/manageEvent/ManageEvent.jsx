import { Table, Button, Input, Select, Modal, Form, DatePicker, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api";

const { Option } = Select;

export default function ManageEvent() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const pageSize = 10;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get("Events");
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
    
                // Thêm sản phẩm vào sự kiện
                const productsToAdd = await getValidProductsForEvent(createdEvent);
    
                // Gọi API để thêm sản phẩm vào sự kiện
                for (const product of productsToAdd) {
                    await addProductToEvent(createdEvent.eventId, product.productId);
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
    
    

    const getValidProductsForEvent = async (event) => {
        try {
            const productResponse = await api.get("Products");
            const allProducts = productResponse.data;
    
            // Kiểm tra xem allProducts có phải là mảng không
            if (!Array.isArray(allProducts)) {
                throw new Error("Invalid data format: Products data is not an array.");
            }
    
            // Kiểm tra điều kiện để chọn sản phẩm hợp lệ cho event
            const validProducts = allProducts.filter(product => {
                // Kiểm tra sản phẩm chưa nằm trong event nào
                const existingEventsResponse = api.get(`/events/products/${product.productId}`);
                const existingEvents = existingEventsResponse.data;
    
                const isProductValid = existingEvents.every(event => {
                    if (event.endTime >= event.startTime) {
                        return false; // Nếu ngày kết thúc của event đã qua, sản phẩm có thể thêm vào event mới
                    }
                    return true;
                });
    
                return isProductValid;
            });
    
            return validProducts;
        } catch (error) {
            console.error("Error in getValidProductsForEvent:", error);
            notification.error({
                message: 'Error',
                description: `Error in fetching products: ${error.message}`,
                placement: 'topRight',
            });
            return []; // Trả về mảng rỗng nếu có lỗi
        }
    };
    

    const addProductToEvent = async (eventId, productId) => {
        try {
            const response = await api.post("events/add-product", {
                eventId: eventId,
                productId: productId
            });
    
            if (response.data.statusCode === 200) {
                console.log(`Product ${productId} successfully added to event ${eventId}`);
            } else {
                console.log(`Failed to add product ${productId} to event ${eventId}`);
            }
        } catch (error) {
            console.error(`Error adding product ${productId} to event ${eventId}:`, error);
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
                </div>
            </div>
        </div>
    );
}
