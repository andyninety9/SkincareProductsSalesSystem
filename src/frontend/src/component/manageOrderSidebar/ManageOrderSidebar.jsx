import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, CommentOutlined, ContainerOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./ManageOrderSidebar.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

const ManageOrderSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState("0");
    const [openKeys, setOpenKeys] = useState([]);

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("manage-account")) setSelectedKey("0");
        else if (path.includes("manage-product")) setSelectedKey("6");
        else if (path.includes("manage-order-status")) setSelectedKey("1");
        else if (path.includes("manage-cancel-order")) setSelectedKey("2");
        else if (path.includes("manage-request-product")) setSelectedKey("3");
        else if (path.includes("view-comments")) setSelectedKey("4");
        else if (path.includes("review-comments")) setSelectedKey("5");
    }, [location.pathname]);

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
        if (e.key === "0") navigate("/manage-account");
        else if (e.key === "6") navigate("/manage-product");
    };

    const handleOpenChange = (keys) => {
        setOpenKeys(keys);
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
                selectedKeys={[selectedKey]}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                onClick={handleMenuClick}
                style={{ flex: 1, borderRight: 0 }}
            >
                <Menu.Item key="0" icon={<UserOutlined />} style={{ backgroundColor: selectedKey === "0" ? "#F6EEF0" : "", color: selectedKey === "0" ? "#C87E83" : "black" }}>Manage Account</Menu.Item>

                <SubMenu key="sub1" icon={<ContainerOutlined />} title="Manage Orders">
                    <Menu.Item key="1">Manage Order Status</Menu.Item>
                    <Menu.Item key="2">Manage Cancel Order</Menu.Item>
                    <Menu.Item key="3">Manage Request Product</Menu.Item>
                </SubMenu>

                <Menu.Item key="6" icon={<ShopOutlined />} style={{ backgroundColor: selectedKey === "6" ? "#F6EEF0" : "", color: selectedKey === "6" ? "#C87E83" : "black" }}>Manage Products</Menu.Item>

                <SubMenu key="sub2" icon={<CommentOutlined />} title="Manage Comments">
                    <Menu.Item key="4">View Comments</Menu.Item>
                    <Menu.Item key="5">Review Comments</Menu.Item>
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
