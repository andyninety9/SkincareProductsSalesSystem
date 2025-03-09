import { Table, Button, Input, Card, Tabs } from "antd";
import { EyeOutlined, SearchOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import { useState } from "react";

const { TabPane } = Tabs;

const accounts = Array.from({ length: 50 }, (_, index) => ({
    accountId: (1000 + index).toString(),
    username: `User${index + 1}`,
    email: `user${index + 1}@example.com`,
    role: index % 3 === 0 ? "Manager" : index % 3 === 1 ? "Staff" : "Customer",
    status: "Active",
}));

export default function ManageAccount() {
    const [visibleAccounts, setVisibleAccounts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState("all");
    const pageSize = 10;

    const toggleVisibility = (accountId) => {
        setVisibleAccounts(prev => ({
            ...prev,
            [accountId]: !prev[accountId],
        }));
    };

    const filteredAccounts = activeTab === "all" ? accounts : accounts.filter(acc => acc.role === activeTab);

    const columns = [
        { title: "Account ID", dataIndex: "accountId", key: "accountId", align: "center" },
        { title: "Username", dataIndex: "username", key: "username", align: "center" },
        { title: "Email", dataIndex: "email", key: "email", align: "center" },
        { title: "Role", dataIndex: "role", key: "role", align: "center" },
        {
            title: "Status",
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
                    icon={visibleAccounts[record.accountId] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    style={{ color: "black", fontSize: "18px" }}
                    onClick={() => toggleVisibility(record.accountId)}
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
                        <h1 style={{ fontSize: "40px", textAlign: "left", width: "100%" }}>Accounts</h1>

                        <div style={{ display: "flex", gap: "70px", marginBottom: "16px", justifyContent: "flex-start" }}>
                            {[...Array(4)].map((_, i) => (
                                <Card key={i} style={{ textAlign: "center", width: "180px", backgroundColor: "#FFFCFC", height: "120px", borderRadius: "12px" }}>
                                    <h2 style={{ fontSize: "18px", fontFamily: "Nunito, sans-serif" }}>Total Accounts</h2>
                                    <p style={{ fontSize: "40px", color: "#C87E83", fontFamily: "Nunito, sans-serif" }}>50</p>
                                </Card>
                            ))}
                        </div>

                        <Tabs defaultActiveKey="all" onChange={setActiveTab} style={{ marginBottom: "20px" }}>
                            <TabPane tab="All" key="all" />
                            <TabPane tab="Manager" key="Manager" />
                            <TabPane tab="Staff" key="Staff" />
                            <TabPane tab="Customer" key="Customer" />
                        </Tabs>

                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "30px", marginTop: "30px" }}>
                            <Input placeholder="Tìm kiếm tài khoản ..." style={{ width: "450px" }} suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} />
                        </div>

                        <div style={{ width: "100%" }}>
                            <Table
                                dataSource={filteredAccounts}
                                columns={columns}
                                rowKey="accountId"
                                scroll={{ x: "100%" }}
                                pagination={{
                                    position: ["bottomCenter"],
                                    current: currentPage,
                                    pageSize: 10,
                                    total: filteredAccounts.length,
                                    pageSizeOptions: ["10", "20", "30"],
                                    onChange: (page) => setCurrentPage(page),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
