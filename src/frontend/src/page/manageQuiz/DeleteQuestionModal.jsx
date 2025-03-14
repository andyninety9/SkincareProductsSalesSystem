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

    return (
        <Modal
            title="Xác nhận xóa câu hỏi"
            visible={visible}
            onOk={handleDelete}
            onCancel={onCancel}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
        >
            <p>Bạn có chắc chắn muốn xóa câu hỏi này không?</p>
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