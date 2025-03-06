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
                            width: '500px',
                            minHeight: '60px',
                            padding: '12px 16px',
                            marginBottom: '10px',
                            borderRadius: '8px',
                            border: '1px solid #D8959A',
                            backgroundColor: selectedAnswer === answer.keyId ? '#D8959A' : '#FFF', // ✅ Đổi cách so sánh
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
                        }}
                        onClick={() => handleAnswerSelect(answer.keyId)} 
                    >
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

                <Button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    style={{
                        width: '50%',
                        height: '50px',
                        marginTop: '16px',
                        backgroundColor: selectedAnswer === null ? 'mistyrose' : '#D8959A',
                        color: selectedAnswer === null ? 'darkgray' : '#FFF',
                        border: 'none',
                        cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease',
                    }}>
                    <span style={{ backgroundColor: 'transparent' }}>Tiếp theo</span>
                </Button>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                        marginTop: '16px',
                    }}>
                    {answeredQuestions.map((id, index) => (
                        <HeartFilled key={index} style={{ color: '#E57373', fontSize: '24px' }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
