import { Table, Input, Card, message, Pagination, Row, Col, Button, Modal, Form, Input as AntInput } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ManageOrderSidebar from "../../component/manageOrderSidebar/ManageOrderSidebar";
import ManageOrderHeader from "../../component/manageOrderHeader/ManageOrderHeader";
import { useState, useEffect } from "react";
import api from '../../config/api';
import quizService from "../../component/quizService/quizService";
import UpdateQuestionModal from "./UpdateQuestionModal"; 

export default function ManageQuiz() {
    const [quizItems, setQuizItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [form] = Form.useForm();
    const pageSize = 10;

    const fetchQuizItems = async (page = 1) => {
        setLoading(true);
        try {
            const data = await quizService.getAllQuizItems(page, pageSize);
            const formattedItems = (data.items || []).map((item) => ({
                questionId: item.questionId,
                cateQuestionId: item.cateQuestionId || "N/A",
                questionContent: item.questionContent || "N/A",
                keyQuestions: item.keyQuestions || [],
            }));
            setQuizItems(formattedItems);
            setTotal(data.totalItems || formattedItems.length);
        } catch (error) {
            const errorMessage = error.message;
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizItems(currentPage);
    }, [currentPage]);

    

    const toggleVisibility = (questionId) => {
        setVisibleItems((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const handleCreate = async (values) => {
        try {
            await quizService.createQuestion(values);
            message.success('Question created successfully');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchQuizItems(currentPage);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleUpdate = async (values) => {
        try {
            await quizService.updateQuestion(selectedQuestion.questionId, values);
            message.success('Question updated successfully');
            setIsUpdateModalVisible(false);
            form.resetFields();
            fetchQuizItems(currentPage);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleDelete = async (questionId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this question?',
            onOk: async () => {
                try {
                    await quizService.deleteQuestion(questionId);
                    message.success('Question deleted successfully');
                    fetchQuizItems(currentPage);
                } catch (error) {
                    message.error(error.message);
                }
            },
        });
    };

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const showUpdateModal = (question) => {
        setSelectedQuestion(question);
        setIsUpdateModalVisible(true);
    };

    const handleCancel = () => {
        setIsCreateModalVisible(false);
        setIsUpdateModalVisible(false);
        form.resetFields();
        setSelectedQuestion(null);
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
        {
            title: "Action",
            key: "action",
            width: 200,
            align: "center",
            render: (_, record) => (
                <div>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showUpdateModal(record)}
                    >
                        Update
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.questionId)}
                    >
                        Delete
                    </Button>
                </div>
            ),
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
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                    {leftQuestions.map((key, index) => (
                                        <li
                                            key={key.keyId}
                                            style={{
                                                marginBottom: "10px",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    borderBottom: index < leftQuestions.length - 1 ? "1px solid #e8e8e8" : "none",
                                                    paddingBottom: "10px",
                                                }}
                                            >
                                                <strong>• Answer ID:</strong> {key.keyId} <br />
                                                <strong>• Category ID:</strong> {record.cateQuestionId} <br />
                                                <strong>• Câu trả lời:</strong> {key.keyContent} <br />
                                                <strong>• Điểm:</strong> {key.keyScore}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </Col>
                            <Col span={12}>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                    {rightQuestions.map((key, index) => (
                                        <li
                                            key={key.keyId}
                                            style={{
                                                marginBottom: "10px",
                                                paddingBottom: "10px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "100%",
                                                    borderBottom: index < rightQuestions.length - 1 ? "1px solid #e8e8e8" : "none",
                                                    paddingBottom: "10px",
                                                }}
                                            >
                                                <strong>• Answer ID:</strong> {key.keyId} <br />
                                                <strong>• Category ID:</strong> {record.cateQuestionId} <br />
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
        onExpand: (expanded, record) => toggleVisibility(record.questionId),
    };

    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", flexDirection: "column" }}>
            <div>
                <ManageOrderHeader isModalOpen={isUpdateModalVisible} />
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
                            <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
                                Create Question
                            </Button>
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

            {/* Create Modal */}
            <Modal
                title="Create New Question"
                visible={isCreateModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} onFinish={handleCreate} layout="vertical">
                    <Form.Item
                        name="questionContent"
                        label="Question Content"
                        rules={[{ required: true, message: 'Please input the question content!' }]}
                    >
                        <AntInput />
                    </Form.Item>
                    <Form.Item
                        name="cateQuestionId"
                        label="Category ID"
                        rules={[{ required: true, message: 'Please input a category ID!' }]}
                    >
                        <AntInput type="number" />
                    </Form.Item>
                    <Form.List name="keyQuestions">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} gutter={16}>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'keyContent']}
                                                rules={[{ required: true, message: 'Please input the answer!' }]}
                                            >
                                                <AntInput placeholder="Answer" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'keyScore']}
                                                rules={[{ required: true, message: 'Please input the score!' }]}
                                            >
                                                <AntInput type="number" placeholder="Score" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={4}>
                                            <Button danger onClick={() => remove(name)}>Remove</Button>
                                        </Col>
                                    </Row>
                                ))}
                                <Button type="dashed" onClick={() => add()} block>
                                    Add Answer
                                </Button>
                            </>
                        )}
                    </Form.List>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Update Modal */}
            <UpdateQuestionModal
                visible={isUpdateModalVisible}
                onCancel={handleCancel}
                onUpdate={handleUpdate}
                selectedQuestion={selectedQuestion}
                form={form}
            />
        </div>
    );
}