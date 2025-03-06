import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import api from "../../config/api";

const { Option } = Select;

const AddressModal = ({ visible, onClose, userAddress, refreshAddressData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
            const response = await api.get("delivery/provinces");
            const provincesData = Array.isArray(response.data) ? response.data : [];
            setProvinces(provincesData);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            setProvinces([]);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await api.get(`delivery/districts?provinceId=${provinceId}`);
            const districtsData = Array.isArray(response.data) ? response.data : [];
            setDistricts(districtsData);
        } catch (error) {
            console.error("Error fetching districts:", error);
            setDistricts([]);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await api.get(`delivery/wards?districtId=${districtId}`);
            const wardsData = Array.isArray(response.data) ? response.data : [];
            setWards(wardsData);
            form.setFieldsValue({ ward: undefined });
        } catch (error) {
            console.error("Error fetching wards:", error);
            setWards([]);
        }
    };

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const response = await api.post("Address/create", values);
            if (response.data.statusCode === 200) {
                message.success("Địa chỉ đã được cập nhật thành công!");
                refreshAddressData();
                onClose();
            } else {
                message.error("Cập nhật thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
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
                        backgroundColor: '#F6EEF0',
                        padding: '10px 0',
                        margin: 0
                    }}
                >
                    Cập Nhật Địa Chỉ
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
                initialValues={userAddress}
                onFinish={handleUpdate}
            >
                <Form.Item
                    label="Địa chỉ chi tiết"
                    name="addDetail"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
                >
                    <Input
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
                    label="Tỉnh/Thành phố"
                    name="province"
                    rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                >
                    <Select
                        onChange={(value) => fetchDistricts(value)}
                        placeholder="Chọn tỉnh/thành phố"
                        loading={!provinces.length}
                        value={form.getFieldValue('province')}
                    >
                        {Array.isArray(provinces) && provinces.length > 0 ? (
                            provinces.map(province => (
                                <Option
                                    key={province.ProvinceID}
                                    value={province.ProvinceID}
                                >
                                    {province.ProvinceName}
                                </Option>
                            ))
                        ) : (
                            <Option value="" disabled>Không có dữ liệu tỉnh</Option>
                        )}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Quận/Huyện"
                    name="district"
                    rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                >
                    <Select
                        onChange={(value) => fetchWards(value)}
                        disabled={!districts.length}
                        placeholder="Chọn quận/huyện"
                    >
                        {Array.isArray(districts) && districts.map(district => (
                            <Option key={district.id} value={district.id}>
                                {district.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Phường/Xã"
                    name="ward"
                    rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
                >
                    <Select
                        disabled={!wards.length}
                        placeholder="Chọn phường/xã"
                    >
                        {Array.isArray(wards) && wards.map(ward => (
                            <Option key={ward.id} value={ward.id}>
                                {ward.name}
                            </Option>
                        ))}
                    </Select>
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
                        LƯU ĐỊA CHỈ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddressModal;