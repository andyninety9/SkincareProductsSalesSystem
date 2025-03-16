import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input as AntInput, Button, Row, Col, Divider } from 'antd';

const { TextArea } = AntInput;

const CreateQuestionModal = ({
    visible,
    onCancel,
    onCreate,
    form,
}) => {
    return (
        <Modal
            title={
                <div style={{
                    fontSize: '30px',
                    fontFamily: "'Nunito', sans-serif",
                    textAlign: 'center'
                }}>
                    Tạo Câu Hỏi Mới
                </div>
            }
            width={500}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            zIndex={1100}
            onClick={(e) => e.stopPropagation()}
            styles={{ body: { maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' } }}
        >
            <Form form={form} onFinish={onCreate} layout="vertical">
                <Form.Item
                    style={{
                        color: '#5A2D2F',
                        fontSize: '16px',
                        fontFamily: "'Nunito', sans-serif",
                    }}
                    name="questionContent"
                    label="Nội dung câu hỏi"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}
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

                <Form.Item
                    style={{
                        color: '#5A2D2F',
                        fontSize: '16px',
                        fontFamily: "'Nunito', sans-serif",
                    }}
                    name="cateQuestionId"
                    label="Category ID"
                    rules={[{ required: true, message: "Vui lòng nhập Category ID!" }]}
                >
                    <AntInput
                        type="number"
                        min={0}
                        max={4}
                        style={{
                            color: "#5A2D2F",
                            borderColor: "#5A2D2F",
                            backgroundColor: "#F6EEF0",
                            width: '100%',
                        }}
                    />
                </Form.Item>


                <Col span={24}>
                    <Divider style={{ borderColor: "#56021F" }} />
                </Col>


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
                                        name={[name, "keyContent"]}
                                        label="Câu trả lời"
                                        rules={[{ required: true, message: "Vui lòng nhập câu trả lời!" }]}
                                        style={{
                                            marginBottom: 0,
                                            color: '#5A2D2F',
                                        }}
                                    >
                                        <TextArea
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
                                        name={[name, "ansId"]}
                                        label="Answer ID"
                                        style={{
                                            marginBottom: 0,
                                            color: '#5A2D2F',
                                        }}
                                    >
                                        <AntInput
                                            placeholder="Enter Answer ID"
                                            style={{
                                                color: "#5A2D2F",
                                                borderColor: "#5A2D2F",
                                                backgroundColor: "#F6EEF0",
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, "keyScore"]}
                                        label="Điểm"
                                        rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
                                        style={{
                                            marginBottom: 0,
                                            color: '#5A2D2F',
                                        }}
                                    >
                                        <AntInput
                                            type="number"
                                            placeholder="Score"
                                            min={0}
                                            max={4}
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
                                                margin: 0,
                                                padding: '4px 10px',
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
                        type="primary"
                        htmlType="submit"
                    >
                        Tạo
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

CreateQuestionModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    form: PropTypes.shape({
        resetFields: PropTypes.func.isRequired,
    }).isRequired,
};

export default CreateQuestionModal;