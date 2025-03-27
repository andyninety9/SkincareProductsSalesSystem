import Title from 'antd/es/typography/Title';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import api from '../../config/api';
import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Card, List, Image, message } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import moment from 'moment';

export default function ManageReturnPage() {
    const [returnRequests, setReturnRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleFetchAllReturnRequest = async () => {
        setLoading(true);
        try {
            const response = await api.get(
                `return/all?keyword=&page=${pagination.current}&limit=${pagination.pageSize}`
            );

            // Sort data by returnStatus (false first) and then by returnDate (newest first)
            const sortedData = [...response.data.data.items].sort((a, b) => {
                // First sort by returnStatus (false comes first)
                if (a.returnStatus !== b.returnStatus) {
                    return a.returnStatus ? 1 : -1;
                }
                // Then sort by returnDate (newest first)
                return new Date(b.returnDate) - new Date(a.returnDate);
            });

            setReturnRequests(sortedData);
            setPagination({
                ...pagination,
                total: response.data.data.totalItems,
            });
        } catch (error) {
            console.log(error);
            message.error('Failed to fetch return requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchAllReturnRequest();
    }, [pagination.current, pagination.pageSize]);

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const showReturnDetails = (record) => {
        setSelectedReturn(record);
        setIsModalVisible(true);
    };

    const handleProcessReturn = async (returnId) => {
        Modal.confirm({
            title: 'Process Return Request',
            content: 'Are you sure you want to process this return request?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    setLoading(true);
                    await api.put(`return/process/${returnId}`);
                    message.success('Return request processed successfully');
                    handleFetchAllReturnRequest(); // Refresh the list
                } catch (error) {
                    console.log(error);
                    message.error('Failed to process return request');
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Return ID',
            dataIndex: 'returnId',
            key: 'returnId',
            render: (id) => <span>#{id.toString().slice(-8)}</span>,
        },
        {
            title: 'Customer',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <div>
                    <div>{user.fullname || 'No Name'}</div>
                    <div>{user.email}</div>
                </div>
            ),
        },
        {
            title: 'Return Date',
            dataIndex: 'returnDate',
            key: 'returnDate',
            render: (date) => moment(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Refund Amount',
            dataIndex: 'refundAmount',
            key: 'refundAmount',
            render: (amount) => `₫${amount.toLocaleString()}`,
        },
        {
            title: 'Products',
            dataIndex: 'returnProducts',
            key: 'returnProducts',
            render: (products) => (
                <Button type="link" onClick={() => showReturnDetails({ returnProducts: products })}>
                    View {products.length} product{products.length > 1 ? 's' : ''}
                </Button>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'returnStatus',
            key: 'returnStatus',
            render: (status) => <Tag color={status ? 'green' : 'volcano'}>{status ? 'Processed' : 'Pending'}</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        disabled={record.returnStatus}
                        onClick={() => handleProcessReturn(record.returnId)}
                        loading={loading}>
                        Process Return
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', flexDirection: 'column' }}>
            <ManageOrderHeader />
            <div style={{ display: 'flex', flex: 1, marginTop: '60px', overflow: 'hidden' }}>
                <ManageOrderSidebar />
                <div style={{ flex: 1, padding: '24px', overflowY: 'auto', marginLeft: '250px' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                        }}>
                        <Title level={2}>Manage Return</Title>
                    </div>

                    <Card>
                        <Table
                            columns={columns}
                            dataSource={returnRequests}
                            rowKey="returnId"
                            pagination={pagination}
                            onChange={handleTableChange}
                            loading={loading}
                        />
                    </Card>

                    <Modal
                        title="Return Products"
                        open={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                        width={600}>
                        {selectedReturn && (
                            <List
                                itemLayout="horizontal"
                                dataSource={selectedReturn.returnProducts}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Image width={60} src={item.productImage} />}
                                            title={item.productName}
                                            description={
                                                <div>
                                                    <div>Price: ₫{item.sellPrice.toLocaleString()}</div>
                                                    <div>Quantity: {item.quantity}</div>
                                                    <div>
                                                        Total: ₫{(item.sellPrice * item.quantity).toLocaleString()}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
}
