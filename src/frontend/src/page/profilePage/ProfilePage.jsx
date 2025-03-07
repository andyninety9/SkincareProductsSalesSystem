import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { Card, Avatar, Input, Tabs, List, Button, Tag, Row, Col, Modal, Form, message } from "antd";
import UpdateProfileModal from "./UpdateProfileModal";
import AddressModal from "./AddressModal";
import "antd/dist/reset.css";
import "./ProfilePage.css";

const { TabPane } = Tabs;

const orders = [
    {
        id: "#123456",
        name: "Nguyen Van Yeah",
        date: "20/01/2025",
        price: "120.000 vnd - 1 món",
        address: "Tôn Đản, Quận 4, Thành Phố Hồ Chí Minh, Việt Nam",
        status: "Pending",
    },
    {
        id: "#123456",
        name: "Nguyen Van Yeah",
        date: "20/01/2025",
        price: "120.000 vnd - 1 món",
        address: "Tôn Đản, Quận 4, Thành Phố Hồ Chí Minh, Việt Nam",
        status: "Pending",
    },
    {
        id: "#123456",
        name: "Nguyen Van Yeah",
        date: "20/01/2025",
        price: "120.000 vnd - 1 món",
        address: "Tôn Đản, Quận 4, Thành Phố Hồ Chí Minh, Việt Nam",
        status: "Pending",
    },
];

