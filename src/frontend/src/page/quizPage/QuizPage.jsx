import { Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { HeartFilled, HeartOutlined, LogoutOutlined } from "@ant-design/icons";
import axios from "axios";



const questions = [
    {
        question: "Mô tả câu hỏi 1",
        answers: ["Câu trả lời 1", "Câu trả lời 2", "Câu trả lời 3", "Câu trả lời 4"],
        correct: 3,
    },
    {
        question: "Mô tả câu hỏi 2",
        answers: ["A", "B", "C", "D"],
        correct: 1,
    },
];

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [isExitModalVisible, setIsExitModalVisible] = useState(false);

    const handleNext = () => {
        if (selectedAnswer !== null) {
            setAnsweredQuestions([...answeredQuestions, currentQuestion]);
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(null);
        }
    };

    const showExitModal = () => {
        setIsExitModalVisible(true);
    };

    const handleExitConfirm = () => {
        setIsExitModalVisible(false);
        console.log("User exited the quiz");
    };

    const handleExitCancel = () => {
        setIsExitModalVisible(false);
    };

    

    async function fetchNextQuestion() {
        const response = await axios.get("www.mavid.store/api/skintest/start?quizname=Kiểm tra da lần 1&quizdesc=Làm thử");
        console.log(response);
    }

    useEffect(() => {fetchNextQuestion()}, []);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#F6EEF0",
            height: "auto"
        }}>
            <Button
                style={{ position: "absolute", top: "30px", right: "20px", backgroundColor: "transparent", border: "none" }}
                icon={<LogoutOutlined style={{ fontSize: "24px", color: "#E57373" }} />}
                onClick={showExitModal}
            />

            <Modal
                title="Xác nhận thoát"
                visible={isExitModalVisible}
                onOk={handleExitConfirm}
                onCancel={handleExitCancel}
                okText="Có"
                cancelText="Không"
                okButtonProps={{ style: { backgroundColor: "#E57373", borderColor: "#E57373" } }}
                cancelButtonProps={{ style: { backgroundColor: "#F6EEF0", borderColor: "#E57373", color: "#E57373" } }}
            >
                <p>Bạn có chắc muốn thoát bài test?</p>
            </Modal>
            <div style={{
                padding: "24px",
                borderRadius: "12px",
                width: "500px",
                textAlign: "center"
            }}>
                <h2 style={{
                    fontSize: "30px",
                    fontWeight: "bolder",
                    marginBottom: "8px"
                }}>Câu hỏi</h2>
                <p style={{
                    color: "#555",
                    marginBottom: "16px"
                }}>{questions[currentQuestion].question}</p>

                {questions[currentQuestion].answers.map((answer, index) => (
                    <button
                        key={index}
                        style={{
                            display: "block",
                            width: "500px",
                            height: "50px",
                            padding: "8px 16px",
                            marginBottom: "8px",
                            borderRadius: "6px",
                            border: "1px solid #D8959A",
                            backgroundColor: selectedAnswer === index ? "#D8959A" : "#FFF",
                            color: selectedAnswer === index ? "#FFF" : "#333",
                            cursor: "pointer"
                        }}
                        onClick={() => setSelectedAnswer(index)}
                    >
                        {answer}
                    </button>
                ))}

                <Button
                    onClick={handleNext}
                    disabled={selectedAnswer === null}
                    style={{
                        width: "50%", height: "50px", marginTop: "16px",
                        backgroundColor: selectedAnswer === null ? "mistyrose" : "#D8959A",
                        color: selectedAnswer === null ? "darkgray" : "#FFF",
                        border: "none", cursor: selectedAnswer === null ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        if (selectedAnswer !== null) e.target.style.backgroundColor = "#E57373";
                    }}
                    onMouseLeave={(e) => {
                        if (selectedAnswer !== null) e.target.style.backgroundColor = "#D8959A";
                    }}
                    onMouseDown={(e) => {
                        if (selectedAnswer !== null) e.target.style.backgroundColor = "#C76A6A";
                    }}
                    onMouseUp={(e) => {
                        if (selectedAnswer !== null) e.target.style.backgroundColor = "#E57373";
                    }}
                >
                    <span style={{ backgroundColor: "transparent" }}>Tiếp theo</span>
                </Button>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "16px"
                }}>
                    {questions.map((_, index) => (
                        <span
                            key={index}
                            style={{
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                position: "relative"
                            }}
                        >
                            {answeredQuestions.includes(index) ? (
                                <HeartFilled style={{ color: "#E57373", fontSize: "24px" }} />
                            ) : (
                                <HeartOutlined style={{ color: "#E57373", fontSize: "24px" }} />
                            )}
                            <span style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color: "#333"
                            }}>
                                {index + 1}
                            </span>
                        </span>
                    ))}
                </div>
                <p style={{
                    marginTop: "16px",
                    cursor: currentQuestion === 0 ? "default" : "pointer",
                    color: currentQuestion === 0 ? "#D3D3D3" : "#E57373",
                    fontWeight: "bold"
                }}
                onClick={currentQuestion === 0 ? undefined : handlePrevious}>
                    ← Câu hỏi trước
                </p>
            </div>
        </div>
    );
}
