import React, { useState, useEffect } from 'react';
import { Table, message, Spin, Button, Modal, Form, Input, Select, Menu, Dropdown, Space } from 'antd';
import api from '../../config/api';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import { Option } from 'antd/es/mentions';
import { MoreOutlined } from '@ant-design/icons';


const ManageBrand = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false); // Để kiểm soát modal
    const [form] = Form.useForm(); // Tạo form

    useEffect(() => {
        fetchBrands(pagination.current, pagination.pageSize);
    }, [pagination.current, pagination.pageSize]);

    const fetchBrands = async (page, pageSize) => {
        setLoading(true);
        try {
            const response = await api.get(`Products/brands?page=${page}&pageSize=${pageSize}`);
            if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
                setBrands(response.data.data.items);
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
    console.log("Update brand:", record);
    // Mở modal update (chưa làm phần UI)
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
        console.log("Form values being sent:", values); // Debug dữ liệu đầu vào

        try {
            const response = await api.post('Products/brand/create', {
                brandName: values.brandName,
                brandDesc: values.brandDesc,
                brandOrigin: values.brandOrigin,
                brandStatus: values.brandStatus === 'Active' ? 'true' : 'false',
            });

            if (response.status === 200) {
                message.success('Thêm thương hiệu thành công!');
                fetchBrands(pagination.current, pagination.pageSize);
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

        </div>
    );
};

export default ManageBrand;
