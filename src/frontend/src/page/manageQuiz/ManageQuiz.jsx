import { Table, Card, message, Pagination, Row, Col, Button, Modal, Form, Alert, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import { useState, useEffect, useCallback, useRef } from 'react';
import quizService from '../../component/quizService/quizService';
import UpdateQuestionModal from './UpdateQuestionModal';
import CreateQuestionModal from './CreateQuestionModal';
import DeleteQuestionModal from './DeleteQuestionModal';

function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);

    const debouncedCallback = useCallback(
        (...args) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    return debouncedCallback;
}

export default function ManageQuiz() {
    const [quizItems, setQuizItems] = useState([]);
    const [filteredQuizItems, setFilteredQuizItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [modalState, setModalState] = useState({
        createVisible: false,
        updateVisible: false,
        deleteVisible: false,
        selectedQuestion: null,
        selectedQuestionId: null,
    });
    const [searchInputValue, setSearchInputValue] = useState('');
    const [form] = Form.useForm();
    const pageSize = 10;

    const handleError = useCallback((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        return errorMessage;
    }, []);

    const removeDuplicateKeyQuestions = useCallback((keyQuestions) => {
        const seenContents = new Set();
        return keyQuestions.filter((key) => {
            const normalizedContent = key.keyContent.trim().replace(/\.$/, '');
            if (seenContents.has(normalizedContent)) return false;
            seenContents.add(normalizedContent);
            return true;
        });
    }, []);

    const formatItems = useCallback(
        (items) => {
            const formatted = (items || []).map((item) => ({
                questionId: item.questionId,
                cateQuestionId: item.cateQuestionId || 'N/A',
                questionContent: item.questionContent || 'N/A',
                keyQuestions: removeDuplicateKeyQuestions(item.keyQuestions || []),
                createdAt: item.createdAt || item.created_at || null,
            }));
            return formatted.sort((a, b) => a.questionId - b.questionId);
        },
        [removeDuplicateKeyQuestions]
    );

    const fetchQuizItems = useCallback(
        async (page = 1, keyword = '') => {
            setLoading(true);
            setError(null);
            try {
                const data = await quizService.getAllQuizItems(keyword, page, pageSize);
                const formattedItems = formatItems(data.items);
                setQuizItems(formattedItems);
                setFilteredQuizItems(formattedItems);
                setTotal(data.totalItems || formattedItems.length);
            } catch (error) {
                setQuizItems([]);
                setFilteredQuizItems([]);
                handleError(error);
            } finally {
                setLoading(false);
            }
        },
        [formatItems, handleError, pageSize]
    );

    const handleSearchRequest = useCallback(
        (value) => {
            setSearchValue(value);
            setCurrentPage(1);
            fetchQuizItems(1, value.trim());
        },
        [fetchQuizItems]
    );

    const debouncedSearch = useDebounce(handleSearchRequest, 500);

    const handleInputChange = useCallback(
        (e) => {
            const value = e.target.value;
            setSearchInputValue(value);
            debouncedSearch(value);
        },
        [debouncedSearch]
    );

    const handleCreate = async (values) => {
        try {
            setError(null);
            console.log('Form Values:', JSON.stringify(values, null, 2));

            const questionData = {
                questionContent: values.questionContent,
                cateQuestionId: values.cateQuestionId,
            };
            const questionResponse = await quizService.createQuestion(questionData);
            console.log('Create Question Response:', JSON.stringify(questionResponse, null, 2));

            const questionId = questionResponse.questionId;
            if (values.keyQuestions && values.keyQuestions.length > 0) {
                const answerPromises = values.keyQuestions.map(async (answer) => {
                    const answerData = {
                        questionId: questionId,
                        keyContent: answer.keyContent,
                        keyScore: answer.keyScore,
                    };
                    return quizService.createAnswer(answerData);
                });
                await Promise.all(answerPromises);
                console.log('All answers created successfully');
            }

            message.success('Question and answers created successfully');
            setModalState((prev) => ({ ...prev, createVisible: false }));
            form.resetFields();
            fetchQuizItems(currentPage, searchValue);
        } catch (error) {
            console.error('Create Question or Answers Error:', error.message);
            setError(error.message);
            message.error(error.message);
        }
    };

    const handleUpdate = useCallback(
        (updatedQuestion) => {
            try {
                setQuizItems((prev) =>
                    prev.map((item) => (item.questionId === updatedQuestion.questionId ? updatedQuestion : item))
                );
                setFilteredQuizItems((prev) =>
                    prev.map((item) => (item.questionId === updatedQuestion.questionId ? updatedQuestion : item))
                );
                message.success('Cập nhật câu hỏi thành công');
                setModalState((prev) => ({ ...prev, updateVisible: false, selectedQuestion: null }));
                form.resetFields();
                fetchQuizItems(currentPage, searchValue);
            } catch (error) {
                handleError(error);
            }
        },
        [currentPage, fetchQuizItems, form, handleError]
    );

    const handleDeleteConfirm = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            deleteVisible: false,
            selectedQuestionId: null,
        }));
        fetchQuizItems(currentPage, searchValue);
    }, [currentPage, fetchQuizItems]);

    const handleUpdateAnswersConfirm = useCallback(
        (updatedQuestion) => {
            setModalState((prev) => ({
                ...prev,
                updateVisible: false,
                selectedQuestion: null,
            }));
            if (updatedQuestion) {
                setQuizItems((prev) =>
                    prev.map((item) => (item.questionId === updatedQuestion.questionId ? updatedQuestion : item))
                );
                setFilteredQuizItems((prev) =>
                    prev.map((item) => (item.questionId === updatedQuestion.questionId ? updatedQuestion : item))
                );
            }
            fetchQuizItems(currentPage, searchValue);
        },
        [currentPage, fetchQuizItems]
    );

    const showDeleteModal = useCallback((questionId) => {
        setModalState((prev) => ({
            ...prev,
            deleteVisible: true,
            selectedQuestionId: questionId,
        }));
    }, []);

    const handleModalCancel = useCallback(() => {
        setModalState((prev) => ({
            ...prev,
            createVisible: false,
            updateVisible: false,
            deleteVisible: false,
            selectedQuestion: null,
            selectedQuestionId: null,
        }));
        form.resetFields();
    }, [form]);

    useEffect(() => {
        fetchQuizItems(currentPage, searchValue);
    }, [currentPage, fetchQuizItems, searchValue]);

    const columns = [
        { title: 'Question ID', dataIndex: 'questionId', key: 'questionId', width: 200, align: 'center' },
        { title: 'Category ID', dataIndex: 'cateQuestionId', key: 'cateQuestionId', width: 200, align: 'center' },
        {
            title: <div style={{ textAlign: 'center' }}>Question Content</div>,
            dataIndex: 'questionContent',
            key: 'questionContent',
            width: 400,
        },
        {
            title: 'Action',
            key: 'action',
            width: 200,
            align: 'center',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() =>
                            setModalState((prev) => ({ ...prev, updateVisible: true, selectedQuestion: record }))
                        }
                        style={{ color: '#D8959B' }}>
                        Cập Nhật
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        style={{ color: '#6A6A6A' }}
                        onClick={() => showDeleteModal(record.questionId)}>
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
                <div className="expanded-row-content" style={{ padding: '8px' }}>
                    {record.keyQuestions.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                    {leftQuestions.map((key, index) => (
                                        <li key={key.keyId} style={{ marginBottom: '10px' }}>
                                            <div
                                                style={{
                                                    borderBottom:
                                                        index < leftQuestions.length - 1 ? '1px solid #e8e8e8' : 'none',
                                                    paddingBottom: '10px',
                                                }}>
                                                <strong>• Answer ID:</strong> {key.keyId} <br />
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
                                        <li key={key.keyId} style={{ marginBottom: '10px' }}>
                                            <div
                                                style={{
                                                    borderBottom:
                                                        index < rightQuestions.length - 1
                                                            ? '1px solid #e8e8e8'
                                                            : 'none',
                                                    paddingBottom: '10px',
                                                }}>
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
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <div>
                <ManageOrderHeader
                    isModalOpen={modalState.updateVisible || modalState.createVisible || modalState.deleteVisible}
                />
            </div>
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <div>
                    <ManageOrderSidebar />
                </div>
                <div
                    style={{
                        flex: 1,
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        overflowY: 'auto',
                        marginLeft: '250px', // Matches ManageOrder
                    }}
                >
                    <div style={{ width: '100%', margin: '0' }}>
                        <h1 style={{ fontSize: '40px', textAlign: 'left', width: '100%', marginBottom: '16px' }}>
                            Quiz
                        </h1>
                        {error && (
                            <Alert
                                message="Error"
                                description={error}
                                type="error"
                                showIcon
                                style={{ marginBottom: '16px', width: '100%' }}
                            />
                        )}
                        <Row gutter={[16, 16]} style={{ marginBottom: '16px', width: '100%' }}>
                            <Col>
                                <Card
                                    style={{
                                        textAlign: 'left',
                                        width: '250px', 
                                        backgroundColor: '#FFFCFC',
                                        height: '120px',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <h2 style={{ fontSize: '18px', fontFamily: 'Nunito, sans-serif', margin: 0 }}>
                                        Tổng Câu Hỏi
                                    </h2>
                                    <p
                                        style={{
                                            fontSize: '25px', 
                                            color: '#C87E83',
                                            fontFamily: 'Nunito, sans-serif',
                                            margin: 0,
                                        }}
                                    >
                                        {total}
                                    </p>
                                </Card>
                            </Col>
                        </Row>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginBottom: '30px',
                                marginTop: '30px',
                                width: '100%',
                            }}
                        >
                            <Input
                                placeholder="Tìm kiếm câu hỏi ..."
                                value={searchInputValue}
                                onChange={handleInputChange}
                                style={{ width: '650px' }} // Matches ManageOrder search width
                                suffix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />}
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setModalState((prev) => ({ ...prev, createVisible: true }))}
                                style={{
                                    backgroundColor: '#D8959B',
                                    borderColor: '#D8959B',
                                    marginLeft: '30px',
                                }}
                            >
                                Tạo câu hỏi
                            </Button>
                        </div>
                        <div style={{ width: '100%' }}>
                            <Table
                                dataSource={filteredQuizItems}
                                columns={columns}
                                rowKey="questionId"
                                loading={loading}
                                pagination={false}
                                expandable={expandableConfig}
                                className="manage-quiz-table"
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '16px',
                                    width: '100%',
                                }}
                            >
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    position={['bottomCenter']} // Matches ManageOrder
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateQuestionModal
                visible={modalState.createVisible}
                onCancel={handleModalCancel}
                onCreate={handleCreate}
                form={form}
            />
            <UpdateQuestionModal
                visible={modalState.updateVisible}
                onCancel={handleModalCancel}
                onUpdate={handleUpdate}
                onUpdateAnswers={handleUpdateAnswersConfirm}
                selectedQuestion={modalState.selectedQuestion}
                form={form}
            />
            <DeleteQuestionModal
                visible={modalState.deleteVisible}
                onCancel={handleModalCancel}
                onDelete={handleDeleteConfirm}
                questionId={modalState.selectedQuestionId}
            />
        </div>
    );
}