import { Modal, message } from "antd";
import PropTypes from "prop-types";
import quizService from "../../component/quizService/quizService";

const DeleteQuestionModal = ({ visible, onCancel, onDelete, questionId, type = "question" }) => {
    const isQuestion = type === "question";
    const titleText = isQuestion ? "Xác nhận xóa câu hỏi" : "Xác nhận xóa câu trả lời";
    const bodyText = isQuestion
        ? "Bạn có chắc chắn muốn xóa câu hỏi này không?"
        : "Bạn có chắc chắn muốn xóa câu trả lời này không?";
    const successMessage = isQuestion ? "Xóa câu hỏi thành công" : "Xóa câu trả lời thành công";

    const handleDelete = async () => {
        try {
            console.log(`Deleting ${type} with questionId:`, questionId);
            let response;
            if (isQuestion) {
                if (!questionId) {
                    throw new Error('Question ID is missing');
                }
                response = await quizService.deleteQuestion(questionId);
            } else {
                if (!questionId) {
                    throw new Error('Answer ID is missing');
                }
                response = await quizService.deleteAnswer(questionId);
            }
            console.log(`${type} deletion response:`, response);
            if (response === undefined || response === null || Object.keys(response).length === 0 || response.success !== false) {
                message.success(successMessage);
                onDelete();
            } else {
                throw new Error(response.message || 'Deletion failed according to response');
            }
        } catch (error) {
            console.error('Deletion error:', error.message);
            message.error(error.message || 'Failed to delete');
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
    questionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, // Changed from id to questionId
    type: PropTypes.oneOf(["question", "answer"]),
};

DeleteQuestionModal.defaultProps = {
    type: "question",
};

export default DeleteQuestionModal;