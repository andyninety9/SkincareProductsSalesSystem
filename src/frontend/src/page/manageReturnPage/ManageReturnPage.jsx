import Title from 'antd/es/typography/Title';
import ManageOrderHeader from '../../component/manageOrderHeader/ManageOrderHeader';
import ManageOrderSidebar from '../../component/manageOrderSidebar/ManageOrderSidebar';
import api from '../../config/api';
import { useEffect, useRef, useState } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Modal,
    Card,
    List,
    Image,
    message,
    Tooltip,
    Upload,
    Descriptions,
    Typography,
    Input,
    Alert,
    Radio,
} from 'antd';
import {
    ShoppingOutlined,
    UploadOutlined,
    CopyOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined,
    PlusOutlined,
    SearchOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Paragraph } = Typography;
const { Search } = Input; // Added Search component

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
    const [customerInfoVisible, setCustomerInfoVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [currentReturnId, setCurrentReturnId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [processModalVisible, setProcessModalVisible] = useState(false);
    const [processingReturn, setProcessingReturn] = useState(null);
    const [processNote, setProcessNote] = useState('');
    const [processLoading, setProcessLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(true);

    const searchDebounceRef = useRef(null);

    const handleFetchAllReturnRequest = async (keyword = '') => {
        setLoading(true);
        try {
            const response = await api.get(
                `return/all?keyword=${keyword}&page=${pagination.current}&limit=${pagination.pageSize}`
            );

            // Process the data and convert IDs to BigInt
            const processedData = response.data.data.items.map((item) => ({
                ...item,
                // Cast returnId and ordIdd to BigInt
                returnId: BigInt(item.returnId),
                ordIdd: BigInt(item.ordIdd),
                // Also convert user ID if needed
                user: {
                    ...item.user,
                    usrId: BigInt(item.user.usrId),
                },
            }));

            // Sort data by returnStatus (false first) and then by returnDate (newest first)
            const sortedData = [...processedData].sort((a, b) => {
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
        handleFetchAllReturnRequest(searchKeyword);
    }, [pagination.current, pagination.pageSize]);

    const handleSearch = (value) => {
        setSearchKeyword(value);

        // Clear previous timeout if exists
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }

        // Set new timeout (500ms debounce)
        searchDebounceRef.current = setTimeout(() => {
            // Reset to first page when searching
            setPagination({
                ...pagination,
                current: 1,
            });
            handleFetchAllReturnRequest(value);
        }, 500);
    };

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const showReturnDetails = (record) => {
        setSelectedReturn(record);
        setIsModalVisible(true);
    };

    const showCustomerInfo = (user) => {
        setSelectedCustomer(user);
        setCustomerInfoVisible(true);
    };

    const handleProcessReturn = async () => {
        if (!processingReturn) return;

        setProcessLoading(true);
        try {
            await api.post('return/process', {
                returnId: processingReturn.returnId.toString(),
                status: selectedStatus,
            });

            message.success('Return request processed successfully');
            setProcessModalVisible(false);
            handleFetchAllReturnRequest(searchKeyword); // Refresh the list
        } catch (error) {
            console.error('Process error:', error);
            message.error('Failed to process return request');
        } finally {
            setProcessLoading(false);
        }
    };

    const showUploadModal = (returnId) => {
        setCurrentReturnId(returnId);
        setFileList([]);
        setUploadVisible(true);
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning('Please select at least one image');
            return;
        }

        try {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('images', file.originFileObj);
            });

            setLoading(true);
            await api.post(`return/upload-images/${currentReturnId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            message.success('Images uploaded successfully');
            setUploadVisible(false);
            // You might want to refresh the return request data here
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Failed to upload images');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => message.success('Copied to clipboard!'))
            .catch(() => message.error('Failed to copy'));
    };

    const showProcessModal = (record) => {
        setProcessingReturn(record);
        setProcessNote('');
        setSelectedStatus(true); // Default to true when opening modal
        setProcessModalVisible(true);
    };

    const getGenderText = (gender) => {
        switch (gender) {
            case 0:
                return 'Male';
            case 1:
                return 'Female';
            case 2:
                return 'Other';
            default:
                return 'Not specified';
        }
    };

    const uploadProps = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            // Validate file type
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
                return Upload.LIST_IGNORE;
            }

            // Validate file size (limit to 5MB)
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('Image must be smaller than 5MB!');
                return Upload.LIST_IGNORE;
            }

            setFileList([...fileList, file]);
            return false; // Prevent auto upload
        },
        fileList,
    };

    const columns = [
        {
            title: 'Return ID',
            dataIndex: 'returnId',
            key: 'returnId',
            render: (id) => <span>#{typeof id === 'bigint' ? id.toString().slice(-8) : id.toString().slice(-8)}</span>,
        },
        {
            title: 'Customer',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <div>
                    <div>{user.fullname || 'No Name'}</div>
                    <div>
                        <Tooltip title="Click to view full details">
                            <Button type="link" style={{ padding: 0 }} onClick={() => showCustomerInfo(user)}>
                                <InfoCircleOutlined /> View Details
                            </Button>
                        </Tooltip>
                    </div>
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
            render: (products, record) => (
                <Space>
                    <Button type="link" onClick={() => showReturnDetails({ returnProducts: products })}>
                        View {products.length} product{products.length > 1 ? 's' : ''}
                    </Button>
                    <Button
                        type="dashed"
                        icon={<UploadOutlined />}
                        onClick={() => showUploadModal(record.returnId)}
                        size="small">
                        Upload Images
                    </Button>
                </Space>
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
                        onClick={() => showProcessModal(record)}
                        icon={<CheckCircleOutlined />}>
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
                        <Title level={2}
                            style={{
                                fontFamily: 'Marko One, sans-serif',
                                fontSize: '40px',
                            }}>
                            Manage Return
                        </Title>

                    </div>
                    {/* Search input */}
                    <div style={{ marginBottom: 16 }}>
                        <Search
                            placeholder="Search by return ID, customer name or email"
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => handleSearch(e.target.value)}
                            loading={loading}
                            style={{ maxWidth: 500 }}
                        />
                    </div>

                    <Card>
                        <Table
                            columns={columns}
                            dataSource={returnRequests}
                            rowKey={(record) => record.returnId.toString()}
                            pagination={pagination}
                            onChange={handleTableChange}
                            loading={loading}
                        />
                    </Card>

                    {/* Product Details Modal */}
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

                    {/* Customer Info Modal */}
                    <Modal
                        title="Customer Information"
                        open={customerInfoVisible}
                        onCancel={() => setCustomerInfoVisible(false)}
                        footer={null}
                        width={600}>
                        {selectedCustomer && (
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Full Name">
                                    {selectedCustomer.fullname || 'Not provided'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    <Space>
                                        {selectedCustomer.email}
                                        <Tooltip title="Copy Email">
                                            <Button
                                                type="text"
                                                icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(selectedCustomer.email)}
                                                size="small"
                                            />
                                        </Tooltip>
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    <Space>
                                        {selectedCustomer.phone}
                                        <Tooltip title="Copy Phone">
                                            <Button
                                                type="text"
                                                icon={<CopyOutlined />}
                                                onClick={() => copyToClipboard(selectedCustomer.phone)}
                                                size="small"
                                            />
                                        </Tooltip>
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Gender">
                                    {getGenderText(selectedCustomer.gender)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Customer ID">{selectedCustomer.usrId}</Descriptions.Item>
                            </Descriptions>
                        )}
                    </Modal>

                    {/* Image Upload Modal */}
                    <Modal
                        title="Upload Product Condition Images"
                        open={uploadVisible}
                        onOk={handleUpload}
                        onCancel={() => setUploadVisible(false)}
                        confirmLoading={loading}>
                        <Upload listType="picture-card" multiple {...uploadProps}>
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                        <Typography.Paragraph type="secondary">
                            Please upload clear images showing the condition of returned products. Max size: 5MB per
                            image.
                        </Typography.Paragraph>
                    </Modal>
                    {/* Process Return Modal */}
                    <Modal
                        title="Process Return Request"
                        open={processModalVisible}
                        onCancel={() => setProcessModalVisible(false)}
                        footer={[
                            <Button key="back" onClick={() => setProcessModalVisible(false)}>
                                Cancel
                            </Button>,
                            <Button key="submit" type="primary" loading={processLoading} onClick={handleProcessReturn}>
                                Process Return
                            </Button>,
                        ]}
                        width={700}>
                        {processingReturn && (
                            <div>
                                <Descriptions title="Return Details" bordered column={1} style={{ marginBottom: 20 }}>
                                    <Descriptions.Item label="Return ID">
                                        #{processingReturn.returnId.toString().slice(-8)}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Customer">
                                        {processingReturn.user?.fullname || 'No Name'} ({processingReturn.user?.email})
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Return Date">
                                        {moment(processingReturn.returnDate).format('DD/MM/YYYY')}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Refund Amount">
                                        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                            ₫{processingReturn.refundAmount.toLocaleString()}
                                        </span>
                                    </Descriptions.Item>
                                </Descriptions>

                                <Card title="Products to Return" style={{ marginBottom: 20 }}>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={processingReturn.returnProducts || []}
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
                                                                Total: ₫
                                                                {(item.sellPrice * item.quantity).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>

                                <div style={{ marginBottom: 20 }}>
                                    <Typography.Title level={5}>Process Status</Typography.Title>
                                    <Radio.Group
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        buttonStyle="solid">
                                        <Radio.Button value={true}>
                                            <CheckCircleOutlined /> Approve Return
                                        </Radio.Button>
                                        <Radio.Button value={false}>
                                            <CloseCircleOutlined /> Reject Return
                                        </Radio.Button>
                                    </Radio.Group>
                                    <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
                                        {selectedStatus
                                            ? 'Approving will refund the customer and update inventory.'
                                            : 'Rejecting will deny the return request and notify the customer.'}
                                    </Typography.Paragraph>
                                </div>

                                <div style={{ marginBottom: 20 }}>
                                    <Typography.Title level={5}>Processing Notes</Typography.Title>
                                    <Input.TextArea
                                        placeholder="Add any notes about this return process (optional)"
                                        value={processNote}
                                        onChange={(e) => setProcessNote(e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <Alert
                                    message="Important"
                                    description="Processing this return will refund the customer and update inventory. This action cannot be undone."
                                    type="warning"
                                    showIcon
                                />
                            </div>
                        )}
                    </Modal>
                </div>
            </div>
        </div>
    );
}
