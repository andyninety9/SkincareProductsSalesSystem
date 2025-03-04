import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../config/api";
import { MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { Card, Avatar, Input, Tabs, List, Button, Tag, Row, Col, Modal, Form } from "antd";
import UpdateProfileModal from "./UpdateProfileModal";
import "antd/dist/reset.css";
import "./ProfilePage.css";

const { TabPane } = Tabs;

const ProfilePage = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loadingPromos, setLoadingPromos] = useState(true);
    const [userInfo, setUserInfo] = useState({});
    const [addresses, setAddresses] = useState(initialAddresses);
    const [activeTab, setActiveTab] = useState("1");
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSelectDefault = (index) => {
        setAddresses((prevAddresses) =>
            prevAddresses.map((address, i) => ({
                ...address,
                default: i === index, // Chỉ đặt `true` cho địa chỉ được chọn, các địa chỉ khác sẽ `false`
            }))
        );
    };

    const fetchPromoCodes = async () => {
        try {
            setLoadingPromos(true);
            const response = await api.get("https://api-gateway-swp-v1-0-0.onrender.com/api/User/vouchers");
            if (response.data.statusCode === 200) {
                setPromoCodes(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching promo codes:", error);
        } finally {
            setLoadingPromos(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const refreshUserData = async () => {
        try {
            setLoading(true);
            const response = await api.get("https://api-gateway-swp-v1-0-0.onrender.com/api/User/get-me");
            if (response.data.statusCode === 200) {
                const data = response.data.data;
                // Log the response to debug (optional, can remove after verification)
                console.log("User data from API:", data);
                setUserInfo({
                    ...data,
                    phone: data.phone || "",
                    fullname: data.fullname || "",
                    gender: data.gender || "",
                    email: data.email || "",
                    dob: data.dob || "",
                    name: data.name || "",
                    avatarUrl: data.avatarUrl || "",
                    coverUrl: data.coverUrl || ""
                });
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
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
            {/* Background Image */}
            <div
                style={{
                    width: "100%",
                    height: "30vh",
                    background: `url(${userInfo.coverUrl}) no-repeat center center`,
                    backgroundSize: "cover",
                    marginBottom: 10

                }}
            />
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                <Card style={{
                    width: 250, textAlign: "center", top: "50%", transform: "translateY(-50%)",
                }}>

                    <Avatar size={100} src={userInfo.avatarUrl} style={{ border: "3px solid #D8959A", }} />
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
                            height: 50
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
                            height: 50
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
                            height: 50
                        }}
                    />
                </Card>

                <Card style={{ width: 500, marginLeft: 20, display: "flex", flexDirection: "column", top: "50%", transform: "translateY(-50%)" }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        tabBarStyle={{ '--antd-wave-shadow-color': '#D8959A' }}
                        style={{ flexGrow: 1 }}
                    >
                        <TabPane tab={<span style={{ color: activeTab === "1" ? "#D8959A" : "gray" }}>Địa Chỉ</span>} key="1">
                            <List
                                dataSource={addresses}
                                renderItem={(item, index) => (
                                    <List.Item
                                        style={{
                                            border: item.default ? "1px solid #D8959A" : "1px solid #ddd",
                                            marginBottom: 10, padding: 10,
                                            background: "#fff", borderRadius: 5,
                                            display: "flex", justifyContent: "space-between", alignItems: "center"
                                        }}>
                                        <div>
                                            <strong>{item.title}</strong>
                                            <p style={{ color: "gray" }}>{item.details}</p>
                                        </div>
                                        <Tag
                                            color={item.default ? "#D8959A" : "gray"}
                                            onClick={() => handleSelectDefault(index)}
                                            style={{ cursor: "pointer", border: item.default ? "1px solid #D8959A" : "1px solid #ddd", backgroundColor: item.default ? "#fff" : "transparent", color: item.default ? "#D8959A" : "gray" }}
                                        >
                                            Mặc Định
                                        </Tag>
                                    </List.Item>
                                )}
                            />
                            <Button type="primary" style={{ width: "100%", marginBottom: 10, backgroundColor: "#D8959A", borderColor: "#D8959A" }}>Xem Thêm</Button>
                            <Button type="dashed" style={{ width: "100%", backgroundColor: "#C87E83", borderColor: "#C87E83", color: "#fff" }}>Thêm địa chỉ mới</Button>
                        </TabPane>
                        <TabPane tab={<span style={{ color: activeTab === "2" ? "#D8959A" : "gray" }}>Mã Khuyến Mãi</span>} key="2">
                            {loadingPromos ? (
                                <div style={{ textAlign: "center", padding: "20px" }}>Đang tải...</div>
                            ) : (
                                <Row gutter={[16, 16]}>
                                    {promoCodes.length > 0 ? (
                                        promoCodes.map((item, index) => (
                                            <Col span={11} key={index} style={{ marginBottom: 16, marginRight: 18 }}>
                                                <Card style={{ borderRadius: 10, padding: 10, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", textAlign: "center", height: "100%" }}>
                                                    <h4 style={{ color: "#D8959A", fontWeight: "bold" }}>{item.code}</h4>
                                                    <p style={{ color: "gray", fontSize: "12px" }}>{item.description}</p>
                                                    <p style={{ fontSize: "10px", color: item.status === "Còn hiệu lực" ? "green" : "red" }}>
                                                        {item.expiry} - {item.status}
                                                    </p>
                                                    <Button type="primary" style={{ backgroundColor: "#D8959A", borderColor: "#D8959A", width: "100%" }}>Lưu ngay</Button>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <div style={{ textAlign: "center", width: "100%", padding: "20px" }}>Không có mã khuyến mãi nào.</div>
                                    )}
                                </Row>
                            )}
                        </TabPane>
                        <TabPane tab={<span style={{ color: activeTab === "3" ? "#D8959A" : "gray" }}>Lịch Sử Mua Hàng</span>} key="3">
                            <List
                                dataSource={orders}
                                renderItem={(order) => (
                                    <List.Item style={{ display: "flex", alignItems: "center", padding: 10, borderBottom: "1px solid #ddd" }}>
                                        <img src={order.image} alt="Product" style={{ width: 80, height: 80, borderRadius: 10, marginRight: 15 }} />
                                        <div style={{ flex: 1 }}>
                                            <strong>{order.name}</strong>
                                            <p style={{ margin: 0 }}>{order.date}</p>
                                            <p style={{ fontWeight: "bold", color: "#D8959A" }}>{order.price}</p>
                                            <p style={{ marginTop: -2, color: "gray", fontSize: "10px" }}>{order.address}</p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: "50px" }}>
                                            <p style={{ color: "#D8959A", margin: 0, fontSize: "17px" }}>{order.id}</p>
                                            <Tag color="#D8959A" style={{ borderRadius: 5, height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>{order.status}</Tag>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </TabPane>
                        <TabPane tab={<span style={{ color: activeTab === "4" ? "#D8959A" : "gray" }}>Cài Đặt</span>} key="4">
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px" }}>
                                <Button type="primary" style={{ backgroundColor: "#D8959A", borderColor: "#D8959A" }}>Ngôn Ngữ: Tiếng Việt </Button>
                                <Button type="primary" style={{ backgroundColor: "#C87E83", borderColor: "#C87E83" }}>Chế độ: Sáng</Button>
                                <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ backgroundColor: "#D8959A", borderColor: "#D8959A" }}>
                                    Cập Nhật Thông Tin
                                </Button>
                                <Button type="primary" style={{ backgroundColor: "#C87E83", borderColor: "#C87E83" }}>Thay đổi mật khẩu</Button>
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

const initialAddresses = [
    {
        title: "Tôn Đản, Quận 4, Thành Phố Hồ Chí Minh, Việt Nam",
        details: "Số 432, nằm ngay đầu đường, có xe nước",
        default: true
    },
    {
        title: "Nhà tao, Quận tao, Thành Phố tao, Việt Nam",
        details: "Số nhà tao",
        default: false
    },
    {
        title: "Nguyễn Văn Linh, Ninh Kiều, Cần Thơ",
        details: "Số 121, quẹo trái xong phải xong trái xong phải",
        default: false
    }
];

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

    }
];

export default ProfilePage;
