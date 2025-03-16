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