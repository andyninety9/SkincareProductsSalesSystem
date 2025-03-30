import React, { useState, useEffect } from 'react';
import api from '../../config/api';
import { MailOutlined, PhoneOutlined, CalendarOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Avatar, Input, Tabs, List, Button, Tag, Row, Col, Modal, Form, message, Upload, Spin, Pagination } from 'antd';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import UpdateProfileModal from './UpdateProfileModal';
import AddressModal from './AddressModal';
import ChangePasswordModal from './ChangePasswordModal';
import 'antd/dist/reset.css';
import './ProfilePage.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    MinusCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

const statusConfig = {
    Pending: { icon: <ClockCircleOutlined />, color: 'default' },
    Processing: { icon: <SyncOutlined spin />, color: '#E6B2BA' },
    Shipping: { icon: <SyncOutlined />, color: 'blue' },
    Shipped: { icon: <CheckCircleOutlined />, color: 'cyan' },
    Completed: { icon: <CheckCircleOutlined />, color: 'success' },
    Cancelled: { icon: <CloseCircleOutlined />, color: 'error' },
};

const ProfilePage = () => {
    const navigate = useNavigate();
    //addresses
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    //promo codes
    const [promoCodes, setPromoCodes] = useState([]);
    const [loadingPromos, setLoadingPromos] = useState(true);
    //orders history
    const [ordersHistory, setOrdersHistory] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [orderPagination, setOrderPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchOrderText, setSearchOrderText] = useState('');
    const [filteredOrdersHistory, setFilteredOrdersHistory] = useState([]);
    //user info
    const [userInfo, setUserInfo] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [activeTab, setActiveTab] = useState('1');
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    //user avatar
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(userInfo.avatarUrl);
    //user cover
    const [coverFile, setCoverFile] = useState(null);
    const [coverLoading, setCoverLoading] = useState(false);
    const [coverPreview, setCoverPreview] = useState(null);
    //change password
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchPromoCodes(),
                    fetchAddresses(),
                    refreshUserData(),
                    fetchOrdersHistory(orderPagination.current, orderPagination.pageSize)
                ]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                message.error('Failed to load initial data.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    // Cleanup useEffect for avatar preview
    useEffect(() => {
        return () => {
            if (avatarPreview && avatarPreview !== userInfo?.avatarUrl) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview, userInfo?.avatarUrl]);

    // Cleanup useEffect for cover preview
    useEffect(() => {
        return () => {
            if (coverPreview && coverPreview !== userInfo?.coverUrl) {
                URL.revokeObjectURL(coverPreview);
            }
        };
    }, [coverPreview, userInfo?.coverUrl]);

    const showAddressModal = () => {
        setIsAddressModalVisible(true);
    };

    const handleCloseAddressModal = () => {
        setIsAddressModalVisible(false);
    };

    const toBigIntString = (value) => {
        try {
            return value != null ? BigInt(value).toString() : 'N/A';
        } catch (error) {
            console.error(`Error converting to BigInt: ${value}`, error.message);
            return 'N/A';
        }
    };

    // Get all addresses
    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const response = await api.get('address/get-all-address?page=1&pageSize=1000');
            if (response.data.statusCode === 200) {
                const addressData = response.data.data.items;
                const formattedAddresses = Array.isArray(addressData)
                    ? addressData
                        .map((addr) => ({
                            addressId: addr.addressId,
                            addDetail: addr.addDetail,
                            ward: addr.ward,
                            district: addr.district,
                            city: addr.city,
                            country: addr.country,
                            isDefault: addr.isDefault,
                            status: addr.status,
                        }))
                        .filter((addr) => addr.status === true)
                    : [];
                formattedAddresses.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
                setAddresses(formattedAddresses);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            message.error('Error fetching addresses!');
        } finally {
            setLoadingAddresses(false);
        }
    };

    // Set default address
    const handleSelectDefault = async (index) => {
        const selectedAddress = addresses[index];
        if (!selectedAddress?.addressId) {
            message.error('Không thể chọn địa chỉ mặc định vì thiếu ID!');
            return;
        }
        try {
            const response = await api.put('Address/active', {
                addressId: selectedAddress.addressId,
            });
            if (response.data.statusCode === 200) {
                message.success('Đã đặt địa chỉ làm mặc định!');
                await fetchAddresses();
            } else {
                message.error(`Cập nhật địa chỉ mặc định thất bại: ${response.data.detail || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            message.error('Lỗi khi cập nhật địa chỉ mặc định!');
        }
    };

    const handleAddressAdded = (newAddress) => {
        setAddresses((prevAddresses) => {
            const hasDefault = prevAddresses.some((addr) => addr.isDefault);
            const updatedAddress = { ...newAddress, isDefault: !hasDefault };
            const newAddresses = [updatedAddress, ...prevAddresses];
            return newAddresses;
        });
        fetchAddresses();
    };

    // Delete address
    const deleteAddress = async (addressId) => {
        if (!addressId) {
            message.error('Không thể xóa địa chỉ vì thiếu ID!');
            return;
        }
        try {
            const response = await api.delete('Address/delete', {
                data: { addressId },
            });
            if (response.data.statusCode === 200) {
                message.success('Địa chỉ đã được xóa thành công!');
                setAddresses((prevAddresses) => prevAddresses.filter((addr) => addr.addressId !== addressId));
                await fetchAddresses();
            } else {
                message.error(`Xóa địa chỉ thất bại: ${response.data.detail || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            message.error('Lỗi khi xóa địa chỉ!');
        }
    };

    // Get all promo codes
    const fetchPromoCodes = async () => {
        try {
            setLoadingPromos(true);
            const response = await api.get('user/vouchers?page=1&pageSize=1000');
            if (response.data.statusCode === 200) {
                const data = response.data.data.items;
                setPromoCodes(data);
            }
        } catch (error) {
            console.error('Error fetching promo codes:', error);
            // message.error('Error fetching promo codes!');
        } finally {
            setLoadingPromos(false);
        }
    };

    // Get all orders
    const fetchOrdersHistory = async (page = 1, pageSize = 10) => { // Changed default pageSize to 10
        try {
            setLoadingOrders(true);
            const response = await api.get(`User/orders-history?page=${page}&pageSize=${pageSize}`);
            if (response.data.statusCode === 200) {
                const ordersData = response.data.data.items || [];
                const totalItems = response.data.data.totalItems || 0; // Should be 115
                setOrdersHistory(ordersData);
                setFilteredOrdersHistory(ordersData);
                setOrderPagination({
                    current: page, // e.g., 6
                    pageSize: pageSize, // e.g., 10
                    total: totalItems // e.g., 115
                });
            } else {
                console.log('Failed to fetch order history.');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    // Handle search in orders
    const handleOrderSearch = (e) => {
        const searchText = e.target.value.toLowerCase();
        setSearchOrderText(searchText);

        if (!searchText) {
            setFilteredOrdersHistory(ordersHistory);
            return;
        }

        const filtered = ordersHistory.filter(order =>
            toBigIntString(order.orderId).toLowerCase().includes(searchText) ||
            order.products.some(product =>
                product.productName.toLowerCase().includes(searchText)
            )
        );

        setFilteredOrdersHistory(filtered);
    };

    // Handle order pagination change
    const handleOrderPaginationChange = (page, pageSize) => {
        fetchOrdersHistory(page, pageSize);
    };

    // Get user data
    const refreshUserData = async () => {
        try {
            setLoading(true);
            const response = await api.get('User/get-me');
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                const data = response.data.data;
                setUserInfo({
                    ...data,
                    phone: data.phone || '',
                    fullname: data.fullname || '',
                    gender: data.gender || '',
                    email: data.email || '',
                    dob: data.dob || '',
                    name: data.name || '',
                    avatarUrl: data.avatarUrl || '',
                    coverUrl: data.coverUrl || '',
                });
                Cookies.set('user', JSON.stringify(response.data.data), {
                    expires: 5,
                    secure: true,
                });
                // Sync avatarPreview with the latest avatarUrl if no file is selected
                if (!avatarFile) {
                    setAvatarPreview(data.avatarUrl || '');
                }
                if (!coverFile) {
                    setCoverPreview(data.coverUrl || '');
                }
            } else {
                console.warn('Unexpected API response:', response);
                message.error('Failed to fetch user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                console.warn('Unauthorized! Redirecting to login...');
                // Add redirect logic here if needed
            }
            message.error('Error fetching user data!');
        } finally {
            setLoading(false);
        }
    };

    // Avatar upload
    const handleAvatarChange = async () => {
        if (!avatarFile) {
            message.error('Vui lòng chọn file ảnh để tải lên!');
            return;
        }
        const formData = new FormData();
        formData.append('avatarFile', avatarFile);
        try {
            setAvatarLoading(true);
            const response = await api.post('User/change-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.statusCode === 200) {
                message.success('Avatar đã được cập nhật thành công!');
                setAvatarFile(null);

                await refreshUserData();
            } else {
                message.error(`Cập nhật avatar thất bại: ${response.data.detail || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            message.error('Lỗi khi cập nhật avatar!');
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleResendVerifyEmail = async () => {
        try {
            const response = await api.post('authen/resend-verify-email', {
                email: userInfo.email,
            });
            if (response.data.statusCode === 200) {
                message.success('Đã gửi lại email xác thực!');
            } else {
                message.error(`Gửi lại email xác thực thất bại: ${response.data.detail || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            message.error('Lỗi khi gửi lại email xác thực!');
        }
    };

    // File selection for avatar upload
    const handleFileChange = (info) => {
        const file = info.file.originFileObj || info.file;
        setAvatarFile(file);
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };

    //cover change
    const handleCoverChange = async () => {
        if (!coverFile) {
            message.error('Vui lòng chọn file ảnh để tải lên!');
            return;
        }
        const formData = new FormData();
        formData.append('CoverFile', coverFile);
        try {
            setCoverLoading(true);
            const response = await api.post('User/change-cover', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.statusCode === 200) {
                message.success('Ảnh bìa đã được cập nhật thành công!');
                setCoverFile(null);
                await refreshUserData();
            } else {
                message.error(`Cập nhật ảnh bìa thất bại: ${response.data.detail || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error uploading cover:', error);
            message.error('Lỗi khi cập nhật ảnh bìa!');
        } finally {
            setCoverLoading(false);
        }
    };

    //cover uploaded
    const handleCoverFileChange = (info) => {
        const file = info.file.originFileObj || info.file;
        setCoverFile(file);
        const previewUrl = URL.createObjectURL(file);
        setCoverPreview(previewUrl);
    };

    //change password modal
    const showPasswordModal = () => {
        setIsPasswordModalVisible(true);
    };

    const handlePasswordModalClose = () => {
        setIsPasswordModalVisible(false);
    };

    if (loading) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '50px',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Spin size="large" tip="Đang tải..." style={{ color: '#D8959A' }} />
            </div>
        );
    }

    if (!userInfo) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>No user data available.</div>;
    }
    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}>
            <div style={{ position: 'relative', width: '100%', height: '30vh', marginBottom: 10 }}>
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: `url(${coverPreview ||
                            userInfo.coverUrl ||
                            'https://mavid-webapp.s3.ap-southeast-1.amazonaws.com/coverPhoto/690512381897342976/e61f2c74-3943-4287-889c-c6b960b95abe.jpg'
                            }) no-repeat center center`,
                        backgroundSize: 'cover',
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 2,
                        display: 'flex',
                        gap: '10px',
                    }}>
                    <Upload
                        name="CoverFile"
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleCoverFileChange}>
                        <Button
                            icon={<UploadOutlined />}
                            style={{
                                marginTop: 10,
                                backgroundColor: '#D8959A',
                                borderColor: '#D8959A',
                                color: '#fff',
                                minWidth: '80px',
                                height: '25px',
                                fontSize: '12px',
                            }}>
                            Đổi ảnh bìa
                        </Button>
                    </Upload>

                    {coverFile && (
                        <Button
                            style={{
                                marginTop: 10,
                                backgroundColor: '#C87E83',
                                borderColor: '#C87E83',
                                color: '#fff',
                                minWidth: '80px',
                                height: '25px',
                                fontSize: '12px',
                                padding: '2px 6px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                            type="primary"
                            loading={coverLoading}
                            onClick={handleCoverChange}>
                            Xác nhận
                        </Button>
                    )}
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 40,
                    flexGrow: 1,
                }}>
                <Card
                    style={{
                        width: 250,
                        minHeight: 400,
                        textAlign: 'center',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginTop: 80,
                    }}>
                    <Avatar
                        size={100}
                        src={
                            avatarPreview ||
                            'https://cloud.appwrite.io/v1/storage/buckets/67dbb6420032d8a2ee8f/files/67dbcb3d26027f2e8bc1/view?project=67dbb339000bfac45e0d'
                        } // Use default image if no avatar
                        style={{ border: '3px solid #D8959A' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Upload
                            name="avatarFile"
                            showUploadList={false}
                            beforeUpload={() => false} // Prevent automatic upload
                            onChange={handleFileChange}
                            style={{ marginTop: 10 }}>
                            <Button
                                icon={<UploadOutlined />}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: '#D8959A',
                                    borderColor: '#D8959A',
                                    color: '#fff',
                                    minWidth: '80px',
                                    height: '25px',
                                    fontSize: '12px',
                                }}>
                                Đổi Avatar
                            </Button>
                        </Upload>
                        {avatarFile && (
                            <Button
                                type="primary"
                                loading={avatarLoading}
                                onClick={() => handleAvatarChange(avatarFile)}
                                style={{
                                    marginTop: 10,
                                    backgroundColor: '#C87E83',
                                    borderColor: '#C87E83',
                                    color: '#fff',
                                    minWidth: '80px',
                                    height: '25px',
                                    fontSize: '12px',
                                    padding: '2px 6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                Xác nhận
                            </Button>
                        )}
                    </div>
                    <h3
                        style={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#D8959A',
                            fontSize: '20px',
                            marginTop: '10px',
                        }}>
                        {userInfo.name}
                    </h3>
                    <p
                        style={{
                            fontFamily: "'Nunito', sans-serif",
                            color: '#D8959A',
                            fontSize: '20px',
                            margin: '0',
                        }}>
                        {userInfo.fullname}
                    </p>
                    <p style={{ marginTop: '2px' }}>{userInfo.gender}</p>
                    <Input
                        prefix={<MailOutlined />}
                        value={userInfo.email || 'Đang cập nhật'}
                        disabled
                        style={{
                            marginBottom: 10,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            color: userInfo.email ? 'black' : '#888',
                            backgroundColor: 'white',
                            height: 50,
                        }}
                    />

                    <Input
                        prefix={<PhoneOutlined />}
                        value={userInfo.phone || 'Đang cập nhật'}
                        disabled
                        style={{
                            marginBottom: 10,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            color: userInfo.phone ? 'black' : '#888',
                            backgroundColor: 'white',
                            height: 50,
                        }}
                    />
                    <Input
                        prefix={<CalendarOutlined />}
                        value={userInfo.dob || 'Đang cập nhật'}
                        disabled
                        style={{
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            color: userInfo.dob ? 'black' : '#888',
                            backgroundColor: 'white',
                            height: 50,
                        }}
                    />
                    {userInfo.accountStatus === 'Unverified' && (
                        <Button
                            onClick={handleResendVerifyEmail}
                            style={{
                                marginBottom: 10,
                                marginTop: 30,
                                backgroundColor: '#D8959A',
                                borderColor: '#D8959A',
                                color: '#fff',
                                width: '100%',
                            }}>
                            Xác nhận lại email
                        </Button>
                    )}
                </Card>

                <Card
                    style={{
                        width: 500,
                        minHeight: 520,
                        marginLeft: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginTop: 80,
                    }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        tabBarStyle={{ '--antd-wave-shadow-color': '#D8959A' }}
                        style={{ flexGrow: 1 }}>
                        <TabPane
                            tab={<span style={{ color: activeTab === '1' ? '#D8959A' : 'gray' }}>Địa Chỉ</span>}
                            key="1">
                            {loadingAddresses ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Spin size="large" tip="Đang tải..." style={{ color: '#D8959A' }} />
                                </div>
                            ) : addresses.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>Không có địa chỉ nào.</div>
                            ) : (
                                <div className="address-list-container">
                                    <List
                                        dataSource={addresses}
                                        renderItem={(item, index) => (
                                            <List.Item
                                                key={item.addressId || index}
                                                style={{
                                                    border: item.isDefault ? '1px solid #D8959A' : '1px solid #ddd',
                                                    marginBottom: 10,
                                                    padding: 10,
                                                    background: '#fff',
                                                    borderRadius: 5,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                <div>
                                                    <strong>{`${item.addDetail}, ${item.ward}, ${item.district}, ${item.city}, ${item.country}`}</strong>
                                                    <p style={{ color: 'gray' }}>{item.addDetail}</p>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Tag
                                                        color={item.isDefault ? '#D8959A' : 'gray'}
                                                        onClick={() => handleSelectDefault(index)}
                                                        style={{
                                                            cursor: 'pointer',
                                                            border: item.isDefault
                                                                ? '1px solid #D8959A'
                                                                : '1px solid #ddd',
                                                            backgroundColor: item.isDefault ? '#fff' : 'transparent',
                                                            color: item.isDefault ? '#D8959A' : 'gray',
                                                            marginRight: 4,
                                                            fontSize: '12px',
                                                        }}>
                                                        Mặc Định
                                                    </Tag>
                                                    <Button
                                                        className="custom-delete-button"
                                                        style={{
                                                            border: '1px solid #ddd',
                                                            backgroundColor: item.isDefault ? '#fff' : 'transparent',
                                                            color: 'gray',
                                                            padding: '4px 6px',
                                                            height: 'auto',
                                                            lineHeight: 'normal',
                                                            fontSize: '12px',
                                                        }}
                                                        type="text"
                                                        danger
                                                        onClick={() => deleteAddress(item.addressId)}
                                                        disabled={!item.addressId}>
                                                        <DeleteOutlined />
                                                    </Button>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )}
                            <Button
                                type="dashed"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#C87E83',
                                    borderColor: '#C87E83',
                                    color: '#fff',
                                    marginTop: 20,
                                }}
                                onClick={showAddressModal}>
                                Thêm địa chỉ mới
                            </Button>
                            <AddressModal
                                visible={isAddressModalVisible}
                                onClose={handleCloseAddressModal}
                                userAddress={null}
                                refreshAddressData={fetchAddresses}
                                onAddressAdded={handleAddressAdded}
                            />
                        </TabPane>
                        <TabPane
                            tab={<span style={{ color: activeTab === '2' ? '#D8959A' : 'gray' }}>Mã Khuyến Mãi</span>}
                            key="2">
                            {loadingPromos ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Spin size="large" tip="Đang tải..." style={{ color: '#D8959A' }} />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '10px',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        padding: '12px 0',
                                        scrollbarWidth: 'thin',
                                        msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
                                    }}>
                                    {promoCodes.map((item, index) => (
                                        <Card
                                            key={index}
                                            style={{
                                                borderRadius: 10,
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                minWidth: '200px',
                                                width: '100%',
                                                height: '100%',
                                                textAlign: 'left',
                                            }}>
                                            <div style={{ transform: 'translateX(-15px)' }}>
                                                <h4
                                                    style={{
                                                        color: '#D8959A',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '20px',
                                                        fontSize: '15px',
                                                        justifyContent: 'flex-start',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                    #{item.voucherCode}
                                                    <span
                                                        style={{
                                                            color: '#D8959A',
                                                            fontSize: '22px',
                                                            fontWeight: 'bold',
                                                        }}>
                                                        {item.voucherDiscount}%
                                                    </span>
                                                </h4>
                                                <p style={{ color: 'gray', fontSize: '14px', margin: 0 }}>
                                                    {item.voucherDesc}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: '12px',
                                                        color: item.statusVoucher ? 'green' : 'red',
                                                        margin: 0,
                                                    }}>
                                                    {item.statusVoucher ? 'Còn hiệu lực' : 'Hết hạn'}
                                                </p>
                                            </div>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    navigate('/cart');
                                                }}
                                                style={{
                                                    backgroundColor: '#D8959A',
                                                    borderColor: '#D8959A',
                                                    width: '100%',
                                                    minWidth: '120px',
                                                    marginTop: '8px',
                                                }}>
                                                Sử dụng ngay
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabPane>
                        <TabPane
                            tab={
                                <span style={{ color: activeTab === '3' ? '#D8959A' : 'gray' }}>Lịch Sử Mua Hàng</span>
                            }
                            key="3">
                            {loadingOrders ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Spin size="large" tip="Đang tải..." style={{ color: '#D8959A' }} />
                                </div>
                            ) : ordersHistory.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>Không có lịch sử mua hàng.</div>
                            ) : (
                                <div
                                    style={{
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        paddingRight: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                    <Input
                                        placeholder="Tìm kiếm theo ID đơn hàng hoặc tên sản phẩm"
                                        value={searchOrderText}
                                        onChange={handleOrderSearch}
                                        style={{
                                            marginBottom: '15px',
                                            borderRadius: '6px',
                                            borderColor: '#D8959A',
                                        }}
                                        prefix={<SearchOutlined style={{ color: '#D8959A' }} />}
                                        allowClear
                                    />

                                    <List
                                        dataSource={filteredOrdersHistory}
                                        renderItem={(order) => (
                                            <List.Item
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    padding: 10,
                                                    borderBottom: '1px solid #ddd',
                                                }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                    }}>
                                                    <div style={{ flex: 1 }}>
                                                        <strong>{order.customerName}</strong>
                                                        <p style={{ margin: 0 }}>
                                                            {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontWeight: 'bold',
                                                                color: '#D8959A',
                                                                whiteSpace: 'nowrap',
                                                            }}>
                                                            {order.totalPrice.toLocaleString('vi-VN')} vnd -{' '}
                                                            {order.products.reduce(
                                                                (total, item) => total + item.quantity,
                                                                0
                                                            )}{' '}
                                                            món
                                                        </p>
                                                        <p style={{ marginTop: -2, color: 'gray', fontSize: '10px' }}>
                                                            {order.products[0]?.productName || 'No product name'}
                                                        </p>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'flex-end',
                                                        }}>
                                                        <p
                                                            style={{
                                                                color: '#D8959A',
                                                                margin: '0 0 8px 0',
                                                                fontSize: '12px',
                                                            }}>
                                                            #{toBigIntString(order.orderId)}
                                                        </p>
                                                        <Tag
                                                            icon={statusConfig[order.orderStatus]?.icon}
                                                            color={statusConfig[order.orderStatus]?.color || 'default'}
                                                            style={{
                                                                borderRadius: 5,
                                                                height: '30px',
                                                                width: '100px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                marginTop: '5px',
                                                                fontSize: '12px',
                                                                padding: '0 8px',
                                                            }}>
                                                            {order.orderStatus}
                                                        </Tag>
                                                    </div>
                                                </div>

                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        marginTop: 10,
                                                    }}>
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            backgroundColor: '#C87E83',
                                                            borderColor: '#C87E83',
                                                            padding: '4px 8px',
                                                            height: 30,
                                                            fontSize: 14,
                                                        }}
                                                        onClick={() =>
                                                            navigate(`/order-history/${toBigIntString(order.orderId)}`)
                                                        }>
                                                        Xem Chi Tiết
                                                    </Button>
                                                </div>
                                            </List.Item>
                                        )}
                                    />

                                    {filteredOrdersHistory.length === 0 && searchOrderText !== '' && (
                                        <div style={{ textAlign: 'center', padding: '20px' }}>
                                            Không tìm thấy đơn hàng phù hợp.
                                        </div>
                                    )}
                                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                        <Row justify="center">
                                            <Col>
                                                <Row gutter={8} align="middle" justify="center">
                                                    <Col>
                                                        <Pagination
                                                            current={orderPagination.current}
                                                            pageSize={orderPagination.pageSize}
                                                            total={orderPagination.total}
                                                            onChange={handleOrderPaginationChange}
                                                            size="small"
                                                            style={{
                                                                color: '#D8959A',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                            showSizeChanger={false}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row justify="center" style={{ marginTop: '8px' }}>
                                                    <Col>
                                                        <span style={{ color: '#D8959A', fontSize: '12px' }}>
                                                            <strong>
                                                                {(orderPagination.current - 1) * orderPagination.pageSize + 1}-
                                                                {Math.min(orderPagination.current * orderPagination.pageSize, orderPagination.total)}
                                                            </strong>{' '}
                                                            trong tổng <strong>{orderPagination.total}</strong> đơn hàng
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )}
                        </TabPane>

                        <TabPane
                            tab={<span style={{ color: activeTab === '4' ? '#D8959A' : 'gray' }}>Cài Đặt</span>}
                            key="4">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
                                {/* <Button type="primary" style={{ backgroundColor: '#D8959A', borderColor: '#D8959A' }}>
                                    Ngôn Ngữ: Tiếng Việt
                                </Button>
                                <Button type="primary" style={{ backgroundColor: '#C87E83', borderColor: '#C87E83' }}>
                                    Chế độ: Sáng
                                </Button> */}
                                <Button
                                    type="primary"
                                    onClick={() => setIsModalVisible(true)}
                                    style={{ backgroundColor: '#D8959A', borderColor: '#D8959A' }}>
                                    Cập Nhật Thông Tin
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => setIsPasswordModalVisible(true)}
                                    style={{ backgroundColor: '#C87E83', borderColor: '#C87E83' }}>
                                    Thay đổi mật khẩu
                                </Button>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
            <UpdateProfileModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                userInfo={userInfo}
                refreshUserData={refreshUserData}
            />
            <ChangePasswordModal visible={isPasswordModalVisible} onClose={handlePasswordModalClose} />
        </div>
    );
};

export default ProfilePage;
