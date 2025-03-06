import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import api from "../../config/api";

const { Option } = Select;

const AddressModal = ({ visible, onClose, userAddress, refreshAddressData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await api.get("/location/cities");
            setCities(response.data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchDistricts = async (cityId) => {
        try {
            const response = await api.get(`/location/districts?cityId=${cityId}`);
            setDistricts(response.data);
            setWards([]);
            form.setFieldsValue({ district: undefined, ward: undefined });
        } catch (error) {
            console.error("Error fetching districts:", error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const response = await api.get(`/location/wards?districtId=${districtId}`);
            setWards(response.data);
            form.setFieldsValue({ ward: undefined });
        } catch (error) {
            console.error("Error fetching wards:", error);
        }
    };

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const response = await api.post("/User/update-address", values);
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
                <Form.Item label="Địa chỉ chi tiết" name="addDetail" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
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

                <Form.Item label="Tỉnh/Thành phố" name="city" rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}>
                    <Select onChange={fetchDistricts}>
                        {cities.map(city => <Option key={city.id} value={city.id}>{city.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}>
                    <Select onChange={fetchWards} disabled={!districts.length}>
                        {districts.map(district => <Option key={district.id} value={district.id}>{district.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item label="Phường/Xã" name="ward" rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}>
                    <Select disabled={!wards.length}>
                        {wards.map(ward => <Option key={ward.id} value={ward.id}>{ward.name}</Option>)}
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
