import React, { useState, useEffect } from 'react';
import { Table, message, Spin, Button, Modal, Form, Input, Select, Menu, Dropdown, Space, Tooltip } from 'antd';
import api from '../../config/api';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import { Option } from 'antd/es/mentions';
import { MoreOutlined } from '@ant-design/icons';
import BigNumber from "bignumber.js";


const ManageBrand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false); // Để kiểm soát modal
    const [form] = Form.useForm(); // Tạo form
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [updateForm] = Form.useForm();
    const [selectedBrand, setSelectedBrand] = useState(null);


    useEffect(() => {
        fetchBrands(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchBrands = async (page, pageSize) => {
        setLoading(true);
        try {
            const response = await api.get(`Products/brands?page=${page}&pageSize=${pageSize}`);
            if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
                console.log("Fetched brand data:", response.data.data.items); // Kiểm tra ID có đúng không
                setBrands(response.data.data.items.map(brand => ({
                    ...brand,
                    brandId: BigInt(brand.brandId)
                })));

                setPagination({
                    current: response.data.data.page,
                    pageSize: response.data.data.pageSize,
                    total: response.data.data.totalItems,
                });
            } else {
                setBrands([]);
                message.error('Dữ liệu thương hiệu không đúng định dạng!');
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            setBrands([]);
            message.error('Lỗi khi tải danh sách thương hiệu!');
        } finally {
            setLoading(false);
        }
    };


    const handleTableChange = (pagination) => {
        setPagination({ ...pagination });
    };


    // Hàm mở modal update (tạo sau)
    const handleUpdate = (record) => {
        console.log("Selected Brand Data:", record);

        setSelectedBrand(record);


        updateForm.setFieldsValue({
            brandName: record.brandName,
            brandDesc: record.brandDesc,
            brandOrigin: record.brandOrigin,
            brandStatus: record.brandStatus ? 'Active' : 'Inactive',
        })

        console.log("Form Values After Set:", updateForm.getFieldsValue()); // Kiểm tra lại
        setIsUpdateModalVisible(true);
    };

    const handleUpdateSubmit = async (values) => {
        if (!selectedBrand || !selectedBrand.brandId) {
            message.error("Brand ID is missing!");
            return;
        }
        const bigIntId = BigInt(selectedBrand.brandId);
const safeNumber = Math.min(Number(bigIntId), Number.MAX_SAFE_INTEGER);

        const payload = {
            brandId: safeNumber,
            brandName: values.brandName.trim(),
            brandDesc: values.brandDesc.trim() || "N/A",
            brandOrigin: values.brandOrigin.trim() || "Unknown",
            brandStatus: values.brandStatus === 'Active' ? true : false,
        };

        console.log("✅ FINAL Payload sent to API:", payload);

        try {
            await api.put('Products/brand/update', payload);
            message.success('Cập nhật thương hiệu thành công!');
            setIsUpdateModalVisible(false);
            fetchBrands(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error('❌ Error updating brand:', error.response?.data || error);
            message.error(`Lỗi khi cập nhật thương hiệu: ${error.response?.data?.message || 'Không xác định'}`);
        }
    };



    // Hàm xóa thương hiệu
    const handleDelete = async (brandId) => {
        try {
            await api.delete(`Products/brand/delete/${brandId}`);
            message.success("Xóa thương hiệu thành công!");
            fetchBrands(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error("Lỗi khi xóa thương hiệu:", error);
            message.error("Lỗi khi xóa thương hiệu!");
        }
    };

    // Menu dropdown cho cột Action
    const getActionMenu = (record) => (
        <Menu>
            <Menu.Item key="update" onClick={() => handleUpdate(record)}>
                Update
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDelete(record.brandId)} danger>
                Delete
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: 'Brand ID',
            dataIndex: 'brandId',
            key: 'brandId',
            align: 'center',
            render: (id) => {
                if (!id) return '-';
                try {
                    return BigInt(id).toString();
                } catch (error) {
                    console.error("Error converting ID to BigInt:", error);
                    return id.toString();
                }
            },
        },

        {
            title: 'Brand Name',
            dataIndex: 'brandName',
            key: 'brandName',
            align: 'center',
        },
        {
            title: 'Brand Description',
            dataIndex: 'brandDesc',
            key: 'brandDesc',
            align: 'center',
            render: (desc) => (
                <Tooltip title={desc}>
                    {desc.length > 30 ? `${desc.slice(0, 30)}...` : desc}
                </Tooltip>
            ),
        },
        {
            title: 'Brand Origin',
            dataIndex: 'brandOrigin',
            key: 'brandOrigin',
            align: 'center',
        },
        {
            title: 'Brand Status',
            dataIndex: 'brandStatus',
            key: 'brandStatus',
            align: 'center',
            render: (status) => (status ? 'Active' : 'Inactive'),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Dropdown overlay={getActionMenu(record)} trigger={['click']}>
                    <Space>
                        <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                    </Space>
                </Dropdown>
            ),
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddBrand = async (values) => {
        console.log("Form values being sent:", values);

        try {
            const response = await api.post('Products/brand/create', {
                brandName: values.brandName,
                brandDesc: values.brandDesc,
                brandOrigin: values.brandOrigin,
                brandStatus: values.brandStatus === 'Active' ? 'true' : 'false',
            });

            console.log("Response from API:", response.data);

            if (response.status === 200 && response.data) {
                const newBrand = response.data;

                if (!newBrand.brandId) {
                    console.warn("API did not return brandId! Refreshing brand list...");
                    message.success('Thêm thương hiệu thành công!');

                    setIsModalVisible(false);
                    form.resetFields();
                    fetchBrands(pagination.current, pagination.pageSize);
                    return;
                }

                try {
                    newBrand.brandId = BigInt(newBrand.brandId).toString();
                } catch (error) {
                    console.warn("Error converting brandId:", error);
                }

                setBrands(prevBrands => [newBrand, ...prevBrands]);

                message.success('Thêm thương hiệu thành công!');
                setIsModalVisible(false);
                form.resetFields();
            }
        } catch (error) {
            console.error('Error adding brand:', error.response?.data || error);
            message.error(`Lỗi khi thêm thương hiệu: ${error.response?.data?.message || 'Không xác định'}`);
        }
    };





    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <ManageOrderHeader />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: '250px' }}>
                    <h1 style={{ fontSize: '40px', textAlign: 'left' }}>Brands</h1>

                    <Button
                        type="primary"
                        onClick={showModal}
                        style={{ marginBottom: '20px', backgroundColor: '#D8959A', borderColor: '#D8959A' }}>
                        Add Brand
                    </Button>

                    {loading ? (
                        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <Table
                                dataSource={brands || []}
                                columns={columns}
                                rowKey="brandId"
                                pagination={{
                                    ...pagination,
                                    position: ['bottomCenter'], // Đặt phân trang ở giữa
                                }}
                                onChange={handleTableChange}
                                locale={{ emptyText: 'Không có dữ liệu' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title="Add New Brand"
                visible={isModalVisible}
                onOk={() => form.submit()} // Đảm bảo gửi form
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical" onFinish={handleAddBrand}>
                    <Form.Item
                        name="brandName"
                        label="Brand Name"
                        rules={[{ required: true, message: "'brandName' is required" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="brandDesc"
                        label="Brand Description"
                        rules={[{ required: true, message: "'brandDesc' is required" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="brandOrigin"
                        label="Brand Origin"
                        rules={[{ required: true, message: "'brandOrigin' is required" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="brandStatus"
                        label="Brand Status"
                        rules={[{ required: true, message: "Please select a status" }]}>
                        <Select>
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Update Brand"
                visible={isUpdateModalVisible}
                onOk={() => updateForm.submit()}
                onCancel={() => setIsUpdateModalVisible(false)}
            >
                <Form form={updateForm} layout="vertical" onFinish={handleUpdateSubmit}>
                    <Form.Item
                        name="brandName"
                        label="Brand Name"
                        rules={[{ required: true, message: "'brandName' is required" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="brandDesc"
                        label="Brand Description"
                        rules={[{ required: true, message: "'brandDesc' is required" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="brandOrigin"
                        label="Brand Origin"
                        rules={[{ required: true, message: "'brandOrigin' is required" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="brandStatus"
                        label="Brand Status"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ManageBrand;
