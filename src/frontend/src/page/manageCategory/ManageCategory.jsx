import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import api from '../../config/api';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';

const ManageCategory = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('Products/categories?page=1&pageSize=1000'); // Lấy danh sách danh mục
                if (response.data) {
                    setCategories(response.data); // Cập nhật danh sách vào state
                } else {
                    message.error('Không tìm thấy dữ liệu danh mục!');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                message.error('Lỗi khi tải danh mục!');
            }
        };

        fetchCategories();
    }, []);

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
            title: 'Category Status',
            dataIndex: 'cateProdStatus',
            key: 'cateProdStatus',
            align: 'center',
            render: (status) => (status ? 'Active' : 'Inactive'),
        },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <ManageOrderHeader />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: '250px' }}>
                    <h1>Manage Categories</h1>
                    <Table
                        dataSource={categories}
                        columns={columns}
                        rowKey="cateProdId"
                        pagination={{
                            position: ['bottomCenter'],
                            pageSize: 10,
                            total: categories.length,
                        }}
                        locale={{ emptyText: 'Không có dữ liệu' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManageCategory;
