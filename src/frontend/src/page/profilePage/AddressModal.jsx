/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import api from "../../config/api";

const { Option } = Select;

const AddressModal = ({ visible, onClose, userAddress, refreshAddressData, onAddressAdded }) => {
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
            if (response.status === 200) {
                const provincesData = Array.isArray(response.data.data) ? response.data.data : [];
                setProvinces(provincesData);
            } else {
                setProvinces([]);
            }
        } catch (error) {
            console.error("Error fetching provinces:", error);
            setProvinces([]);
        }
    };
    const fetchDistricts = async (provinceId) => {
        try {
            console.log('Fetching districts for ProvinceID:', provinceId);
            const response = await api.get(`delivery/districts?provinceId=${provinceId}`);
            console.log('Districts response:', response.data);
            const districtsData = Array.isArray(response.data.data) ? response.data.data : [];
            setDistricts(districtsData);
            setWards([]);
            form.setFieldsValue({ district: undefined, ward: undefined });
            console.log('Districts set:', districtsData);
        } catch (error) {
            console.error("Error fetching districts:", error);
            setDistricts([]);
        }
    };
    const fetchWards = async (districtId) => {
        try {
            // console.log('Fetching wards for DistrictID:', districtId);
            const response = await api.get(`delivery/wards?districtId=${districtId}`);
            // console.log('Wards response:', response.data);
            const wardsData = Array.isArray(response.data.data) ? response.data.data : [];
            setWards(wardsData);
            form.setFieldsValue({ ward: undefined });
            // console.log('Wards set:', wardsData);
        } catch (error) {
            console.error("Error fetching wards:", error);
            setWards([]);
        }
    };
    const handleUpdate = async (values) => {
        setLoading(true);
        let payload;
        try {
            const selectedProvince = provinces.find(p => p.ProvinceID === values.province);
            const selectedDistrict = districts.find(d => d.DistrictID === values.district);
            const selectedWard = wards.find(w => w.WardCode === values.ward);

            payload = {
                AddDetail: values.addDetail || "",
                city: selectedProvince ? selectedProvince.ProvinceName : "",
                district: selectedDistrict ? selectedDistrict.DistrictName : "",
                ward: selectedWard ? selectedWard.WardName : ""
            };
            const response = await api.post("Address/create", payload);

            if (response.data.statusCode === 200) {
                message.success("Địa chỉ đã được cập nhật thành công!");
                const newAddress = {
                    addDetail: payload.AddDetail,
                    city: payload.city,
                    district: payload.district,
                    ward: payload.ward,
                    country: "Việt Nam",
                    isDefault: false,
                    status: "Active"
                };

                if (onAddressAdded) {
                    onAddressAdded(newAddress);
                }
                if (refreshAddressData) {
                    refreshAddressData();
                }

                onClose();
            } else {
                message.error(`Cập nhật thất bại: ${response.data.message || response.data.detail || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error("Error creating address:", {
                dataSent: payload,
                response: error.response?.data || error.message
            });
            const errorMessage = error.response?.data?.detail || error.response?.data?.Message || error.message || 'Lỗi server';
            message.error(`Lỗi khi tạo địa chỉ: ${errorMessage}`);
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
                    label="Tỉnh"
                    name="province"
                    rules={[{ required: true, message: "Vui lòng chọn tỉnh!" }]}
                >
                    <Select
                        onChange={(value) => fetchDistricts(value)}
                        placeholder="Chọn tỉnh"
                        loading={!provinces.length}
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
                        loading={districts.length === 0 && provinces.length > 0}
                    >
                        {Array.isArray(districts) && districts.length > 0 ? (
                            districts.map(district => (
                                <Option
                                    key={district.DistrictID}
                                    value={district.DistrictID}
                                >
                                    {district.DistrictName}
                                </Option>
                            ))
                        ) : (
                            <Option value="" disabled>Không có dữ liệu quận/huyện</Option>
                        )}
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
                        loading={wards.length === 0 && districts.length > 0} // Show loading when fetching
                    >
                        {Array.isArray(wards) && wards.length > 0 ? (
                            wards.map(ward => (
                                <Option
                                    key={ward.WardCode}
                                    value={ward.WardCode}
                                >
                                    {ward.WardName}
                                </Option>
                            ))
                        ) : (
                            <Option value="" disabled>Không có dữ liệu phường/xã</Option>
                        )}
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