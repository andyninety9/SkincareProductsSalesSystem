import PropTypes from 'prop-types';
import { Modal, Form, Input as AntInput, Button, Alert, message } from "antd";
import { useEffect, useState, useMemo } from "react";
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
    const [answersChanged, setAnswersChanged] = useState(false);
    const [questionChanged, setQuestionChanged] = useState(false);

    useEffect(() => {
        if (selectedQuestion) {
            form.setFieldsValue({
                questionContent: selectedQuestion.questionContent,
                cateQuestionId: selectedQuestion.cateQuestionId,
                keyQuestions: selectedQuestion.keyQuestions.map(({ keyContent, keyScore }) => ({
                    keyContent,
                    keyScore,
                })),
            });
            setError(null);
            setAnswersChanged(false);
            setQuestionChanged(false);
        }
    }, [selectedQuestion, form]);

    const handleFinish = async (values) => {
        try {
            setError(null);
            await onUpdate(values);
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to update question');
        }
    };

    const handleUpdateAnswers = async () => {
        try {
            setError(null);
            const values = form.getFieldsValue();
            const existingAnswers = values.keyQuestions.map((answer, index) => ({
                keyId: selectedQuestion.keyQuestions[index].keyId,
                keyContent: String(answer.keyContent || ''),
                keyScore: String(answer.keyScore || ''),
            }));

            for (const answer of existingAnswers) {
                console.log('Updating answer:', answer);
                await quizService.updateAnswer(answer);
            }
            message.success('Cập nhật câu trả lời thành công');
            onUpdateAnswers();
        } catch (error) {
            const errorResponse = error.response?.data || error.message;
            console.error('Full error response:', JSON.stringify(errorResponse, null, 2));
            setError(errorResponse?.detail || errorResponse?.message || 'Failed to update answers');
            message.error(error.message);
        }
    };

    const currentAnswers = Form.useWatch('keyQuestions', form) || [];
    const currentQuestionContent = Form.useWatch('questionContent', form) || '';
    const currentCateQuestionId = Form.useWatch('cateQuestionId', form) || '';

    const originalAnswers = useMemo(() =>
        selectedQuestion?.keyQuestions.map(({ keyContent, keyScore }) => ({
            keyContent,
            keyScore,
        })) || [],
        [selectedQuestion]
    );

    useEffect(() => {
        if (!selectedQuestion) return;

        const questionHasChanges =
            currentQuestionContent !== selectedQuestion.questionContent ||
            currentCateQuestionId !== selectedQuestion.cateQuestionId;
        setQuestionChanged(questionHasChanges);

        const hasAnswersChanges = currentAnswers.length !== originalAnswers.length ||
            currentAnswers.some((answer, index) => {
                const original = originalAnswers[index];
                return original && (
                    answer.keyContent !== original.keyContent ||
                    answer.keyScore !== original.keyScore
                );
            });
        setAnswersChanged(hasAnswersChanges);
    }, [currentAnswers, originalAnswers, selectedQuestion, currentQuestionContent, currentCateQuestionId]);

    const handleButtonClick = (e, callback) => {
        e.stopPropagation();
        callback();
    };

    return (
        <Modal
            title={<div style={{ fontSize: '30px', fontFamily: "'Nunito', sans-serif", textAlign: 'center' }}>Cập Nhật Câu Hỏi</div>}
            width={600}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            zIndex={1100}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
            keyboard={true}
            maskClosable={false}
        >
            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                    name="questionContent"
                    label="Nội dung câu hỏi"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                    style={{ color: '#5A2D2F', fontWeight: 'bold', fontSize: '16px', fontFamily: "'Nunito', sans-serif" }}
                >
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0" }}
                    />
                </Form.Item>

                <Form.Item
                    name="cateQuestionId"
                    label="Category ID"
                    rules={[
                        { required: true, message: 'Vui lòng nhập Category ID!' },
                        { type: 'string', pattern: /^[1-4]$/, message: 'Category ID must be a string between 1 and 4!' },
                    ]}
                    style={{ color: '#5A2D2F', fontWeight: 'bold' }}
                >
                    <AntInput
                        style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0", width: '30%' }}
                    />
                </Form.Item>

                <Form.List name="keyQuestions">
                    {(fields, { remove }) => (
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
                                    <Button
                                        onClick={(e) => handleButtonClick(e, () => remove(name))}
                                        style={{ padding: '4px 10px', borderRadius: '10px', border: '1px solid #5A2D2F', backgroundColor: '#F6EEF0', color: '#5A2D2F', fontWeight: 'bold', fontSize: '13px' }}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            ))}
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button
                        style={{
                            width: '60%',
                            margin: '0 auto 10px',
                            backgroundColor: questionChanged ? '#C87E83' : '#d9d9d9',
                            borderColor: questionChanged ? '#C87E83' : '#d9d9d9',
                            color: questionChanged ? '#fff' : '#999',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        htmlType="submit"
                        disabled={!questionChanged}
                    >
                        Cập nhật câu hỏi
                    </Button>
                    <Button
                        style={{
                            width: '60%',
                            margin: '0 auto',
                            backgroundColor: answersChanged ? '#D8959A' : '#d9d9d9',
                            borderColor: answersChanged ? '#D8959A' : '#d9d9d9',
                            color: answersChanged ? '#fff' : '#999',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onClick={(e) => handleButtonClick(e, handleUpdateAnswers)}
                        disabled={!answersChanged}
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