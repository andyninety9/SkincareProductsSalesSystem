import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, CommentOutlined, ContainerOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ManageOrderSidebar.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

const ManageOrderSidebar = () => {
    const [selectedKey, setSelectedKey] = useState("0");
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
        if (e.key === "0") navigate("/manage-account");
        else if (e.key === "6") navigate("/manage-event");
    };

    return (
        <Sider
            width={250}
            theme="light"
            style={{
                height: "calc(100vh - 60px)",
                position: "fixed",
                left: 0,
                top: "60px",
                bottom: 0,
                borderRight: "1px solid #f0f0f0",
                display: "flex",
                flexDirection: "column",
                boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                paddingTop: "30px",
            }}
        >
            {/* Menu Items */}
            <Menu
                mode="inline"
                defaultOpenKeys={["sub1"]}
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                style={{ flex: 1, borderRight: 0 }}
            >
                <Menu.Item key="0" icon={<UserOutlined />} style={{ backgroundColor: selectedKey === "0" ? "#F6EEF0" : "", color: selectedKey === "0" ? "#C87E83" : "black" }}>Manage Account</Menu.Item>

                <SubMenu key="sub1" icon={<ContainerOutlined />} title="Manage Orders">
                    <Menu.Item key="1">Manage Order Status</Menu.Item>
                    <Menu.Item key="2">Manage Cancel Order</Menu.Item>
                    <Menu.Item key="3">Manage Request Product</Menu.Item>
                </SubMenu>

                <SubMenu key="sub2" icon={<CommentOutlined />} title="Manage Comments">
                    <Menu.Item key="4">View Comments</Menu.Item>
                    <Menu.Item key="5">Review Comments</Menu.Item>
                </SubMenu>

                <Menu.Item key="6" icon={<CalendarOutlined />} style={{ backgroundColor: selectedKey === "6" ? "#F6EEF0" : "", color: selectedKey === "6" ? "#C87E83" : "black" }}>Manage Events</Menu.Item>
            </Menu>

            {/* Footer */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: 12,
                    padding: "12px 0",
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                }}
            >
                Mavid Vietnam © 2025 Company
            </div>
        </Sider>
    );
};

export default ManageOrderSidebar;
