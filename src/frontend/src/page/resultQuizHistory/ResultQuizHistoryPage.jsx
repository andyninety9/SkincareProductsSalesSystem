import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Button, Space, Spin, Input, Empty, Typography, Divider, Pagination } from 'antd';
import { EyeOutlined, SearchOutlined, CalendarOutlined, HistoryOutlined } from '@ant-design/icons';
import api from '../../config/api';
import './ResultQuizHistoryPage.css';
import QuizDetailModal from '../quizPage/QuizDetailModal';

const { Title } = Typography;

export default function ResultQuizHistoryPage() {
    const [quizHistory, setQuizHistory] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [quizDetail, setQuizDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const handleViewQuizDetails = async (quizId) => {
        setSelectedQuizId(quizId);
        setModalVisible(true);
        setLoadingDetail(true);

        try {
            const response = await api.get('/skintest/result', {
                params: { quizId },
            });

            if (response.status === 200 && response.data.statusCode === 200) {
                setQuizDetail(response.data.data);
            } else {
                console.error('Error fetching quiz details:', response);
                setQuizDetail(null);
            }
        } catch (error) {
            console.error('Error fetching quiz details:', error);
            setQuizDetail(null);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleFetchQuizHistory = async (keyword = searchKeyword) => {
        try {
            setLoading(true);
            const response = await api.get(
                `user/quiz-history?page=${pagination.current}&pageSize=${pagination.pageSize}${
                    keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''
                }`
            );

            if (response.status === 200) {
                const { items, totalItems, page, pageSize, totalPages } = response.data.data;

                // Sort by date (newest first) before processing
                const sortedItems = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                const processedItems = sortedItems.map((item) => ({
                    ...item,
                    key: item.quizId.toString(),
                }));

                setQuizHistory(processedItems);
                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: totalItems,
                });
                setLoading(false);
            } else {
                console.error('Error fetching quiz history:', response);
                setQuizHistory([]);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching quiz history:', error);
            setQuizHistory([]);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            setSearchKeyword(value);
            setPagination((prev) => ({
                ...prev,
                current: 1,
            }));
            handleFetchQuizHistory(value);
        }, 500);

        setSearchTimeout(timeout);
    };

    useEffect(() => {
        handleFetchQuizHistory();
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [pagination.current]);
    return (
        <Container fluid className="quiz-history-container">
            <Card className="history-card">
                <Card.Body>
                    <div className="header-container">
                        <div className="title-section">
                            <Title level={2} className="page-title">
                                <HistoryOutlined className="title-icon" /> Lịch sử kiểm tra da
                            </Title>
                            <p style={{textAlign:"center"}} className="subtitle">Xem lại các bài kiểm tra da đã thực hiện</p>
                        </div>
    
                        <div className="search-container">
                            <Input
                                placeholder="Tìm kiếm bài kiểm tra..."
                                prefix={<SearchOutlined />}
                                onChange={handleSearch}
                                allowClear
                                className="search-input"
                                size="large"
                            />
                        </div>
                    </div>
    
                    <Divider />
    
                    <div className="card-container">
                        {loading ? (
                            <Spin size="large" />
                        ) : quizHistory.length === 0 ? (
                            <Empty description="Không tìm thấy bài kiểm tra nào" />
                        ) : (
                            <Row>
                                {quizHistory.map((quiz) => (
                                    <Col xs={12} sm={6} md={4} lg={3} key={quiz.key} className="quiz-card-column">
                                        <Card className="quiz-card">
                                            <Card.Body>
                                                <Card.Title>{quiz.quizName}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    <CalendarOutlined style={{ marginRight: '8px' }} />
                                                    {new Date(quiz.createdAt).toLocaleDateString('vi-VN')}
                                                </Card.Subtitle>
                                                <Card.Text>{quiz.quizDesc}</Card.Text>
                                                <Button
                                                    type="primary"
                                                    icon={<EyeOutlined />}
                                                    onClick={() => handleViewQuizDetails(quiz.quizId)}
                                                >
                                                    Xem chi tiết
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
    
                    {/* Phân trang */}
                    <Pagination
                        current={pagination.current}
                        pageSize={pagination.pageSize}
                        total={pagination.total}
                        onChange={(page) => {
                            setPagination((prev) => ({
                                ...prev,
                                current: page,
                            }));
                        }}
                        showSizeChanger={false}
                        showTotal={(total) => `Tổng cộng ${total} kết quả`}
                    />
    
                    <QuizDetailModal
                        visible={modalVisible}
                        onClose={handleCloseModal}
                        quizData={quizDetail}
                        loading={loadingDetail}
                    />
                </Card.Body>
            </Card>
        </Container>
    );
    
}
