import { Table, Button, Input, Tabs, Avatar, Modal, Form, Select, Dropdown, Menu } from "antd";
import { EyeOutlined, SearchOutlined, EyeInvisibleOutlined, PlusOutlined, MoreOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import api from "../../config/api";
import Cookies from "js-cookie";
import { message } from "antd"; // Import message từ Ant Design


const { TabPane } = Tabs;
const { Option } = Select;

export default function ManageAccount() {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [visibleAccounts, setVisibleAccounts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [userRole, setUserRole] = useState(null); 
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);

    const pageSize = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/User/all-users?page=1&limit=10000");

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

        // Lấy role của user hiện tại từ token
        const userCookie = Cookies.get("user");
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie); // Parse JSON từ cookie
                setUserRole(userData.role); // Lấy role từ cookie
                console.log("User Role:", userData.role); // Debug kiểm tra
            } catch (error) {
                console.error("Error parsing user cookie:", error);
            }
        }
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

    
const handleCreateAccount = async (values) => {
    try {
        console.log("📤 Sending data:", values); // Debug dữ liệu gửi lên API

        const response = await api.post("User/create-user", values, {
            headers: {
                "Authorization": `Bearer ${Cookies.get("accessToken")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            message.success("🎉 Tạo tài khoản thành công!", 2);
            console.log("✅ User created successfully!", response.data);
            setIsModalVisible(false);
            form.resetFields();

            // Reload danh sách user
            const res = await api.get("User/all-users");
            setAccounts(res.data.data.items);
            setFilteredAccounts(res.data.data.items);
        } else {
            message.error("⚠️ Lỗi không xác định khi tạo tài khoản!", 2);
            console.error("❌ Error creating user:", response.data);
        }
    } catch (error) {
        console.error("❌ Create user failed:", error);
        
        if (error.response) {
            console.error("📥 Server Response:", error.response.data);
            if (error.response.status === 400) {
                if (error.response.data?.message?.includes("username already exists")) {
                    message.error("⚠️ Username đã tồn tại, vui lòng chọn username khác!", 2);
                } else if (error.response.data?.message?.includes("email already exists")) {
                    message.error("⚠️ Email đã được sử dụng, vui lòng chọn email khác!", 2);
                } else {
                    message.error(`⚠️ Lỗi: ${error.response.data.message || "Không rõ lý do"}`, 2);
                }
            } else {
                message.error("⚠️ Lỗi kết nối đến server!", 2);
            }
        }
    }
};

const handleUserAction = async () => {
    if (!selectedUser) return;
    try {
        const apiUrl = selectedUser.statusId === 2 
            ? `User/deactive-user/${selectedUser.usrId}` 
            : `User/active-user/${selectedUser.usrId}`;
        const method = selectedUser.statusId === 2 ? "DELETE" : "PATCH";

        const response = await api({ method, url: apiUrl });
        if (response.status === 200) {
            message.success(`User ${selectedUser.statusId === 2 ? "banned" : "unbanned"} successfully!`);
            setAccounts(prev => prev.map(acc => acc.usrId === selectedUser.usrId 
                ? { ...acc, statusId: selectedUser.statusId === 2 ? 1 : 2 } 
                : acc));
        }
    } catch (error) {
        message.error("Failed to update user status.");
        console.error("Error updating user status:", error);
    }
    setActionModalVisible(false);
};


    const columns = [
        { title: "User ID", dataIndex: "usrId", key: "usrId", align: "center" },
        { title: "Username", dataIndex: "username", key: "username", align: "center", render: (text) => text || "N/A" },
        { title: "Email", dataIndex: "email", key: "email", align: "center", render: (text) => text || "N/A" },
        { title: "Full Name", dataIndex: "fullname", key: "fullname", align: "center", render: (text) => text || "N/A" },
        { title: "Phone", dataIndex: "phone", key: "phone", align: "center", render: (text) => text || "N/A" },
        {
            title: "Role", dataIndex: "roleId", key: "roleId", align: "center",
            render: (roleId) => roleId === 1 ? "Manager" : roleId === 2 ? "Staff" : "Customer"
        },
        {
            title: "Status",
            dataIndex: "statusId",
            key: "statusId",
            align: "center",
            render: (statusId) => {
                let color = "#FFCC00"; // Mặc định "Inactive" (Vàng)
                let text = "Inactive";

                if (statusId === 2) {
                    color = "#28A745"; // Active (Xanh)
                    text = "Active";
                } else if (statusId === 3) {
                    color = "#DC3545"; // Banned (Đỏ)
                    text = "Banned";
                }

                return (
                    <span style={{
                        backgroundColor: color,
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        display: "inline-block",
                        minWidth: "80px",
                        textAlign: "center",
                    }}>
                        {text}
                    </span>
                );
            }
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item
                                onClick={() => {
                                    setSelectedUser(record);
                                    setActionModalVisible(true);
                                }}
                            >
                                {record.statusId === 2 ? "Ban User" : "Unban User"}
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                >
                    <Button icon={<MoreOutlined />} />
                </Dropdown>
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

                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", gap: "1%" }}>
                        <Input
                            placeholder="Tìm kiếm tài khoản ..."
                            style={{ width: "450px" }}
                            suffix={<SearchOutlined />}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Hiển thị nút Create Account nếu user có quyền */}
                        {(userRole === "Manager" || userRole === "Staff") && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalVisible(true)}
                                style={{
                                    backgroundColor: "#D8959B",
                                    color: "white",
                                }}
                            >
                                Create Account
                            </Button>
                        )}
                    </div>

                    <Tabs defaultActiveKey="all" onChange={setActiveTab}>
                        <TabPane tab="All" key="all" />
                        <TabPane tab="Manager" key="Manager" />
                        <TabPane tab="Staff" key="Staff" />
                        <TabPane tab="Customer" key="Customer" />
                    </Tabs>

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
                        locale={{ emptyText: "Không có dữ liệu" }}
                    />
                </div>
            </div>

            {/* Modal Create Account */}
            <Modal
                title="Create New Account"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={handleCreateAccount} layout="vertical">
                    <Form.Item name="fullname" label="Full Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
                        <Select>
                            {/* Nếu là Manager, có thể tạo cả Staff & Customer */}
                            {userRole === "Manager" && (
                                <>
                                    <Option value={2}>Staff</Option>
                                    <Option value={3}>Customer</Option>
                                </>
                            )}

                            {/* Nếu là Staff, chỉ có thể tạo Customer */}
                            {userRole === "Staff" && (
                                <Option value={3}>Customer</Option>
                            )}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={selectedUser?.statusId === 2 ? "Ban User" : "Unban User"}
                visible={actionModalVisible}
                onOk={handleUserAction}
                onCancel={() => setActionModalVisible(false)}
            >
                <p>
                    {selectedUser?.statusId === 2 
                        ? "Are you sure you want to ban this user?" 
                        : "Are you sure you want to unban this user?"}
                </p>
            </Modal>
        </div>
    );
}
