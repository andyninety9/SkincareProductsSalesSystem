import React, { useState } from "react";
import { MailOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import { Card, Avatar, Input, Tabs, List, Button, Tag } from "antd";
import Profile1 from "../../assets/profile1.png";
import AboutUs3 from "../../assets/aboutUs3.png";
import "antd/dist/reset.css";
import "./ProfilePage.css";
import OrderHistory from "../../assets/orderHistory.png";

const { TabPane } = Tabs;

const userInfo = {
    name: "Nguyen Van Yeah",
    gender: "Male",
    email: "NguyenvanYeah@gmail.com",
    phone: "0912345678",
    dob: "01-05-2002",
    avatar: AboutUs3
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
        image: OrderHistory,
    },
    {
        id: "#123456",
        name: "Nguyen Van Yeah",
        date: "20/01/2025",
        price: "120.000 vnd - 1 món",
        address: "Tôn Đản, Quận 4, Thành Phố Hồ Chí Minh, Việt Nam",
        status: "Pending",
        image: OrderHistory,
    },
    {
        id: "#123456",
        name: "Nguyen Van Yeah",
        date: "20/01/2025",
        price: "120.000 vnd - 1 món",
        address: "Tôn Đản, Quận 4, Thành Phố Hồ Chí Minh, Việt Nam",
        status: "Pending",
        image: OrderHistory,
    }
];

const ProfilePage = () => {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [activeTab, setActiveTab] = useState("1");

    const handleSelectDefault = (index) => {
        setAddresses(addresses.map((addr, i) => ({ ...addr, default: i === index })));
    };
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            padding: 40,
            background: `url(${Profile1}) no-repeat center center`,
            backgroundSize: "cover",
            alignItems: "flex-end",
            height: "80vh",
            position: "relative"
        }}>

            <Card style={{ width: 300, minHeight: 500, textAlign: "center", marginTop: 1000 }}>
                <Avatar size={100} src={userInfo.avatar} style={{ border: "3px solid #D8959A", }} />
                <h3 style={{ fontFamily: "'Nunito', sans-serif", color: "#D8959A", fontSize: "20px", marginTop: "10px" }}>{userInfo.name}</h3>
                <p>{userInfo.gender}</p>
                <Input
                    prefix={<MailOutlined />}
                    value={userInfo.email}
                    disabled
                    style={{
                        marginBottom: 10,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        border: "none",
                        color: "black",
                        backgroundColor: "white"
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
                        backgroundColor: "white"
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
                        backgroundColor: "white"
                    }}
                />
            </Card>

            <Card style={{ width: 500, minHeight: 500, marginLeft: 20, marginTop: 50 }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabBarStyle={{ '--antd-wave-shadow-color': '#D8959A' }}
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
                    <TabPane tab={<span style={{ color: activeTab === "2" ? "#D8959A" : "gray" }}>Mã Khuyến Mãi</span>} key="2">Nội dung mã khuyến mãi</TabPane>
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
                                        <p style={{ margin: 0, color: "gray", fontSize: "10px" }}>{order.address}</p>
                                    </div>
                                   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <p style={{ color: "#D8959A", fontSize: "20px", margin: 0 }}>
          {order.id}
        </p>
        <Tag
          color="#D8959A"
          style={{
            borderRadius: 5,
            height: "30px",
            width: "70px",
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
                    <TabPane tab={<span style={{ color: activeTab === "4" ? "#D8959A" : "gray" }}>Cài Đặt</span>} key="4">Cài đặt tài khoản</TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default ProfilePage;
