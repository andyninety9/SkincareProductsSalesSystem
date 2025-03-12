import React, { useState, useEffect } from 'react';
import { Table, message, Button, Dropdown, Menu, Modal, Form, Input } from 'antd';
import { ExclamationCircleOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../config/api';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';

const { confirm } = Modal;


const ManageCategory = () => {
    const [categories, setCategories] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' hoặc 'edit'
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCategories();
    }, []);

    /** 🛠 FETCH API: Lấy danh mục */
    const fetchCategories = async () => {
        try {
            const response = await api.get('Products/categories?page=1&pageSize=100'); // Đảm bảo URL đúng
            console.log("📌 API Response:", response.data);

            if (response.data?.data?.items) {
                // 🔥 Lọc danh mục có cateProdStatus = true
                const filteredCategories = response.data.data.items.filter(item => item.cateProdStatus === true);

                setCategories(filteredCategories);
            } else {
                console.error("❌ Dữ liệu danh mục không hợp lệ:", response.data);
                setCategories([]);
                message.error('Dữ liệu danh mục không hợp lệ!');
            }
        } catch (error) {
            console.error('🚨 Lỗi khi tải danh mục:', error);
            message.error('Lỗi khi tải danh mục!');
        }
    };


    /** 🛠 FETCH API: Thêm danh mục */
    const addCategory = async (values) => {
        try {
            // 🔥 Đúng format theo Swagger API
            const payload = {
                categoryName: values.categoryName // Đổi `Name` thành `categoryName`
            };

            console.log("🚀 Payload gửi lên API (Add):", JSON.stringify(payload, null, 2));

            const response = await api.post('Products/category/create', payload);

            if (response.status === 200 || response.status === 201) {
                message.success('✅ Thêm danh mục mới thành công!');
                setIsModalVisible(false);
                fetchCategories(); // Cập nhật danh sách
            } else {
                message.error(`⚠️ Thêm danh mục thất bại: ${response.data.message || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error("❌ Lỗi khi thêm danh mục:", error);

            if (error.response) {
                console.error("🔴 API Trả về lỗi:", JSON.stringify(error.response.data, null, 2));
                message.error(`Lỗi từ server: ${error.response.data.message || 'Không xác định'}`);
            } else {
                message.error('Không thể kết nối đến server!');
            }
        }
    };


    /** 🛠 FETCH API: Cập nhật danh mục */
    const updateCategory = async (values) => {
        try {
            if (!selectedCategory || !selectedCategory.cateProdId) {
                message.error("❌ Không tìm thấy danh mục cần cập nhật!");
                return;
            }

            const payload = {
                categoryId: Number(selectedCategory.cateProdId), // 🔥 Đổi `CategoryId` thành `id`
                categoryName: values.categoryName // 🔥 Đổi `CategoryName` thành `cateName`
            };

            console.log("🚀 Payload gửi lên API (Update):", JSON.stringify(payload, null, 2));

            await api.post('products/category/update', payload);

            message.success('✅ Cập nhật danh mục thành công!');
            setIsModalVisible(false);
            fetchCategories();

        } catch (error) {
            console.error("❌ Lỗi khi cập nhật danh mục:", error);

            if (error.response) {
                console.error("🔴 API Trả về lỗi:", JSON.stringify(error.response.data, null, 2));
                message.error(`Lỗi từ server: ${error.response.data.title || 'Không xác định'}`);
            } else {
                message.error('Không thể kết nối đến server!');
            }
        }
    };




    /** 🛠 FETCH API: Xóa danh mục */
    const handleDelete = async (record) => {
        try {
            console.log("📌 Đang gửi request xóa danh mục với ID:", record.cateProdId);
            await api.delete('Products/category/delete', {
                data: { categoryId: record.cateProdId }
            });
            console.log(`🚀 Đã xóa danh mục ${record.cateProdName} thành công!`);

            message.success(`🗑 Xóa danh mục: ${record.cateProdName} thành công!`);
            await fetchCategories();

        } catch (error) {
            console.error("❌ Lỗi khi xóa danh mục:", error);
            if (error.response) {
                console.error("🔴 API Trả về lỗi:", error.response.data);
                message.error(`Lỗi từ server: ${error.response.data.message || 'Không xác định'}`);
            } else {
                message.error('Không thể kết nối đến server!');
            }
        }
    };

    const showDeleteConfirm = (record) => {
        confirm({
            title: "Are you sure you want to delete this category?",
            icon: <ExclamationCircleOutlined />,
            content: `Category: ${record.cateProdName}`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                handleDelete(record);
            },
        });
    };



    /** 🎯 Xử lý khi bấm nút Add */
    const handleAddCategory = () => {
        setModalType('add');
        setSelectedCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    /** 🎯 Xử lý khi bấm nút Update */
    const handleUpdate = (record) => {
        console.log("📌 Dữ liệu danh mục trước khi cập nhật:", record);
        setModalType('edit');
        setSelectedCategory(record);
        form.setFieldsValue({ categoryName: record.cateProdName });
        setIsModalVisible(true);
    };


    /** 🎯 Xử lý khi bấm OK trong Modal */
    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (modalType === 'add') {
                await addCategory(values);
            } else {
                await updateCategory(values);
            }
        } catch (error) {
            console.error("❌ Lỗi xử lý form:", error);
        }
    };

    const columns = [
        {
            title: 'Category ID',
            dataIndex: 'cateProdId',
            key: 'cateProdId',
            align: 'center',
        },
        {
            title: 'Category Name',
            dataIndex: 'cateProdName',
            key: 'cateProdName',
            align: 'center',
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (text, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="update" onClick={() => handleUpdate(record)}>
                                Update
                            </Menu.Item>
                            <Menu.Item key="delete" onClick={() => showDeleteConfirm(record)}>
                                Delete
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <Button shape="circle" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <ManageOrderHeader />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: '250px' }}>
                    <h1>Manage Categories</h1>

                    {/* 🔥 Button "Add Category" */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddCategory}
                            style={{ backgroundColor: "#D8959A", borderColor: "#D8959A" }}
                        >
                            Add Category
                        </Button>

                    </div>

                    <Table
                        dataSource={Array.isArray(categories) ? categories : []}
                        columns={columns}
                        rowKey="cateProdId"
                        pagination={{
                            position: ['bottomCenter'],
                            pageSize: 10,
                            total: categories.length,
                        }}
                        locale={{ emptyText: 'Không có dữ liệu' }}
                    />

                    {/* 🔥 Modal Thêm & Cập Nhật Danh Mục */}
                    <Modal
                        title={modalType === 'add' ? 'Add Category' : 'Edit Category'}
                        visible={isModalVisible}
                        onOk={handleModalOk}
                        onCancel={() => setIsModalVisible(false)}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                label="Category Name"
                                name="categoryName" // 🔥 Đổi lại đúng key API yêu cầu
                                rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                            >
                                <Input placeholder="Nhập tên danh mục..." />
                            </Form.Item>

                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ManageCategory;
