import { Modal, message } from "antd";
import PropTypes from "prop-types";
import quizService from "../../component/quizService/quizService";

const DeleteQuestionModal = ({ visible, onCancel, onDelete, id, type = "question" }) => {
    const isQuestion = type === "question";
    const titleText = isQuestion ? "Xác nhận xóa câu hỏi" : "Xác nhận xóa câu trả lời";
    const bodyText = isQuestion
        ? "Bạn có chắc chắn muốn xóa câu hỏi này không?"
        : "Bạn có chắc chắn muốn xóa câu trả lời này không?";
    const successMessage = isQuestion ? "Xóa câu hỏi thành công" : "Xóa câu trả lời thành công";

    const handleDelete = async () => {
        try {
            if (isQuestion) {
                await quizService.deleteQuestion(id);
            } else {
                await quizService.deleteAnswer(id);
            }
            message.success(successMessage);
            onDelete();
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <Modal
            title={
                <div
                    style={{
                        textAlign: "center",
                        fontFamily: "Nunito, sans-serif",
                        fontSize: "25px",
                        fontWeight: "bold",
                        color: "#5A2D2F",
                    }}
                >
                    {titleText}
                </div>
            }
            visible={visible}
            onOk={handleDelete}
            onCancel={onCancel}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{
                style: {
                    backgroundColor: "#F6EEF0",
                    color: "#5A2D2F",
                    borderColor: "#5A2D2F",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: "bold",
                },
            }}
            cancelButtonProps={{
                style: {
                    backgroundColor: "#FFFFFF",
                    color: "#5A2D2F",
                    borderColor: "#5A2D2F",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: "bold",
                },
            }}
            onClick={handleModalClick}
            keyboard={true}
            maskClosable={false}
            zIndex={1100}
            bodyStyle={{
                padding: "16px",
            }}
            width={400}
            aria-labelledby="delete-modal-title"
        >
            <p
                style={{
                    textAlign: "center",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "16px",
                    color: "#5A2D2F",
                }}
            >
                {bodyText}
            </p>
        </Modal>
    );
};

DeleteQuestionModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(["question", "answer"]), // New prop to specify type
};

DeleteQuestionModal.defaultProps = {
    type: "question", // Default to question deletion
};

export default DeleteQuestionModal;