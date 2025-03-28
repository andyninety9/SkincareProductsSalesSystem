import PropTypes from 'prop-types';
import { Modal, Form, Input as AntInput, Button, Alert, message, Col, Row, Divider } from "antd";
import { useEffect, useState, useMemo } from "react";
import quizService from "../../component/quizService/quizService";
import DeleteQuestionModal from './DeleteQuestionModal';

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
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [answerToDelete, setAnswerToDelete] = useState(null);

    useEffect(() => {
        if (selectedQuestion) {
            form.setFieldsValue({
                questionId: String(selectedQuestion.questionId),
                questionContent: selectedQuestion.questionContent,
                cateQuestionId: selectedQuestion.cateQuestionId,
                keyQuestions: selectedQuestion.keyQuestions.map(({ keyId, keyContent, keyScore }) => ({
                    keyId,
                    keyContent,
                    keyScore,
                })),
            });
            setError(null);
            setAnswersChanged(false);
            setQuestionChanged(false);
        }
    }, [selectedQuestion, form]);

    const validateQuestionId = async (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Vui lòng nhập Question ID!'));
        }
        if (!/^\d+$/.test(value)) {
            return Promise.reject(new Error('Question ID phải là số!'));
        }
        try {
            const response = await quizService.checkQuestionId(value);
            if (response.exists && value !== String(selectedQuestion?.questionId)) {
                return Promise.reject(new Error('Question ID đã tồn tại!'));
            }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error('Không thể kiểm tra Question ID!'));
        }
    };

    const handleFinish = async (values) => {
        try {
            setError(null);
            const payload = {
                questionId: (values.questionId !== undefined && values.questionId !== '')
                    ? String(values.questionId)
                    : String(selectedQuestion.questionId),
                cateQuestionId: (values.cateQuestionId !== undefined && values.cateQuestionId !== '')
                    ? String(values.cateQuestionId)
                    : String(selectedQuestion.cateQuestionId),
                questionContent: (values.questionContent !== undefined && values.questionContent !== null)
                    ? String(values.questionContent)
                    : String(selectedQuestion.questionContent || ''),
            };
            console.log('Sending payload to updateQuestion:', JSON.stringify(payload, null, 2));
            const response = await quizService.updateQuestion(payload);
            console.log('Received response from updateQuestion:', JSON.stringify(response, null, 2));
            message.success('Cập nhật câu hỏi thành công');
            onUpdate(response);
        } catch (error) {
            const errorResponse = error.response?.data || error.message;
            console.error('Error in handleFinish:', JSON.stringify(errorResponse, null, 2));
            setError(errorResponse?.message || 'Failed to update question');
            message.error('Cập nhật câu hỏi thất bại');
        }
    };

    const handleUpdateAnswers = async () => {
        try {
            setError(null);
            const values = form.getFieldsValue();
            const existingAnswers = selectedQuestion.keyQuestions;
            const currentAnswers = values.keyQuestions || [];

            const updatedAnswers = [];
            const deletedAnswerIds = existingAnswers
                .filter((ea) => !currentAnswers.some((ca) => ca.keyId === ea.keyId))
                .map((ea) => ea.keyId);

            // Process remaining answers (create new or update existing)
            for (const answer of currentAnswers) {
                if (!answer.keyId) {
                    const newAnswerPayload = {
                        questionId: String(selectedQuestion.questionId),
                        keyContent: String(answer.keyContent || ''),
                        keyScore: String(answer.keyScore || ''),
                    };
                    console.log('Creating new answer:', JSON.stringify(newAnswerPayload, null, 2));
                    const newAnswerResponse = await quizService.createAnswer(newAnswerPayload);
                    updatedAnswers.push(newAnswerResponse);
                } else {
                    const existingAnswer = existingAnswers.find((ea) => ea.keyId === answer.keyId);
                    if (existingAnswer) {
                        const hasChanges =
                            answer.keyContent !== existingAnswer.keyContent ||
                            answer.keyScore !== existingAnswer.keyScore;
                        if (hasChanges) {
                            const updateAnswerPayload = {
                                keyId: String(answer.keyId),
                                keyContent: String(answer.keyContent || ''),
                                keyScore: String(answer.keyScore || ''),
                            };
                            console.log('Updating answer:', JSON.stringify(updateAnswerPayload, null, 2));
                            const updateAnswerResponse = await quizService.updateAnswer(updateAnswerPayload);
                            updatedAnswers.push(updateAnswerResponse);
                        } else {
                            updatedAnswers.push(existingAnswer);
                        }
                    }
                }
            }

            const updatedQuestion = {
                ...selectedQuestion,
                keyQuestions: updatedAnswers,
            };

            message.success('Cập nhật câu trả lời thành công');
            onUpdateAnswers(updatedQuestion);
        } catch (error) {
            const errorResponse = error.response?.data || error.message;
            console.error('Full error response:', JSON.stringify(errorResponse, null, 2));
            setError(errorResponse?.detail || errorResponse?.message || 'Failed to update answers');
            message.error('Cập nhật câu trả lời thất bại');
        }
    };

    const handleUpdateAll = async () => {
        try {
            setError(null);
            const values = form.getFieldsValue();

            const questionPayload = {
                questionId: (values.questionId !== undefined && values.questionId !== '')
                    ? String(values.questionId)
                    : String(selectedQuestion.questionId),
                cateQuestionId: (values.cateQuestionId !== undefined && values.cateQuestionId !== '')
                    ? String(values.cateQuestionId)
                    : String(selectedQuestion.cateQuestionId),
                questionContent: (values.questionContent !== undefined && values.questionContent !== null)
                    ? String(values.questionContent)
                    : String(selectedQuestion.questionContent || ''),
            };
            console.log('Sending payload to updateQuestion (all):', JSON.stringify(questionPayload, null, 2));
            const questionResponse = await quizService.updateQuestion(questionPayload);
            console.log('Received response from updateQuestion (all):', JSON.stringify(questionResponse, null, 2));

            const existingAnswers = selectedQuestion.keyQuestions;
            const currentAnswers = values.keyQuestions || [];

            const updatedAnswers = [];
            const deletedAnswerIds = existingAnswers
                .filter((ea) => !currentAnswers.some((ca) => ca.keyId === ea.keyId))
                .map((ea) => ea.keyId);

            // Process remaining answers (create new or update existing)
            for (const answer of currentAnswers) {
                if (!answer.keyId) {
                    const newAnswerPayload = {
                        questionId: String(selectedQuestion.questionId),
                        keyContent: String(answer.keyContent || ''),
                        keyScore: String(answer.keyScore || ''),
                    };
                    console.log('Creating new answer:', JSON.stringify(newAnswerPayload, null, 2));
                    const newAnswerResponse = await quizService.createAnswer(newAnswerPayload);
                    updatedAnswers.push(newAnswerResponse);
                } else {
                    const existingAnswer = existingAnswers.find((ea) => ea.keyId === answer.keyId);
                    if (existingAnswer) {
                        const hasChanges =
                            answer.keyContent !== existingAnswer.keyContent ||
                            answer.keyScore !== existingAnswer.keyScore;
                        if (hasChanges) {
                            const updateAnswerPayload = {
                                keyId: String(answer.keyId),
                                keyContent: String(answer.keyContent || ''),
                                keyScore: String(answer.keyScore || ''),
                            };
                            console.log('Updating answer:', JSON.stringify(updateAnswerPayload, null, 2));
                            const updateAnswerResponse = await quizService.updateAnswer(updateAnswerPayload);
                            updatedAnswers.push(updateAnswerResponse);
                        } else {
                            updatedAnswers.push(existingAnswer);
                        }
                    }
                }
            }

            const updatedQuestion = {
                ...questionResponse,
                keyQuestions: updatedAnswers,
            };

            message.success('Cập nhật tất cả thành công');
            onUpdateAnswers(updatedQuestion);
        } catch (error) {
            const errorResponse = error.response?.data || error.message;
            console.error('Error in handleUpdateAll:', JSON.stringify(errorResponse, null, 2));
            setError(errorResponse?.detail || errorResponse?.message || 'Failed to update all');
            message.error('Cập nhật tất cả thất bại');
        }
    };

    const currentAnswers = Form.useWatch('keyQuestions', form) || [];
    const currentQuestionContent = Form.useWatch('questionContent', form) || '';
    const currentCateQuestionId = Form.useWatch('cateQuestionId', form) || '';
    const currentQuestionId = Form.useWatch('questionId', form) || '';

    const originalAnswers = useMemo(() =>
        selectedQuestion?.keyQuestions.map(({ keyId, keyContent, keyScore }) => ({
            keyId,
            keyContent,
            keyScore,
        })) || [],
        [selectedQuestion]
    );

    useEffect(() => {
        if (!selectedQuestion) return;

        const questionHasChanges =
            (currentQuestionId !== undefined && currentQuestionId !== String(selectedQuestion.questionId)) ||
            (currentQuestionContent !== undefined && currentQuestionContent !== selectedQuestion.questionContent) ||
            (currentCateQuestionId !== undefined && currentCateQuestionId !== selectedQuestion.cateQuestionId);
        setQuestionChanged(questionHasChanges);

        const hasAnswersChanges = currentAnswers.length !== originalAnswers.length ||
            currentAnswers.some((answer) => {
                const original = originalAnswers.find((oa) => oa.keyId === answer.keyId);
                return original && (
                    answer.keyContent !== original.keyContent ||
                    answer.keyScore !== original.keyScore
                );
            }) ||
            currentAnswers.some((answer) => !answer.keyId && (answer.keyContent || answer.keyScore)); // New answers with content
        setAnswersChanged(hasAnswersChanges);
    }, [currentAnswers, originalAnswers, selectedQuestion, currentQuestionContent, currentCateQuestionId, currentQuestionId]);

    const bothChanged = questionChanged && answersChanged;

    const handleButtonClick = (e, callback) => {
        e.stopPropagation();
        callback();
    };

    const showDeleteAnswerModal = (name) => {
        const answer = form.getFieldValue(['keyQuestions', name]);
        if (answer?.keyId) {
            setAnswerToDelete({ name, keyId: answer.keyId });
            setDeleteModalVisible(true);
        } else {
            // Remove new answers directly
            form.setFieldsValue({
                keyQuestions: form.getFieldValue('keyQuestions').filter((_, index) => index !== name),
            });
            // Do not set answersChanged here to avoid enabling the button
        }
    };

    const handleDeleteAnswerConfirm = () => {
        if (answerToDelete) {
            form.setFieldsValue({
                keyQuestions: form.getFieldValue('keyQuestions').filter((_, index) => index !== answerToDelete.name),
            });
            // Do not set answersChanged here to avoid counting deletion as a change
        }
        setDeleteModalVisible(false);
        setAnswerToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
        setAnswerToDelete(null);
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
                    label="Câu Hỏi"
                    style={{ color: "#5A2D2F", fontWeight: "bold" }}
                >
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        style={{
                            color: "#5A2D2F",
                            borderColor: "#5A2D2F",
                            backgroundColor: "#F6EEF0",
                        }}
                        onChange={(e) => {
                            form.setFieldsValue({ questionContent: String(e.target.value) });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="cateQuestionId"
                    label="Category ID"
                    style={{ color: '#5A2D2F', fontWeight: 'bold' }}
                >
                    <AntInput
                        type="number"
                        placeholder="Category ID"
                        min={0}
                        max={4}
                        style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0", width: '30%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="questionId"
                    label="Question ID"
                    style={{ color: '#5A2D2F', fontWeight: 'bold' }}
                >
                    <AntInput
                        type="number"
                        placeholder="Question ID"
                        min={0}
                        style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0", width: '30%' }}
                    />
                </Form.Item>

                <Col span={24}>
                    <Divider style={{ borderColor: "#56021F" }} />
                </Col>

                <Form.List name="keyQuestions">
                    {(fields, { add, remove }) => (
                        <div>
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
                                            type="number"
                                            min={0}
                                            max={4}
                                            style={{ color: "#5A2D2F", borderColor: "#5A2D2F", backgroundColor: "#F6EEF0" }}
                                        />
                                    </Form.Item>
                                    <Button
                                        onClick={(e) => handleButtonClick(e, () => showDeleteAnswerModal(name))}
                                        style={{
                                            padding: '4px 10px',
                                            width: '80px',
                                            borderRadius: '10px',
                                            border: '1px solid #5A2D2F',
                                            backgroundColor: '#F6EEF0',
                                            color: '#5A2D2F',
                                            fontWeight: 'bold',
                                            fontSize: '13px',
                                            textAlign: "center"
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                </div>
                            ))}
                            <Button
                                onClick={() => {
                                    console.log('Adding new answer field');
                                    add();
                                }}
                                block
                                style={{
                                    color: "#5A2D2F",
                                    borderColor: "#5A2D2F",
                                    backgroundColor: "#F6EEF0",
                                    marginBottom: '16px',
                                    width: '60%',
                                    margin: '0 auto 10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                Thêm câu trả lời
                            </Button>
                        </div>
                    )}
                </Form.List>

                <Form.Item>
                    <Button
                        style={{
                            width: '60%',
                            margin: '0 auto 10px',
                            backgroundColor: questionChanged && !bothChanged ? '#C87E83' : '#d9d9d9',
                            borderColor: questionChanged && !bothChanged ? '#C87E83' : '#d9d9d9',
                            color: questionChanged && !bothChanged ? '#fff' : '#999',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        htmlType="submit"
                        disabled={!questionChanged || bothChanged}
                    >
                        Cập nhật câu hỏi
                    </Button>
                    <Button
                        style={{
                            width: '60%',
                            margin: '0 auto 10px',
                            backgroundColor: answersChanged && !bothChanged ? '#D8959A' : '#d9d9d9',
                            borderColor: answersChanged && !bothChanged ? '#D8959A' : '#d9d9d9',
                            color: answersChanged && !bothChanged ? '#fff' : '#999',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onClick={(e) => handleButtonClick(e, handleUpdateAnswers)}
                        disabled={!answersChanged || bothChanged}
                    >
                        Cập nhật câu trả lời
                    </Button>
                    {bothChanged && (
                        <Button
                            style={{
                                width: '60%',
                                margin: '0 auto',
                                backgroundColor: '#E6B2BA',
                                borderColor: '#E6B2BA',
                                color: '#fff',
                                borderRadius: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onClick={(e) => handleButtonClick(e, handleUpdateAll)}
                        >
                            Cập Nhật Tất Cả
                        </Button>
                    )}
                </Form.Item>
            </Form>

            <DeleteQuestionModal
                visible={deleteModalVisible}
                onCancel={handleDeleteCancel}
                onDelete={handleDeleteAnswerConfirm}
                questionId={answerToDelete?.keyId} // This might be undefined
                type="answer"
            />
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