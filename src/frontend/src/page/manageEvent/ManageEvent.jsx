import { Table, Button, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api"; // 🔥 Import API từ api.jsx

const { Option } = Select;

export default function ManageEvent() {
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get("/events"); // 🔥 Gọi API từ backend
                console.log("Fetched Events:", response.data);

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

    const columns = [
        { title: "Event ID", dataIndex: "eventId", key: "eventId", align: "center" },
        { title: "Event Name", dataIndex: "eventName", key: "eventName", align: "center" },
        { title: "Start Time", dataIndex: "startTime", key: "startTime", align: "center" },
        { title: "End Time", dataIndex: "endTime", key: "endTime", align: "center" },
        { title: "Description", dataIndex: "eventDesc", key: "eventDesc", align: "center" },
        { title: "Discount (%)", dataIndex: "discountPercent", key: "discountPercent", align: "center" },
        {
            title: "Status",
            dataIndex: "statusEvent",
            key: "statusEvent",
            align: "center",
            render: (status) => (
                <Button style={{ backgroundColor: status ? "#AEBCFF" : "#FFB6C1", borderRadius: "12px", width: "100px" }}>
                    {status ? "Active" : "Inactive"}
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

                    {/* Bộ lọc ngày */}
                    <Select
                        defaultValue="newest"
                        style={{ width: 200, marginBottom: "20px" }}
                        onChange={setSortOrder}
                    >
                        <Option value="newest">Sự kiện mới nhất</Option>
                        <Option value="oldest">Sự kiện cũ nhất</Option>
                    </Select>

                    {/* Ô tìm kiếm */}
                    <Input
                        placeholder="Tìm kiếm sự kiện ..."
                        style={{ width: "450px", marginBottom: "30px", marginTop: "10px" }}
                        suffix={<SearchOutlined />}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Bảng hiển thị danh sách sự kiện */}
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
                        locale={{
                            emptyText: "Không có dữ liệu",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
