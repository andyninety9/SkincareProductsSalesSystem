import PropTypes from 'prop-types';
import { Modal, Form, Input as AntInput, Button, Row, Col, Alert, message } from "antd";
import { useEffect, useState } from "react";
import quizService from "../../component/quizService/quizService";

const { TextArea } = AntInput;

const UpdateQuestionModal = ({
    visible,
    onCancel,
    onUpdate,
    onUpdateAnswers,
    selectedQuestion,
    form,
}) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedQuestion) {
            form.setFieldsValue({
                questionContent: selectedQuestion.questionContent,
                cateQuestionId: selectedQuestion.cateQuestionId,
                keyQuestions: selectedQuestion.keyQuestions.map(k => ({
                    keyContent: k.keyContent,
                    keyScore: k.keyScore,
                })),
            });
            setError(null);
        }
    }, [selectedQuestion, form]);

    const handleFinish = async (values) => {
        try {
            setError(null);
            await onUpdate(values);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update question';
            setError(errorMessage);
        }
    };

    const handleUpdateAnswers = async () => {
        try {
            setError(null);
            const values = form.getFieldsValue();
            const updatedAnswers = values.keyQuestions.map((answer, index) => {
                const originalAnswer = selectedQuestion.keyQuestions[index];
                return {
                    keyId: originalAnswer?.keyId ? String(originalAnswer.keyId) : null,
                    keyContent: String(answer.keyContent || ''),
                    keyScore: String(answer.keyScore || ''),
                };
            });

            // Filter existing answers (with keyId) and handle new ones separately if needed
            const existingAnswers = updatedAnswers.filter(answer => answer.keyId !== null);
            if (existingAnswers.length === 0) {
                throw new Error('No existing answers to update');
            }

            for (const answer of existingAnswers) {
                console.log('Updating answer:', answer);
                await quizService.updateAnswer(answer); // Pass only the answer object
            }
            // Note: New answers (keyId: null) are ignored here; see below for creation logic if needed
            message.success('Cập nhật câu trả lời thành công');
            onUpdateAnswers();
        } catch (error) {
            const errorResponse = error.response?.data || error.message;
            console.error('Full error response:', JSON.stringify(errorResponse, null, 2));
            const errorMessage = errorResponse?.detail || errorResponse?.message || 'Failed to update answers';
            setError(errorMessage);
            message.error(errorMessage);
        }
    };

    const handleModalClick = (e) => e.stopPropagation();
    const handleButtonClick = (e, callback) => {
        e.stopPropagation();
        callback();
    };

    // Rest of the component (Form, JSX) remains unchanged
    return (
        <Modal
            title={<div style={{ fontSize: '30px', fontFamily: "'Nunito', sans-serif", textAlign: 'center' }}>Cập Nhật Câu Hỏi</div>}
            width={600}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            zIndex={1100}
            onClick={handleModalClick}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
            keyboard={true}
            maskClosable={false}
        >
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '16px' }}
                />
            )}
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                    style={{ color: '#5A2D2F', fontWeight: 'bold', fontSize: '16px', fontFamily: "'Nunito', sans-serif" }}
                    name="questionContent"
                    label="Nội dung câu hỏi"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                >
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0" }}
                    />
                </Form.Item>

                <Form.Item
                    style={{ color: '#5A2D2F', fontWeight: 'bold' }}
                    name="cateQuestionId"
                    label="Category ID"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Category ID!' },
                        { type: 'string', pattern: /^[1-4]$/, message: 'Category ID must be a string between 1 and 4!' },
                    ]}
                >
                    <AntInput
                        style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0", width: '30%' }}
                    />
                </Form.Item>

                <Form.List name="keyQuestions">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', marginBottom: '30px' }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'keyContent']}
                                        label="Câu trả lời"
                                        rules={[{ required: true, message: 'Vui lòng nhập câu trả lời!' }]}
                                        style={{ marginBottom: 0, color: '#5A2D2F' }}
                                    >
                                        <TextArea
                                            rows={4}
                                            autoSize={{ minRows: 1, maxRows: 5 }}
                                            style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'keyScore']}
                                        label="Điểm"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điểm!' }]}
                                        style={{ marginBottom: 0, color: '#5A2D2F' }}
                                    >
                                        <AntInput
                                            placeholder="Điểm"
                                            style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0" }}
                                        />
                                    </Form.Item>
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'left' }}>
                                        <Button
                                            onClick={(e) => handleButtonClick(e, () => remove(name))}
                                            style={{ margin: 0, padding: '4px 10px', borderRadius: '10px', border: '1px solid #5A2D2F', backgroundColor: '#F6EEF0', color: '#5A2D2F', fontWeight: 'bold', fontSize: '13px' }}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button
                                style={{ width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', marginBottom: '10px', backgroundColor: '#D8959A', borderColor: '#D8959A', color: '#fff', borderRadius: '10px' }}
                                onClick={(e) => handleButtonClick(e, add)}
                                block
                            >
                                Thêm câu trả lời
                            </Button>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button
                        style={{ width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', marginBottom: '10px', backgroundColor: '#C87E83', borderColor: '#C87E83', color: '#fff', borderRadius: '10px' }}
                        htmlType="submit"
                        onClick={handleModalClick}
                    >
                        Cập nhật câu hỏi
                    </Button>
                    <Button
                        style={{ width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto', backgroundColor: '#D8959A', borderColor: '#D8959A', color: '#fff', borderRadius: '10px' }}
                        onClick={(e) => handleButtonClick(e, handleUpdateAnswers)}
                    >
                        Cập nhật câu trả lời
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

UpdateQuestionModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onUpdateAnswers: PropTypes.func.isRequired,
    selectedQuestion: PropTypes.shape({
        questionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        questionContent: PropTypes.string.isRequired,
        cateQuestionId: PropTypes.string.isRequired,
        keyQuestions: PropTypes.arrayOf(
            PropTypes.shape({
                keyId: PropTypes.string.isRequired,
                keyContent: PropTypes.string.isRequired,
                keyScore: PropTypes.string.isRequired,
            })
        ).isRequired,
    }),
    form: PropTypes.object.isRequired,
};

export default UpdateQuestionModal;