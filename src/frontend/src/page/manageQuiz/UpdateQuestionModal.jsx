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
            title={
                <div style={{
                    fontSize: '30px',
                    fontFamily: "'Nunito', sans-serif",
                    textAlign: 'center'
                }}>
                    Cập Nhật Câu Hỏi
                </div>
            }
            width={600}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            zIndex={1100}
            onClick={(e) => e.stopPropagation()}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
        >
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                    style={{
                        color: '#5A2D2F',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        fontFamily: "'Nunito', sans-serif",


                    }}
                    name="questionContent"
                    label="Nội dung câu hỏi"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
                >
                    <TextArea
                        autoSize={{ minRows: 3, maxRows: 10 }} 
                        style={{
                            color: "#5A2D2F",
                            borderColor: "#5A2D2F",
                            backgroundColor: "#F6EEF0",

                        }}
                    />
                </Form.Item>

                {/* Category ID Field - Unchanged */}
                <Form.Item
                    style={{
                        color: '#5A2D2F',
                        fontWeight: 'bold',
                    }}
                    name="cateQuestionId"
                    label="Category ID"
                    rules={[{ required: true, message: 'Vui lòng nhập Category ID!' }]}
                >
                    <AntInput
                        type="number"
                        min={0}
                        max={20}
                        style={{
                            color: "#5A2D2F",
                            borderColor: "#5A2D2F",
                            backgroundColor: "#F6EEF0",
                            width: '30%',
                        }}
                    />
                </Form.Item>

                <Form.List name="keyQuestions">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div key={key}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1.5fr 1fr',
                                        gap: '16px',
                                        marginBottom: '30px',
                                    }}>
                                    <Form.Item

                                        {...restField}
                                        name={[name, 'keyContent']}
                                        label="Câu trả lời"
                                        rules={[{ required: true, message: 'Vui lòng nhập câu trả lời!' }]}
                                        style={{
                                            marginBottom: 0,
                                            color: '#5A2D2F',

                                        }}
                                    >
                                        <TextArea
                                            rows={4}
                                            autoSize={{ minRows: 1, maxRows: 5 }} 
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
                                        label="Điểm"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điểm!' },

                                        ]}
                                        style={{
                                            marginBottom: 0,
                                            color: '#5A2D2F',


                                        }}
                                    >
                                        <AntInput
                                            type="number"
                                            placeholder="Điểm"
                                            min={0}
                                            max={10}
                                            style={{
                                                color: "#5A2D2F",
                                                borderColor: "#5A2D2F",
                                                backgroundColor: "#F6EEF0",
                                            }}
                                        />
                                    </Form.Item>
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'left' }}>
                                        <Button


                                            onClick={() => remove(name)}
                                            style={{
                                                margin: 0, padding: '4px 10px',
                                                borderRadius: '10px',
                                                border: '1px solid #5A2D2F',
                                                backgroundColor: '#F6EEF0',
                                                color: '#5A2D2F',
                                                fontWeight: 'bold',
                                                fontSize: '13px',

                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button
                                style={{
                                    width: '60%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    margin: '0 auto',
                                    marginBottom: '10px',
                                    backgroundColor: '#D8959A',
                                    borderColor: '#D8959A',
                                    color: '#fff',
                                    borderRadius: '10px',
                                }}
                                onClick={() => add()}
                                block
                            >
                                Thêm câu trả lời
                            </Button>

                        </>
                    )}
                </Form.List>

                {/* Submit Button - Unchanged */}
                <Form.Item>
                    <Button
                        style={{
                            width: '60%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto',
                            marginBottom: '30px',
                            backgroundColor: '#C87E83',
                            borderColor: '#C87E83',
                            color: '#fff',
                            borderRadius: '10px',
                        }}

                        htmlType="submit">
                        Cập nhật
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