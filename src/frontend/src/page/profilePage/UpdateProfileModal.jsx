import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import "./UpdateProfileModal.css";
import api from "../../config/api";

const { Option } = Select;

// Mapping for gender values
const genderMap = {
    Male: "1",
    Female: "2",
    Other: "3"
};

// Reverse mapping for display
const reverseGenderMap = {
    "1": "Male",
    "2": "Female",
    "3": "Other"
};

const UpdateProfileModal = ({ visible, onClose, userInfo, refreshUserData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleUpdate = async (values) => {
        const payload = {};

        if (values.fullname && values.fullname !== userInfo.fullname) {
            payload.fullname = values.fullname;
        }
        if (values.gender && values.gender !== genderMap[userInfo.gender]) {
            payload.gender = values.gender;
        }
        if (values.phone && values.phone !== userInfo.phone) {
            payload.phone = values.phone;
        }
        if (values.dob && values.dob !== (userInfo.dob ? userInfo.dob.split('T')[0] : "")) {
            payload.dob = values.dob;
        }

        // If no fields changed, stop the update
        if (Object.keys(payload).length === 0) {
            message.info("Không có thay đổi nào để cập nhật.");
            return;
        }


        setLoading(true);
        try {
            const response = await api.post("User/update-me", payload);

            if (response.data.statusCode === 200) {
                message.success("Thông tin đã được cập nhật thành công!");
                refreshUserData();
                onClose();
            } else {
                message.error("Cập nhật thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Error updating user info:", error);
            if (error.response) {
                console.log("Server error response:", error.response.data);
                console.log("API Response:", response.data);

                // Handle specific error messages from API
                if (error.response.data.detail === "The provided phone number is already registered.") {
                    message.error("Số điện thoại này đã được đăng ký. Vui lòng chọn số khác.");
                } else if (error.response.data.errors) {
                    message.error(error.response.data.errors[0]?.description || "Có lỗi xảy ra. Vui lòng thử lại sau!");
                } else {
                    message.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
                }
            } else {
                message.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
            }
        } finally {
            setLoading(false);
        }
    };

    const initialGender = userInfo.gender ? genderMap[userInfo.gender] || "" : "";

    const isGenderEditable = !userInfo.gender;

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
                        margin: 0
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
                    gender: initialGender,
                    phone: userInfo.phone || "",
                    dob: userInfo.dob ? userInfo.dob.split("T")[0] : ""
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
                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
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
                        disabled={!isGenderEditable} // Disable if gender is not null/undefined
                        style={{
                            backgroundColor: '#F6EEF0',
                        }}
                        dropdownStyle={{
                            backgroundColor: '#F6EEF0'
                        }}
                    >
                        <Option value="1">Nam</Option>
                        <Option value="2">Nữ</Option>
                        <Option value="3">Khác</Option>
                    </Select>
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
                    name="phone"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                        { pattern: /^[0-9]{9,}$/, message: "Số điện thoại phải là số và có ít nhất 9 chữ số!" }
                    ]}
                    style={{ marginBottom: '10px' }}
                >
                    <Input
        
                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
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
                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
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
                        LƯU THAY ĐỔI
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateProfileModal;