// src/components/UpdateQuestionModal.jsx
import PropTypes from 'prop-types'; // Import PropTypes
import { Modal, Form, Input as AntInput, Button, Row, Col } from "antd";
import { useEffect } from "react";

const { TextArea } = AntInput; // Destructure TextArea from AntInput

const UpdateQuestionModal = ({
    visible,
    onCancel,
    onUpdate,
    selectedQuestion,
    form,
}) => {
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
        }
    }, [selectedQuestion, form]);

    const handleFinish = (values) => {
        onUpdate(values);
    };

    return (
        <Modal
            title="Update Question"
            width={600}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            zIndex={1100}
            onClick={(e) => e.stopPropagation()}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                {/* Question Content Field - Unchanged */}
                <Form.Item
                    name="questionContent"
                    label="Question Content"
                    rules={[{ required: true, message: 'Please input the question content!' }]}
                >
                    <TextArea
                        rows={4}
                        style={{
                            color: "#5A2D2F",
                            borderColor: "#5A2D2F",
                            backgroundColor: "#F6EEF0",
                        }}
                    />
                </Form.Item>

                {/* Category ID Field - Unchanged */}
                <Form.Item
                    name="cateQuestionId"
                    label="Category ID"
                    rules={[{ required: true, message: 'Please input a category ID!' }]}
                >
                    <AntInput
                        type="number"
                        style={{
                            color: "#5A2D2F",
                            borderColor: "#5A2D2F",
                            backgroundColor: "#F6EEF0",
                        }}
                    />
                </Form.Item>

                {/* Key Questions Field - Updated */}
                <Form.List name="keyQuestions">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'keyContent']}
                                        label="Answer"
                                        rules={[{ required: true, message: 'Please input the answer!' }]}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <AntInput
                                            placeholder="Answer"
                                            style={{
                                                color: "#5A2D2F",
                                                borderColor: "#5A2D2F",
                                                backgroundColor: "#F6EEF0",
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'keyScore']}
                                        label="Score"
                                        rules={[{ required: true, message: 'Please input the score!' }]}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <AntInput
                                            type="number"
                                            placeholder="Score"
                                            style={{
                                                color: "#5A2D2F",
                                                borderColor: "#5A2D2F",
                                                backgroundColor: "#F6EEF0",
                                            }}
                                        />
                                    </Form.Item>
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'left' }}>
                                        <Button
                                            danger
                                            onClick={() => remove(name)}
                                            style={{ margin: 0, padding: '4px 15px' }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button type="dashed" onClick={() => add()} block>
                                Add Answer
                            </Button>
                        </>
                    )}
                </Form.List>

                {/* Submit Button - Unchanged */}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

// Add PropTypes validation
UpdateQuestionModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    selectedQuestion: PropTypes.shape({
        questionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        questionContent: PropTypes.string.isRequired,
        cateQuestionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        keyQuestions: PropTypes.arrayOf(
            PropTypes.shape({
                keyId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
                keyContent: PropTypes.string.isRequired,
                keyScore: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            })
        ).isRequired,
    }),
    form: PropTypes.object.isRequired,
};

export default UpdateQuestionModal;