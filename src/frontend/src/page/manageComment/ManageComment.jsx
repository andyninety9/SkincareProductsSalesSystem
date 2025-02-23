import { Table, Button, Input, Card } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/ManageOrderSidebar/ManageOrderSidebar";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import EyeInvisibleOutlined from "@ant-design/icons/lib/icons/EyeInvisibleOutlined";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import { useState } from "react";

const comments = Array.from({ length: 50 }, (_, index) => ({
    commentNumber: (123 + index).toString(),
    dateTime: "20/01/2025",
    customerName: "Abc",
    items: "Kem Đánh Răng",
    content: "Tôi thấy kem này sài êm, tôi...",
}));

export default function ManageComment() {
    const [visibleComments, setVisibleComments] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const toggleVisibility = (commentNumber) => {
        setVisibleComments(prev => ({
            ...prev,
            [commentNumber]: !prev[commentNumber],
        }));
    };

    const columns = [
        { title: "Comment ID", dataIndex: "commentNumber", key: "commentNumber", align: "center" },
        { title: "Ngày bình luận", dataIndex: "dateTime", key: "dateTime", align: "center" },
        { title: "Người bình luận", dataIndex: "customerName", key: "customerName", align: "center" },
        { title: "Sản phẩm", dataIndex: "items", key: "items", align: "center" },
        { title: "Nội dung", dataIndex: "content", key: "content", align: "center" },
        {
            title: "Hành Động",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Button
                    type="link"
                    style={{ color: "white", backgroundColor: "#C20814", fontSize: "18px", borderRadius: "12px" }}
                    onClick={() => toggleVisibility(record.commentNumber)}
                >
                    Xoá
                </Button>
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
                        <h1 style={{ fontSize: "40px", textAlign: "left", width: "100%" }}>Comments</h1>

                        <div style={{ display: "flex", gap: "70px", marginBottom: "16px", justifyContent: "center" }}>
                            <Card style={{ textAlign: "center", width: "240px", backgroundColor: "#FFFCFC", height: "120px", borderRadius: "12px" }}>
                                <h2 style={{ fontSize: "18px", fontFamily: "Nunito, sans-serif" }}>Total Comments</h2>
                                <p style={{ fontSize: "40px", color: "#C87E83", fontFamily: "Nunito, sans-serif" }}>123</p>
                            </Card>
                            <Card style={{ textAlign: "center", width: "240px", backgroundColor: "#FFFCFC", height: "120px", borderRadius: "12px" }}>
                                <h2 style={{ fontSize: "18px", fontFamily: "Nunito, sans-serif" }}>Top Product Comments</h2>
                                <p style={{ fontSize: "40px", color: "#C87E83", fontFamily: "Nunito, sans-serif" }}>45</p>
                            </Card>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "30px", marginTop: "30px" }}>
                            <Input placeholder="Search customers ..." style={{ width: "450px" }} suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} />

                        </div>
                        <div style={{ width: "100%", }}>
                            <Table
                                dataSource={comments}
                                columns={columns}
                                rowKey="commentNumber"
                                scroll={{ x: "100%" }}
                                pagination={{
                                    position: ["bottomCenter"],
                                    current: currentPage,
                                    pageSize: 10,
                                    total: comments.length,
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
