// src/components/UpdateQuestionModal.jsx
import PropTypes from 'prop-types'; // Import PropTypes
import { Modal, Form, Input as AntInput, Button, Row, Col } from "antd";
import { useEffect } from "react";

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
            visible={visible}
            onCancel={onCancel}
            footer={null}
            zIndex={1100} // Set higher zIndex to appear above navbar (1050)
            onClick={(e) => e.stopPropagation()} // Prevent click event from bubbling
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                {/* Question Content Field */}
                <Form.Item
                    name="questionContent"
                    label="Question Content"
                    rules={[{ required: true, message: 'Please input the question content!' }]}
                >
                    <AntInput
                        style={{
                            color: "#5A2D2F",
                            borderColor: "#5A2D2F",
                            backgroundColor: "#F6EEF0",
                        }}
                    />
                </Form.Item>

                {/* Category ID Field */}
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

                {/* Key Questions Field */}
                <Form.List name="keyQuestions">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16}>
                                    <Col span={10}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'keyContent']}
                                            label="Answer"
                                            rules={[{ required: true, message: 'Please input the answer!' }]}
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
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'keyScore']}
                                            label="Score"
                                            rules={[{ required: true, message: 'Please input the score!' }]}
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
                                    </Col>
                                    <Col span={4}>
                                        <Button danger onClick={() => remove(name)}>Remove</Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button type="dashed" onClick={() => add()} block>
                                Add Answer
                            </Button>
                        </>
                    )}
                </Form.List>

                {/* Submit Button */}
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