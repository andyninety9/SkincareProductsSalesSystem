import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import "./UpdateProfileModal.css";
import api from "../../config/api";

const { Option } = Select;

const UpdateProfileModal = ({ visible, onClose, userInfo, refreshUserData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const response = await api.post('User/update-me', values);
            if (response.data.statusCode === 200) {
                message.success("Thông tin đã được cập nhật thành công!");
                refreshUserData();
                onClose();
            } else {
                message.error("Cập nhật thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
            message.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
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
                    }}
                >
                    Cập Nhật Thông Tin
                </h2>
            }
            visible={visible}
            onCancel={onClose}
            footer={null}
            bodyStyle={{
                background: '#F6EEF0',
                padding: '10px'
            }}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    fullname: userInfo.fullname || "",
                    gender: userInfo.gender || "",
                    email: userInfo.email || "",
                    phoneNumber: userInfo.phone || "",
                    dob: userInfo.dob || ""
                }}
                onFinish={handleUpdate}
                style={{
                    fontFamily: "'Nunito', sans-serif",
                    width: '100%'
                }}
            >
                <Form.Item
                    label={
                        <label style={{
                            fontSize: '14px',
                            color: '#C87E83',
                            fontFamily: "'Nunito', sans-serif"
                        }}>
                            Họ và Tên
                        </label>
                    }
                    name="fullname"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                    style={{ marginBottom: '10px' }}
                >
                    <Input
                        className="form-control border-0 border-bottom rounded-0"
                        style={{
                            backgroundColor: '#F6EEF0',
                            borderBottom: '1px solid #C87E83'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <label style={{
                            fontSize: '14px',
                            color: '#C87E83',
                            fontFamily: "'Nunito', sans-serif"
                        }}>
                            Giới Tính
                        </label>
                    }
                    name="gender"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                    style={{ marginBottom: '10px' }}
                >
                    <Select
                        style={{
                            backgroundColor: '#F6EEF0',
                        }}
                        dropdownStyle={{
                            backgroundColor: '#F6EEF0'
                        }}
                    >
                        <Option value="Male">Nam</Option>
                        <Option value="Female">Nữ</Option>
                        <Option value="Other">Khác</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label={
                        <label style={{
                            fontSize: '14px',
                            color: '#C87E83',
                            fontFamily: "'Nunito', sans-serif"
                        }}>
                            Email
                        </label>
                    }
                    name="email"
                    rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
                    style={{ marginBottom: '10px' }}
                >
                    <Input
                        disabled
                        className="form-control border-0 border-bottom rounded-0"
                        style={{
                            backgroundColor: '#F6EEF0',
                            borderBottom: '1px solid #C87E83'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <label style={{
                            fontSize: '14px',
                            color: '#C87E83',
                            fontFamily: "'Nunito', sans-serif"
                        }}>
                            Số Điện Thoại
                        </label>
                    }
                    name="phoneNumber"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                    style={{ marginBottom: '10px' }}
                >
                    <Input
                        className="form-control border-0 border-bottom rounded-0"
                        style={{
                            backgroundColor: '#F6EEF0',
                            borderBottom: '1px solid #C87E83'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <label style={{
                            fontSize: '14px',
                            color: '#C87E83',
                            fontFamily: "'Nunito', sans-serif"
                        }}>
                            Ngày Sinh
                        </label>
                    }
                    name="dob"
                    rules={[{ required: true, message: "Vui lòng nhập ngày sinh!" }]}
                    style={{ marginBottom: '10px' }}
                >
                    <Input
                        type="date"
                        className="form-control border-0 border-bottom rounded-0"
                        style={{
                            backgroundColor: '#F6EEF0',
                            borderBottom: '1px solid #C87E83'
                        }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        htmlType="submit"
                        loading={loading}
                        className="d-flex align-items-center justify-content-center"
                        style={{
                            width: '80%',
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
                        LƯU THAY ĐỔI
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProfileModal;