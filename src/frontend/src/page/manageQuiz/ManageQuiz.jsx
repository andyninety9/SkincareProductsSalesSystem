import { Table, Card, message, Pagination, Row, Col, Button, Modal, Form, Alert, Input } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import { useState, useEffect, useCallback } from "react";
import quizService from "../../component/quizService/quizService";
import UpdateQuestionModal from "./UpdateQuestionModal";

export default function ManageQuiz() {
    const [quizItems, setQuizItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalState, setModalState] = useState({
        createVisible: false,
        updateVisible: false,
        selectedQuestion: null,
    });
    const [form] = Form.useForm();
    const pageSize = 10;

    // Consolidated error handling
    const handleError = useCallback((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        return errorMessage;
    }, []);

    // Function to remove duplicate keyQuestions
    const removeDuplicateKeyQuestions = useCallback((keyQuestions) => {
        const seenContents = new Set();
        return keyQuestions.filter((key) => {
            const normalizedContent = key.keyContent.trim().replace(/\.$/, "");
            if (seenContents.has(normalizedContent)) return false;
            seenContents.add(normalizedContent);
            return true;
        });
    }, []);

    // Consolidated item formatting with sorting
    const formatItems = useCallback((items) => {
        const formatted = (items || []).map((item) => ({
            questionId: item.questionId,
            cateQuestionId: item.cateQuestionId || "N/A",
            questionContent: item.questionContent || "N/A",
            keyQuestions: removeDuplicateKeyQuestions(item.keyQuestions || []),
            createdAt: item.createdAt || item.created_at || null,
        }));
        return formatted.sort((a, b) => a.questionId - b.questionId);
    }, [removeDuplicateKeyQuestions]);

    // Fetch quiz items
    const fetchQuizItems = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await quizService.getAllQuizItems(page, pageSize);
            const formattedItems = formatItems(data.items);
            setQuizItems(formattedItems);
            setTotal(data.totalItems || formattedItems.length);
        } catch (error) {
            setQuizItems([]);
            handleError(error);
        } finally {
            setLoading(false);
        }
    }, [formatItems, handleError, pageSize]);

    // CRUD operations
    const handleCreate = useCallback(async (values) => {
        try {
            await quizService.createQuestion(values);
            message.success('Tạo câu hỏi thành công');
            setModalState((prev) => ({ ...prev, createVisible: false }));
            form.resetFields();
            fetchQuizItems(currentPage);
        } catch (error) {
            handleError(error);
        }
    }, [currentPage, fetchQuizItems, form, handleError]);

    const handleUpdate = useCallback(async (values) => {
        try {
            await quizService.updateQuestion(modalState.selectedQuestion.questionId, values);
            message.success('Cập nhật câu hỏi thành công');
            setModalState((prev) => ({ ...prev, updateVisible: false, selectedQuestion: null }));
            form.resetFields();
            fetchQuizItems(currentPage);
        } catch (error) {
            handleError(error);
        }
    }, [modalState.selectedQuestion, currentPage, fetchQuizItems, form, handleError]);

    const handleDelete = useCallback((questionId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
            onOk: async () => {
                try {
                    await quizService.deleteQuestion(questionId);
                    message.success('Xóa câu hỏi thành công');
                    fetchQuizItems(currentPage);
                } catch (error) {
                    handleError(error);
                }
            },
        });
    }, [currentPage, fetchQuizItems, handleError]);

    useEffect(() => {
        fetchQuizItems(currentPage);
    }, [currentPage, fetchQuizItems]);

    // Consolidated modal handling
    const handleModalCancel = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            createVisible: false,
            updateVisible: false,
            selectedQuestion: null,
        }));
        form.resetFields();
    }, [form]);

    const columns = [
        { title: "Question ID", dataIndex: "questionId", key: "questionId", width: 200, align: "center" },
        { title: "Category ID", dataIndex: "cateQuestionId", key: "cateQuestionId", width: 200, align: "center" },
        { title: <div style={{ textAlign: "center" }}>Question Content</div>, dataIndex: "questionContent", key: "questionContent", width: 400 },
        {
            title: "Action",
            key: "action",
            width: 200,
            align: "center",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => setModalState((prev) => ({ ...prev, updateVisible: true, selectedQuestion: record }))}
                        style={{ color: '#D8959B' }} // Apply the desired color
                    >
                        Cập Nhật
                    </Button>

                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        style={{ color: '#6A6A6A' }}
                        onClick={() => handleDelete(record.questionId)}
                    >
                        Xoá
                    </Button>
                </>
            ),
        },
    ];

    const expandableConfig = {
        expandedRowRender: (record) => {
            const half = Math.ceil(record.keyQuestions.length / 2);
            const [leftQuestions, rightQuestions] = [
                record.keyQuestions.slice(0, half),
                record.keyQuestions.slice(half),
            ];

            return (
                <div className="expanded-row-content" style={{ padding: "8px" }}>
                    {record.keyQuestions.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                    {leftQuestions.map((key, index) => (
                                        <li key={key.keyId} style={{ marginBottom: "10px" }}>
                                            <div style={{ borderBottom: index < leftQuestions.length - 1 ? "1px solid #e8e8e8" : "none", paddingBottom: "10px" }}>
                                                <strong>• Answer ID:</strong> {key.keyId} <br />
                                                <strong>• Câu trả lời:</strong> {key.keyContent} <br />
                                                <strong>• Điểm:</strong> {key.keyScore}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                            <Col span={12}>
                                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                                    {rightQuestions.map((key, index) => (
                                        <li key={key.keyId} style={{ marginBottom: "10px" }}>
                                            <div style={{ borderBottom: index < rightQuestions.length - 1 ? "1px solid #e8e8e8" : "none", paddingBottom: "10px" }}>
                                                <strong>• Answer ID:</strong> {key.keyId} <br />
                                                <strong>• Câu trả lời:</strong> {key.keyContent} <br />
                                                <strong>• Điểm:</strong> {key.keyScore}
                                            </div>
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
    };

    return (
        <div style={{ display: "flex", height: "100vh", flexDirection: "column", overflow: "hidden" }}>
            <ManageOrderHeader isModalOpen={modalState.updateVisible} />
            <div style={{ display: "flex", flex: 1, marginTop: "60px", overflow: "hidden" }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: "32px", marginLeft: "300px", overflowY: "auto" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <h1 style={{ fontSize: "40px", textAlign: "left", marginBottom: "16px" }}>Quiz</h1>
                        {error && (
                            <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: "16px" }} />
                        )}
                        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                            <Col>
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

                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "24px",
                                    marginTop: "24px"
                                }}>
                                    <Input
                                        placeholder="Search skin types ..."
                                        style={{ width: "500px" }}
                                        suffix={<SearchOutlined style={{ color: "rgba(0,0,0,0.45)" }} />}
                                    />
                                    <div style={{ display: "grid", justifyContent: "end" }}>
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => setModalState((prev) => ({ ...prev, createVisible: true }))}
                                            style={{
                                                backgroundColor: "#D8959B",
                                                borderColor: "#D8959B",
                                                marginLeft: "30px",
                                            }}
                                        >
                                            Tạo câu hỏi
                                        </Button>
                                    </div>
                                </div>

                            </Col>
                     
                        </Row>
                        <Table
                            dataSource={quizItems}
                            columns={columns}
                            rowKey="questionId"
                            loading={loading}
                            pagination={false}
                            expandable={expandableConfig}
                            className="manage-quiz-table"
                        />
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            style={{ textAlign: "center", marginTop: "24px" }}
                        />
                    </div>
                </div>
            </div>

            <Modal
                title="Tạo câu hỏi mới"
                visible={modalState.createVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleCreate} layout="vertical">
                    <Form.Item
                        name="questionContent"
                        label="Nội dung câu hỏi"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="cateQuestionId"
                        label="ID danh mục"
                        rules={[{ required: true, message: "Vui lòng nhập ID danh mục!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.List name="keyQuestions">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={16}>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "keyContent"]}
                                                rules={[{ required: true, message: "Vui lòng nhập câu trả lời!" }]}
                                            >
                                                <Input placeholder="Answer" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, "keyScore"]}
                                                rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
                                            >
                                                <Input type="number" placeholder="Score" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button danger onClick={() => remove(name)}>Xóa</Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>Thêm câu trả lời</Button>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Tạo</Button>
                    </Form.Item>
                </Form>
            </Modal>

            <UpdateQuestionModal
                visible={modalState.updateVisible}
                onCancel={handleModalCancel}
                onUpdate={handleUpdate}
                selectedQuestion={modalState.selectedQuestion}
                form={form}
            />
        </div>
    );
}