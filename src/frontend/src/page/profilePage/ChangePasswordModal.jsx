/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import api from "../../config/api";

const ChangePasswordModal = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async (values) => {
        let payload;
        setLoading(true);
        try {
            const payload = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword
            };

            const response = await api.post("auth/change-password", payload);

            if (response.data.statusCode === 200) {
                message.success("Mật khẩu đã được thay đổi thành công!");
                form.resetFields();
                onClose();
            } else {
                message.error(`Thay đổi mật khẩu thất bại: ${response.data.message || response.data.detail || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error("Error changing password:", {
                dataSent: payload,
                response: error.response?.data || error.message
            });
            const errorMessage = error.response?.data?.detail || error.response?.data?.Message || error.message || 'Lỗi server';
            message.error(`Lỗi khi thay đổi mật khẩu: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={
                <h2
                    className="fw-bold text-center"
                    style={{
                        fontSize: '39px',
                        fontFamily: "'Nunito', serif",
                        color: '#5A2D2F',
                        backgroundColor: '#F6EEF0',
                        padding: '10px 0',
                        margin: 0,
                    }}
                >
                    Thay Đổi Mật Khẩu
                </h2>
            }
            visible={visible}
            onCancel={onClose}
            footer={null}
            bodyStyle={{
                background: '#F6EEF0',
            }}
            width={600}
            padding={20}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleChangePassword}
            >
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu cũ!" },
                        { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                    ]}
                >
                    <Input
                        type={showOldPassword ? "text" : "password"}
                        suffix={
                            showOldPassword ? (
                                <EyeInvisibleOutlined
                                    onClick={() => setShowOldPassword(false)}
                                    style={{ color: '#5A2D2F' }}
                                />
                            ) : (
                                <EyeOutlined
                                    onClick={() => setShowOldPassword(true)}
                                    style={{ color: '#5A2D2F' }}
                                />
                            )
                        }
                        style={{
                            border: '1px solid #C87E83',
                            backgroundColor: '#F6EEF0',
                            color: '#5A2D2F',
                            fontWeight: 'bold',
                            fontFamily: "'Nunito', sans-serif"
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                        { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                    ]}
                >
                    <Input
                        type={showNewPassword ? "text" : "password"}
                        suffix={
                            showNewPassword ? (
                                <EyeInvisibleOutlined
                                    onClick={() => setShowNewPassword(false)}
                                    style={{ color: '#5A2D2F' }}
                                />
                            ) : (
                                <EyeOutlined
                                    onClick={() => setShowNewPassword(true)}
                                    style={{ color: '#5A2D2F' }}
                                />
                            )
                        }
                        style={{
                            border: '1px solid #C87E83',
                            backgroundColor: '#F6EEF0',
                            color: '#5A2D2F',
                            fontWeight: 'bold',
                            fontFamily: "'Nunito', sans-serif"
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        suffix={
                            showConfirmPassword ? (
                                <EyeInvisibleOutlined
                                    onClick={() => setShowConfirmPassword(false)}
                                    style={{ color: '#5A2D2F' }}
                                />
                            ) : (
                                <EyeOutlined
                                    onClick={() => setShowConfirmPassword(true)}
                                    style={{ color: '#5A2D2F' }}
                                />
                            )
                        }
                        style={{
                            border: '1px solid #C87E83',
                            backgroundColor: '#F6EEF0',
                            color: '#5A2D2F',
                            fontWeight: 'bold',
                            fontFamily: "'Nunito', sans-serif"
                        }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        htmlType="submit"
                        loading={loading}
                        className="d-flex align-items-center justify-content-center mx-auto"
                        style={{
                            width: '60%',
                            height: '45px',
                            borderRadius: '10px',
                            border: '1px solid #5A2D2F',
                            backgroundColor: '#F6EEF0',
                            color: '#5A2D2F',
                            fontWeight: 'bold',
                            fontFamily: "'Nunito', sans-serif",
                            marginLeft: '40px',
                            marginTop: '20px'
                        }}
                    >
                        LƯU MẬT KHẨU
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;