import { Table, Button, Input, Tabs, Avatar } from "antd";
import { EyeOutlined, SearchOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api"; // 🔥 Import API từ api.jsx

const { TabPane } = Tabs;

export default function ManageAccount() {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [visibleAccounts, setVisibleAccounts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const pageSize = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/User/all-users"); // 🔥 Gọi API bằng axios từ api.jsx
                console.log("Fetched Data:", response.data);

                if (response.data.statusCode === 200 && Array.isArray(response.data.data.items)) {
                    setAccounts(response.data.data.items);
                    setFilteredAccounts(response.data.data.items);
                } else {
                    console.error("Invalid API response:", response.data);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = [...accounts];
        if (activeTab !== "all") {
            const roleId = activeTab === "Manager" ? 1 : activeTab === "Staff" ? 2 : 3;
            filtered = accounts.filter(acc => acc.roleId === roleId);
        }
        if (searchTerm) {
            filtered = filtered.filter(acc => acc.username.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        setFilteredAccounts(filtered);
    }, [activeTab, searchTerm, accounts]);

    const toggleVisibility = (userId) => {
        setVisibleAccounts(prev => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const columns = [
        { title: "User ID", dataIndex: "usrId", key: "usrId", align: "center" },
        { title: "Username", dataIndex: "username", key: "username", align: "center", render: (text) => text || "N/A" },
        { title: "Email", dataIndex: "email", key: "email", align: "center", render: (text) => text || "N/A" },
        { title: "Full Name", dataIndex: "fullname", key: "fullname", align: "center", render: (text) => text || "N/A" },
        { title: "Gender", dataIndex: "gender", key: "gender", align: "center", render: (text) => text || "N/A" },
        { title: "Phone", dataIndex: "phone", key: "phone", align: "center", render: (text) => text || "N/A" },
        { 
            title: "DOB", dataIndex: "dob", key: "dob", align: "center",
            render: (dob) => dob ? new Date(dob).toLocaleDateString("vi-VN") : "N/A"
        },
        { 
            title: "Role", dataIndex: "roleId", key: "roleId", align: "center",
            render: (roleId) => roleId === 1 ? "Manager" : roleId === 2 ? "Staff" : "Customer"
        },
        {
            title: "Status",
            dataIndex: "statusId",
            key: "statusId",
            align: "center",
            render: (statusId) => (
                <Button style={{ backgroundColor: "#AEBCFF", borderRadius: "12px", width: "100px" }}>
                    {statusId === 2 ? "Active" : "Inactive"}
                </Button>
            ),
        },
        {
            title: "Avatar",
            dataIndex: "avatarUrl",
            key: "avatarUrl",
            align: "center",
            render: (avatarUrl) => avatarUrl ? <Avatar src={avatarUrl} size={50} /> : "N/A",
        },
        { title: "Reward Rank", dataIndex: "rewardRank", key: "rewardRank", align: "center", render: (text) => text || "N/A" },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Button
                    type="link"
                    icon={visibleAccounts[record.usrId] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    style={{ color: "black", fontSize: "18px" }}
                    onClick={() => toggleVisibility(record.usrId)}
                />
            ),
        },
    ];

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <ManageOrderHeader />
            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: "24px", overflowY: "auto", marginLeft: "250px" }}>
                    <h1 style={{ fontSize: "40px", textAlign: "left" }}>Accounts</h1>

                    {/* Tabs lọc dữ liệu */}
                    <Tabs defaultActiveKey="all" onChange={setActiveTab}>
                        <TabPane tab="All" key="all" />
                        <TabPane tab="Manager" key="Manager" />
                        <TabPane tab="Staff" key="Staff" />
                        <TabPane tab="Customer" key="Customer" />
                    </Tabs>

                    {/* Ô tìm kiếm */}
                    <Input
                        placeholder="Tìm kiếm tài khoản ..."
                        style={{ width: "450px", marginBottom: "30px", marginTop: "30px" }}
                        suffix={<SearchOutlined />}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Bảng hiển thị danh sách tài khoản */}
                    <Table
                        dataSource={filteredAccounts}
                        columns={columns}
                        rowKey="usrId"
                        pagination={{
                            position: ["bottomCenter"],
                            current: currentPage,
                            pageSize,
                            total: filteredAccounts.length,
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
