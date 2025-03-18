import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { HeartFilled, HeartOutlined, LogoutOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { nextQuestion, resetQuiz, saveAnswer } from '../../redux/feature/quizSlice';
import api from '../../config/api';

export default function QuizPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quizData = useSelector((state) => state.quiz);
    const [currentQuestion, setCurrentQuestion] = useState(quizData || JSON.parse(localStorage.getItem('quizData')));
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isExitModalVisible, setIsExitModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!quizData || !quizData.questionId) {
            const savedQuiz = JSON.parse(localStorage.getItem('quizData'));
            if (savedQuiz) {
                setCurrentQuestion(savedQuiz);
                console.log(savedQuiz);
            } else {
                toast.error('Không tìm thấy dữ liệu quiz!');
                navigate('/');
            }
        }
    }, [quizData, navigate]);

    useEffect(() => {
        if (currentQuestion) {
            localStorage.setItem('quizData', JSON.stringify(currentQuestion));
        }
    }, [currentQuestion]);

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNext = async () => {
        if (selectedAnswer !== null) {
            setIsLoading(true); // Start loading
            try {
                const response = await api.get('/skintest/next', {
                    params: {
                        quizId: quizData.quizId,
                        questionId: quizData.questionId,
                        answerKeyId: selectedAnswer,
                    },
                });
                if (response.data.statusCode === 200) {
                    const nextQuestionData = response.data.data;
                    dispatch(nextQuestion(nextQuestionData));
                    dispatch(saveAnswer({ keyId: selectedAnswer, keyScore: nextQuestionData.keyScore }));
                    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
                    setCurrentQuestion(nextQuestionData);
                    setSelectedAnswer(null);

                    if (nextQuestionData.isFinalQuestion) {
                        toast.success('Bạn đã hoàn thành quá trình kiểm tra da!');
                        dispatch(resetQuiz());
                        // localStorage.removeItem('quizData');
                        navigate('/your-skin-type-result');
                    }
                } else {
                    toast.error('Không thể lưu câu trả lời, vui lòng thử lại sau');
                }
            } catch (error) {
                console.error('Lỗi khi tải câu hỏi tiếp theo:', error);
                toast.error('Lỗi kết nối, vui lòng thử lại.');
            } finally {
                setIsLoading(false); // End loading regardless of success or failure
            }
        }
    };

    const showExitModal = () => {
        setIsExitModalVisible(true);
    };

    const handleExitConfirm = () => {
        setIsExitModalVisible(false);
        dispatch(resetQuiz());
        localStorage.removeItem('quizData');
        navigate('/');
    };

    const handleExitCancel = () => {
        setIsExitModalVisible(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#F6EEF0',
                height: 'auto',
            }}>
            <Button
                style={{
                    position: 'absolute',
                    top: '30px',
                    right: '20px',
                    backgroundColor: 'transparent',
                    border: 'none',
                }}
                icon={<LogoutOutlined style={{ fontSize: '24px', color: '#E57373' }} />}
                onClick={showExitModal}
            />

            <Modal
                title="Xác nhận thoát"
                visible={isExitModalVisible}
                onOk={handleExitConfirm}
                onCancel={handleExitCancel}
                okText="Có"
                cancelText="Không"
                okButtonProps={{ style: { backgroundColor: '#E57373', borderColor: '#E57373' } }}
                cancelButtonProps={{ style: { backgroundColor: '#F6EEF0', borderColor: '#E57373', color: '#E57373' } }}>
                <p>Bạn có chắc muốn thoát bài test?</p>
            </Modal>

            <div
                style={{
                    padding: '24px',
                    borderRadius: '12px',
                    width: '500px',
                    textAlign: 'center',
                }}>
                <h2
                    style={{
                        fontSize: '30px',
                        fontWeight: 'bolder',
                        marginBottom: '8px',
                    }}>
                    Câu hỏi
                </h2>
                <p
                    style={{
                        color: '#555',
                        marginBottom: '16px',
                    }}>
                    {currentQuestion?.questionText}
                </p>

                {currentQuestion?.keyQuestions.slice(0, 4).map((answer, index) => (
                    <button
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            minHeight: '60px',
                            padding: '12px 16px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            border: '1px solid #D8959A',
                            backgroundColor: selectedAnswer === answer.keyId ? '#D8959A' : '#FFF',
                            color: selectedAnswer === answer.keyId ? '#FFF' : '#333',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'center',
                            wordWrap: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            boxShadow: selectedAnswer === answer.keyId ? '0 4px 8px rgba(216, 149, 154, 0.3)' : 'none',
                            transform: selectedAnswer === answer.keyId ? 'translateY(-2px)' : 'none',
                            ':hover': {
                                backgroundColor: selectedAnswer === answer.keyId ? '#D8959A' : '#FFF0F0',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(229, 115, 115, 0.2)',
                            },
                        }}
                        onMouseOver={(e) => {
                            if (selectedAnswer !== answer.keyId) {
                                e.currentTarget.style.backgroundColor = '#FFF0F0';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(229, 115, 115, 0.2)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedAnswer !== answer.keyId) {
                                e.currentTarget.style.backgroundColor = '#FFF';
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                            }
                        }}
                        onClick={() => handleAnswerSelect(answer.keyId)}>
                        <span
                            style={{
                                maxWidth: '100%',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                textAlign: 'center',
                                padding: '5px',
                            }}>
                            {answer.keyContent}
                        </span>
                    </button>
                ))}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        marginTop: '24px',
                    }}>
                    <Button
                        onClick={handleNext}
                        disabled={selectedAnswer === null || isLoading}
                        loading={isLoading}
                        style={{
                            width: '50%',
                            height: '50px',
                            backgroundColor: selectedAnswer === null ? 'mistyrose' : '#D8959A',
                            color: selectedAnswer === null ? 'darkgray' : '#FFF',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: selectedAnswer === null || isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: selectedAnswer === null ? 'none' : '0 4px 8px rgba(216, 149, 154, 0.3)',
                            fontWeight: '500',
                            fontSize: '16px',
                        }}
                        onMouseOver={(e) => {
                            if (selectedAnswer !== null && !isLoading) {
                                e.currentTarget.style.backgroundColor = '#C57F84';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(229, 115, 115, 0.3)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedAnswer !== null && !isLoading) {
                                e.currentTarget.style.backgroundColor = '#D8959A';
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(216, 149, 154, 0.3)';
                            }
                        }}>
                        <span style={{ backgroundColor: 'transparent' }}>{isLoading ? 'Đang xử lý' : 'Tiếp theo'}</span>
                    </Button>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '20px',
                        width: '100%',
                        flexWrap: 'wrap',
                        padding: '0 10px',
                    }}>
                    {/* Answered questions */}
                    {answeredQuestions.map((id, index) => (
                        <HeartFilled key={index} style={{ color: '#E57373', fontSize: '24px' }} />
                    ))}

                    {/* Current question */}
                    <HeartFilled
                        style={{
                            color: '#FFB6C1',
                            fontSize: '28px',
                            filter: 'drop-shadow(0 0 3px rgba(229, 115, 115, 0.5))',
                            animation: 'pulse 1.5s infinite',
                        }}
                    />

                    {/* Add this style in your component or in a CSS file */}
                    <style>{`
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .progress-bar {
            height: 8px;
            border-radius: 4px;
            background-color: #FFE0E0;
            position: relative;
            overflow: hidden;
            transition: all 0.5s ease;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.5s ease;
        }
    `}</style>
                </div>

                {/* Add Skin Analysis Section */}
                {currentQuestion?.resultQuiz && (
                    <div
                        style={{
                            marginTop: '30px',
                            padding: '15px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(216, 149, 154, 0.2)',
                        }}>
                        <h3
                            style={{
                                fontSize: '18px',
                                color: '#D8959A',
                                marginBottom: '15px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}>
                            Phân tích da của bạn
                        </h3>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px' }}>Độ dầu</span>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                    {currentQuestion.resultQuiz.odscore <= 5 ? 'Da khô' : 'Da dầu'}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${(currentQuestion.resultQuiz.odscore / 10) * 100}%`,
                                        backgroundColor: '#FFB6C1',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px' }}>Độ nhạy cảm</span>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                    {currentQuestion.resultQuiz.srscore <= 5 ? 'Ít nhạy cảm' : 'Nhạy cảm'}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${(currentQuestion.resultQuiz.srscore / 10) * 100}%`,
                                        backgroundColor: '#E57373',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px' }}>Độ sắc tố</span>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                    {currentQuestion.resultQuiz.pnpscore <= 5 ? 'Ít sắc tố' : 'Nhiều sắc tố'}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${(currentQuestion.resultQuiz.pnpscore / 10) * 100}%`,
                                        backgroundColor: '#D8959A',
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '14px' }}>Độ lão hóa</span>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                                    {currentQuestion.resultQuiz.wtscore <= 5 ? 'Ít nếp nhăn' : 'Nhiều nếp nhăn'}
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${(currentQuestion.resultQuiz.wtscore / 10) * 100}%`,
                                        backgroundColor: '#C57F84',
                                    }}
                                />
                            </div>
                        </div>

                        <p
                            style={{
                                fontSize: '12px',
                                color: '#888',
                                marginTop: '15px',
                                textAlign: 'center',
                                fontStyle: 'italic',
                            }}>
                            Kết quả sẽ được cập nhật khi bạn trả lời thêm câu hỏi
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