const ProfilePage = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loadingPromos, setLoadingPromos] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [activeTab, setActiveTab] = useState("1");
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

    const showAddressModal = () => {
        setIsAddressModalVisible(true);
    };

    const handleCloseAddressModal = () => {
        setIsAddressModalVisible(false);
    };

    const fetchAddresses = async () => {
        try {
            setLoadingAddresses(true);
            const response = await api.get("address/get-all-address?page=1&pageSize=1000");
            console.log("API Response:", response.data);
            if (response.data.statusCode === 200) {
                const addressData = response.data.data.items;
                console.log("Address Data:", addressData);
                const formattedAddresses = Array.isArray(addressData)
                    ? addressData.map((addr) => ({
                        addressId: addr.addressId,
                        addDetail: addr.addDetail,
                        ward: addr.ward,
                        district: addr.district,
                        city: addr.city,
                        country: addr.country,
                        isDefault: addr.isDefault,
                        status: addr.status,
                    }))
                    : [];
                setAddresses(formattedAddresses);
                console.log("Formatted Addresses:", formattedAddresses);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handleSelectDefault = async (index) => {
        const selectedAddress = addresses[index];
        if (!selectedAddress.addressId) {
            message.error("Không thể chọn địa chỉ mặc định vì thiếu ID!");
            return;
        }

        try {
            const response = await api.put("Address/active", {
                addressId: selectedAddress.addressId,
            });
            console.log("Set Default API Response:", response.data);

            if (response.data.statusCode === 200) {
                message.success("Đã đặt địa chỉ làm mặc định!");
                await fetchAddresses();
            } else {
                message.error(`Cập nhật địa chỉ mặc định thất bại: ${response.data.detail || "Lỗi không xác định"}`);
            }
        } catch (error) {
            console.error("Error setting default address:", error);
            message.error("Lỗi khi cập nhật địa chỉ mặc định!");
        }
    };

    const handleAddressAdded = (newAddress) => {
        setAddresses((prevAddresses) => {
            const hasDefault = prevAddresses.some((addr) => addr.isDefault);
            const updatedAddress = { ...newAddress, isDefault: !hasDefault };
            const newAddresses = [updatedAddress, ...prevAddresses];
            console.log("New addresses list after adding:", newAddresses);
            return newAddresses;
        });
        fetchAddresses(); // Sync with server after adding
    };

    const fetchPromoCodes = async () => {
        try {
            setLoadingPromos(true);
            const response = await api.get("User/vouchers");
            if (response.data.statusCode === 200) {
                const data = response.data.data;
                setPromoCodes(Array.isArray(data) ? data : [data] || []);
            }
        } catch (error) {
            console.error("Error fetching promo codes:", error);
        } finally {
            setLoadingPromos(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
        fetchAddresses();
        refreshUserData();
    }, []);

    const refreshUserData = async () => {
        try {
            setLoading(true);
            const response = await api.get("User/get-me");
            if (response?.data?.statusCode === 200 && response?.data?.data) {
                const data = response.data.data;
                setUserInfo({
                    ...data,
                    phone: data.phone || "",
                    fullname: data.fullname || "",
                    gender: data.gender || "",
                    email: data.email || "",
                    dob: data.dob || "",
                    name: data.name || "",
                    avatarUrl: data.avatarUrl || "",
                    coverUrl: data.coverUrl || "",
                });
            } else {
                console.warn("Unexpected API response:", response);
            }
        } catch (error) {
            if (error.response) {
                console.error("API Error:", error.response.status, error.response.data);
                if (error.response.status === 401) {
                    console.warn("Unauthorized! Redirecting to login...");
                }
            } else {
                console.error("Network or unexpected error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUserData();
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
    }

    if (!userInfo) {
        return <div style={{ textAlign: "center", marginTop: "50px" }}>No user data available.</div>;
    }

    return (
        <div style={{ width: "100%", position: "relative" }}>
            <div
                style={{
                    width: "100%",
                    height: "30vh",
                    background: `url(${userInfo.coverUrl}) no-repeat center center`,
                    backgroundSize: "cover",
                    marginBottom: 10,
                }}
            />
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <Card
                    style={{
                        width: 250,
                        textAlign: "center",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Avatar size={100} src={userInfo.avatarUrl} style={{ border: "3px solid #D8959A" }} />
                    <h3 style={{ fontFamily: "'Nunito', sans-serif", color: "#D8959A", fontSize: "20px", marginTop: "10px" }}>
                        {userInfo.name}
                    </h3>
                    <p style={{ fontFamily: "'Nunito', sans-serif", color: "#D8959A", fontSize: "20px", margin: "0" }}>
                        {userInfo.fullname}
                    </p>
                    <p style={{ marginTop: "2px" }}>{userInfo.gender}</p>
                    <Input
                        prefix={<MailOutlined />}
                        value={userInfo.email}
                        disabled
                        style={{
                            marginBottom: 10,
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            color: "black",
                            backgroundColor: "white",
                            height: 50,
                        }}
                    />
                    <Input
                        prefix={<PhoneOutlined />}
                        value={userInfo.phone}
                        disabled
                        style={{
                            marginBottom: 10,
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            color: "black",
                            backgroundColor: "white",
                            height: 50,
                        }}
                    />
                    <Input
                        prefix={<CalendarOutlined />}
                        value={userInfo.dob}
                        disabled
                        style={{
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            border: "none",
                            color: "black",
                            backgroundColor: "white",
                            height: 50,
                        }}
                    />
                </Card>

                <Card
                    style={{
                        width: 500,
                        marginLeft: 20,
                        display: "flex",
                        flexDirection: "column",
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                >
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        tabBarStyle={{ "--antd-wave-shadow-color": "#D8959A" }}
                        style={{ flexGrow: 1 }}
                    >
                        <TabPane tab={<span style={{ color: activeTab === "1" ? "#D8959A" : "gray" }}>Địa Chỉ</span>} key="1">
                            {loadingAddresses ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
                            ) : addresses.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>Không có địa chỉ nào.</div>
                            ) : (
                                <div className="address-list-container">
                                    <List
                                        dataSource={addresses}
                                        renderItem={(item, index) => (
                                            <List.Item
                                                key={item.addressId || index}
                                                style={{
                                                    border: item.isDefault ? "1px solid #D8959A" : "1px solid #ddd",
                                                    marginBottom: 10,
                                                    padding: 10,
                                                    background: "#fff",
                                                    borderRadius: 5,
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <div>
                                                    <strong>{`${item.addDetail}, ${item.ward}, ${item.district}, ${item.city}, ${item.country}`}</strong>
                                                    <p style={{ color: "gray" }}>{item.addDetail}</p>
                                                </div>
                                                <Tag
                                                    color={item.isDefault ? "#D8959A" : "gray"}
                                                    onClick={() => handleSelectDefault(index)}
                                                    style={{
                                                        cursor: "pointer",
                                                        border: item.isDefault ? "1px solid #D8959A" : "1px solid #ddd",
                                                        backgroundColor: item.isDefault ? "#fff" : "transparent",
                                                        color: item.isDefault ? "#D8959A" : "gray",
                                                    }}
                                                >
                                                    Mặc Định
                                                </Tag>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            )}
                            <Button
                                type="dashed"
                                style={{ width: "100%", backgroundColor: "#C87E83", borderColor: "#C87E83", color: "#fff" }}
                                onClick={showAddressModal}
                            >
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
                        <TabPane tab={<span style={{ color: activeTab === "2" ? "#D8959A" : "gray" }}>Mã Khuyến Mãi</span>} key="2">
                            {loadingPromos ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {promoCodes.map((item, index) => (
                                        <Col span={12} key={index} style={{ marginBottom: 16, marginRight: 18 }}>
                                            <Card
                                                style={{
                                                    borderRadius: 10,
                                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                    height: "100%",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <div style={{ transform: "translateX(-15px)" }}>
                                                    <h4
                                                        style={{
                                                            color: "#D8959A",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "25px",
                                                            fontSize: "16px",
                                                            justifyContent: "flex-start",
                                                        }}
                                                    >
                                                        #{item.voucherCode}
                                                        <span style={{ color: "#D8959A", fontSize: "25px", fontWeight: "bold" }}>
                                                            {item.voucherDiscount}%
                                                        </span>
                                                    </h4>
                                                    <p style={{ color: "gray", fontSize: "14px", margin: 0 }}>{item.voucherDesc}</p>
                                                    <p
                                                        style={{
                                                            fontSize: "12px",
                                                            color: item.statusVoucher ? "green" : "red",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {item.statusVoucher ? "Còn hiệu lực" : "Hết hạn"}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="primary"
                                                    style={{
                                                        backgroundColor: "#D8959A",
                                                        borderColor: "#D8959A",
                                                        width: "180px",
                                                        minWidth: "150px",
                                                        marginTop: "8px",
                                                    }}
                                                >
                                                    Lưu ngay
                                                </Button>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </TabPane>
                        <TabPane tab={<span style={{ color: activeTab === "3" ? "#D8959A" : "gray" }}>Lịch Sử Mua Hàng</span>} key="3">
                            <List
                                dataSource={orders}
                                renderItem={(order) => (
                                    <List.Item
                                        style={{ display: "flex", alignItems: "center", padding: 10, borderBottom: "1px solid #ddd" }}
                                    >
                                        <img
                                            src={order.image}
                                            alt="Product"
                                            style={{ width: 80, height: 80, borderRadius: 10, marginRight: 15 }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <strong>{order.name}</strong>
                                            <p style={{ margin: 0 }}>{order.date}</p>
                                            <p style={{ fontWeight: "bold", color: "#D8959A" }}>{order.price}</p>
                                            <p style={{ marginTop: -2, color: "gray", fontSize: "10px" }}>{order.address}</p>
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-end",
                                                marginBottom: "50px",
                                            }}
                                        >
                                            <p style={{ color: "#D8959A", margin: 0, fontSize: "17px" }}>{order.id}</p>
                                            <Tag
                                                color="#D8959A"
                                                style={{
                                                    borderRadius: 5,
                                                    height: "30px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {order.status}
                                            </Tag>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        <TabPane tab={<span style={{ color: activeTab === "4" ? "#D8959A" : "gray" }}>Cài Đặt</span>} key="4">
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px" }}>
                                <Button type="primary" style={{ backgroundColor: "#D8959A", borderColor: "#D8959A" }}>
                                    Ngôn Ngữ: Tiếng Việt
                                </Button>
                                <Button type="primary" style={{ backgroundColor: "#C87E83", borderColor: "#C87E83" }}>
                                    Chế độ: Sáng
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => setIsModalVisible(true)}
                                    style={{ backgroundColor: "#D8959A", borderColor: "#D8959A" }}
                                >
                                    Cập Nhật Thông Tin
                                </Button>
                                <Button type="primary" style={{ backgroundColor: "#C87E83", borderColor: "#C87E83" }}>
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
        </div>
    );
};

export default ProfilePage;