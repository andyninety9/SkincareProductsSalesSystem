import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, CommentOutlined, ContainerOutlined } from "@ant-design/icons";
import styled from "styled-components";
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
        // else if (e.key === "1") navigate("/manage-order-status");
        // else if (e.key === "2") navigate("/manage-cancel-order");
        // else if (e.key === "3") navigate("/manage-request-product");
        // else if (e.key === "4") navigate("/view-comments");
        // else if (e.key === "5") navigate("/review-comments");
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
                    <Menu.Item key="1" style={{ backgroundColor: selectedKey === "1" ? "#F6EEF0" : "", color: selectedKey === "1" ? "#C87E83" : "black" }}>Manage Order Status</Menu.Item>
                    <Menu.Item key="2" style={{ backgroundColor: selectedKey === "2" ? "#F6EEF0" : "", color: selectedKey === "2" ? "#C87E83" : "black" }}>Manage Cancel Order</Menu.Item>
                    <Menu.Item key="3" style={{ backgroundColor: selectedKey === "3" ? "#F6EEF0" : "", color: selectedKey === "3" ? "#C87E83" : "black" }}>Manage Request Product</Menu.Item>
                </SubMenu>

                <SubMenu key="sub2" icon={<CommentOutlined />} title="Manage Comments">
                    <Menu.Item key="4" style={{ backgroundColor: selectedKey === "4" ? "#F6EEF0" : "", color: selectedKey === "4" ? "#C87E83" : "black" }}>View Comments</Menu.Item>
                    <Menu.Item key="5" style={{ backgroundColor: selectedKey === "5" ? "#F6EEF0" : "", color: selectedKey === "5" ? "#C87E83" : "black" }}>Review Comments</Menu.Item>
                </SubMenu>
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
