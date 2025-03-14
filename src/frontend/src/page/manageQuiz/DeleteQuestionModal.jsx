import { Modal, message } from "antd";
import PropTypes from "prop-types";
import quizService from "../../component/quizService/quizService"; // Adjust the path as necessary

const DeleteQuestionModal = ({ visible, onCancel, onDelete, questionId }) => {
    const handleDelete = async () => {
        try {
            await quizService.deleteQuestion(questionId);
            message.success("Xóa câu hỏi thành công");
            onDelete();
        } catch (error) {
            message.error(error.message);
        }
    };

    // Stop event propagation on modal clicks to prevent affecting parent elements
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
                        color: "#5A2D2F", // Match color scheme
                    }}
                >
                    Xác nhận xóa câu hỏi
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
                    backgroundColor: "#FFFFFF", // White background for cancel
                    color: "#5A2D2F",
                    borderColor: "#5A2D2F",
                    fontFamily: "Nunito, sans-serif",
                    fontWeight: "bold",
                },
            }}
            onClick={handleModalClick} // Stop propagation on modal clicks
            keyboard={true} // Allow keyboard navigation (e.g., Esc to close)
            maskClosable={false} // Prevent closing modal by clicking outside (optional, for better focus control)
            zIndex={1100} // Ensure modal is above other elements
            bodyStyle={{
                padding: "16px", // Consistent padding
            }}
            width={400} // Set a reasonable width for the modal
            aria-labelledby="delete-question-modal-title" // Accessibility: Link title to modal
        >
            <p
                style={{
                    textAlign: "center",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "16px",
                    color: "#5A2D2F", // Match color scheme
                }}
            >
                Bạn có chắc chắn muốn xóa câu hỏi này không?
            </p>
        </Modal>
    );
};

DeleteQuestionModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    questionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default DeleteQuestionModal;