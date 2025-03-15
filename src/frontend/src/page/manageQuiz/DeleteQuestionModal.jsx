import { Modal, message } from "antd";
import PropTypes from "prop-types";
import quizService from "../../component/quizService/quizService";

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
            aria-labelledby="delete-question-modal-title"
        >
            <p
                style={{
                    textAlign: "center",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: "16px",
                    color: "#5A2D2F",
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