import { Table, Button, Input, Card, message, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import { useState, useEffect } from "react";
import api from '../../config/api';

export default function ManageQuiz() {
    const [quizItems, setQuizItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const pageSize = 10;

    const fetchQuizItems = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`Skintype?page=${page}&pageSize=${pageSize}`);
            if (response.data.statusCode === 200) {
                const quizData = response.data.data.items;
                const formattedItems = Array.isArray(quizData)
                    ? quizData.map((item) => ({
                        skinTypeId: item.skinTypeId,
                        skinTypeCodes: item.skinTypeCodes || "N/A",
                        skinTypeName: item.skinTypeName || "N/A",
                        skinTypeDesc: item.skinTypeDesc || "N/A",
                    }))
                    : [];
                setQuizItems(formattedItems);
                setTotal(response.data.data.totalItems);
                throw new Error(`Unexpected status code: ${response.data.statusCode}`);
            }
        } catch (error) {
            console.error('Error fetching quiz items:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch quiz items';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizItems(currentPage);
    }, [currentPage]);

    const toggleVisibility = (skinTypeId) => {
        setVisibleItems((prev) => ({
            ...prev,
            [skinTypeId]: !prev[skinTypeId],
        }));
    };

    const columns = [
        {
            title: "Skin Type ID",
            dataIndex: "skinTypeId",
            key: "skinTypeId",
            width: 200,
            align: "center"
        },
        {
            title: "Skin Type Codes",
            dataIndex: "skinTypeCodes",
            key: "skinTypeCodes",
            width: 250,
            align: "center"
        },
        {
            title: "Skin Type Name",
            dataIndex: "skinTypeName",
            key: "skinTypeName",
            width: 400
        },
    ];

    const expandableConfig = {
        expandedRowRender: (record) => {
            return (
                <div className="expanded-row-content" style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "16px" }}>
                        <strong>Mô tả:</strong>
                        <p>{record.skinTypeDesc}</p>
                    </div>
                </div>
            );
        },
        rowExpandable: () => true,
        onExpand: (expanded, record) => toggleVisibility(record.skinTypeId),
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
                        padding: "32px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        marginLeft: "300px"
                    }}
                >
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <h1 style={{ fontSize: "40px", textAlign: "left", width: "100%", marginBottom: "16px" }}>Quiz</h1>
                        {error && (
                            <div style={{ color: "red", marginBottom: "16px" }}>
                                Error: {error}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "16px", justifyContent: "flex-start" }}> 
                            <Card style={{ textAlign: "center", width: "150px", backgroundColor: "#FFFCFC", height: "120px", borderRadius: "12px" }}> 
                                <h2 style={{ fontSize: "16px", fontFamily: "Nunito, sans-serif" }}>Total Quiz Items</h2> 
                                <p style={{ fontSize: "32px", color: "#C87E83", fontFamily: "Nunito, sans-serif" }}>{total}</p> 
                            </Card>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "24px", marginTop: "24px" }}>
                            <Input placeholder="Search skin types ..." style={{ width: "500px" }} suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />} />
                        </div>
                        <div style={{ width: "100%" }}>
                            <Table
                                dataSource={quizItems}
                                columns={columns}
                                rowKey="skinTypeId"
                                loading={loading}
                                pagination={false} 
                                expandable={expandableConfig}
                                className="manage-quiz-table"
                                style={{ width: "100%" }}
                            />
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "24px" }}>
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                    style={{ textAlign: "center" }} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}