import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Button, Row, Col } from 'antd';

const CreateQuestionModal = ({
    visible,
    onCancel,
    onCreate,
    form,
}) => {
    return (
        <Modal
            title="Tạo câu hỏi mới"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} onFinish={onCreate} layout="vertical">
                <Form.Item
                    name="questionContent"
                    label="Nội dung câu hỏi"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="cateQuestionId"
                    label="ID danh mục"
                    rules={[{ required: true, message: "Vui lòng nhập ID danh mục!" }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.List name="keyQuestions">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16}>
                                    <Col span={10}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "keyContent"]}
                                            rules={[{ required: true, message: "Vui lòng nhập câu trả lời!" }]}
                                        >
                                            <Input placeholder="Answer" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "keyScore"]}
                                            rules={[{ required: true, message: "Vui lòng nhập điểm!" }]}
                                        >
                                            <Input type="number" placeholder="Score" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Button danger onClick={() => remove(name)}>Xóa</Button>
                                    </Col>
                                </Row>
                            ))}
                            <Button type="dashed" onClick={() => add()} block>Thêm câu trả lời</Button>
                        </>
                    )}
                </Form.List>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Tạo</Button>
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
        // Add other form methods you use
    }).isRequired,
};

export default CreateQuestionModal;