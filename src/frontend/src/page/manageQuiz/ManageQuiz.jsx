import { Table, Button, Input, Card, message, Pagination, Row, Col } from "antd";
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
            const response = await api.get(`Question/get-all?page=${page}&pageSize=${pageSize}`);
            console.log(`API Response for page ${page}:`, response);

            if (response.status !== 200) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const quizData = response.data.data?.items || [];
            const formattedItems = Array.isArray(quizData)
                ? quizData.map((item) => ({
                    questionId: item.questionId,
                    cateQuestionId: item.cateQuestionId || "N/A",
                    questionContent: item.questionContent || "N/A",
                    keyQuestions: item.keyQuestions || [],
                }))
                : [];
            setQuizItems(formattedItems);
            setTotal(response.data.data?.totalItems || formattedItems.length);
        } catch (error) {
            console.error('Error fetching quiz items:', error);
            console.error('Response data (if available):', error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch quiz items';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // New function to fetch all pages and log unique items
    const fetchAllQuizItems = async () => {
        setLoading(true);
        let allItems = [];
        const totalPages = Math.ceil(total / pageSize) || 6; // Use total from state, default to 6 if not yet set

        try {
            for (let page = 1; page <= totalPages; page++) {
                const response = await api.get(`Question/get-all?page=${page}&pageSize=${pageSize}`);
                console.log(`Fetched page ${page}:`, response.data.data?.items);
                const pageItems = response.data.data?.items || [];
                allItems = [...allItems, ...pageItems];
            }

            // Remove duplicates based on questionId
            const uniqueItems = Array.from(new Map(allItems.map(item => [item.questionId, item])).values());
            console.log('Total unique items received:', uniqueItems.length);
            console.log('All unique items:', uniqueItems);
        } catch (error) {
            console.error('Error fetching all quiz items:', error);
            message.error('Failed to fetch all quiz items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizItems(currentPage);
    }, [currentPage]);

    // Trigger fetchAllQuizItems once total is set (after first fetch)
    useEffect(() => {
        if (total > 0) { // Ensure total is set before running
            fetchAllQuizItems();
        }
    }, [total]);

    const toggleVisibility = (questionId) => {
        setVisibleItems((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const columns = [
        {
            title: "Question ID",
            dataIndex: "questionId",
            key: "questionId",
            width: 200,
            align: "center",
        },
        {
            title: "Category ID",
            dataIndex: "cateQuestionId",
            key: "cateQuestionId",
            width: 200,
            align: "center",
        },
        {
            title: <div style={{ textAlign: "center" }}>Question Content</div>,
            dataIndex: "questionContent",
            key: "questionContent",
            width: 400,
        },
    ];

    const expandableConfig = {
        expandedRowRender: (record) => {
            const half = Math.ceil(record.keyQuestions.length / 2);
            const leftQuestions = record.keyQuestions.slice(0, half);
            const rightQuestions = record.keyQuestions.slice(half);

            return (
                <div className="expanded-row-content" style={{ padding: "8px" }}>
                    {record.keyQuestions.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ul>
                                    {leftQuestions.map((key) => (
                                        <li key={key.keyId} style={{ marginBottom: "10px" }}>
                                            <strong>ID:</strong> {key.keyId} <br />
                                            <strong>Câu trả lời:</strong> {key.keyContent} <br />
                                            <strong>Điểm:</strong> {key.keyScore}
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                            <Col span={12}>
                                <ul>
                                    {rightQuestions.map((key) => (
                                        <li key={key.keyId} style={{ marginBottom: "10px" }}>
                                            <strong>ID:</strong> {key.keyId} <br />
                                            <strong>Câu trả lời:</strong> {key.keyContent} <br />
                                            <strong>Điểm:</strong> {key.keyScore}
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                        </Row>
                    ) : (
                        <p>Không có câu trả lời</p>
                    )}
                </div>
            );
        },
        rowExpandable: () => true,
        onExpand: (expanded, record) => toggleVisibility(record.questionId),
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
                        marginLeft: "300px",
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
                            <Card
                                style={{
                                    textAlign: "center",
                                    width: "150px",
                                    backgroundColor: "#FFFCFC",
                                    height: "120px",
                                    borderRadius: "12px",
                                }}
                            >
                                <h2 style={{ fontSize: "16px", fontFamily: "Nunito, sans-serif" }}>Total Questions</h2>
                                <p style={{ fontSize: "32px", color: "#C87E83", fontFamily: "Nunito, sans-serif" }}>{total}</p>
                            </Card>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "24px", marginTop: "24px" }}>
                            <Input
                                placeholder="Search questions ..."
                                style={{ width: "500px" }}
                                suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
                            />
                        </div>
                        <div style={{ width: "100%" }}>
                            <Table
                                dataSource={quizItems}
                                columns={columns}
                                rowKey="questionId"
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