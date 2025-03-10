import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, CommentOutlined, ContainerOutlined, ShopOutlined, CalendarOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
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
        else if (path.includes("manage-events")) setSelectedKey("7"); 
        else if (path.includes("manage-order")) setSelectedKey("1");
        else if (path.includes("manage-cancel-order")) setSelectedKey("2");
        else if (path.includes("manage-request-product")) setSelectedKey("3");
        else if (path.includes("view-comments")) setSelectedKey("4");
        else if (path.includes("review-comments")) setSelectedKey("5");
    }, [location.pathname]);

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
        if (e.key === "0") navigate("/manage-account");
        else if (e.key === "1") navigate("/manage-order");
        else if (e.key === "6") navigate("/manage-product");
        // else if (e.key === "7") navigate("/manage-events"); 
    };

    const handleOpenChange = (keys) => {
        // Only update openKeys if the user explicitly toggles a submenu
        const latestOpenKey = keys.find(key => !openKeys.includes(key)); // Newly opened submenu
        const latestClosedKey = openKeys.find(key => !keys.includes(key)); // Newly closed submenu

        if (latestOpenKey) {
            // Add the newly opened submenu to openKeys without closing others
            setOpenKeys([...openKeys, latestOpenKey]);
        } else if (latestClosedKey) {
            // Remove the closed submenu from openKeys
            setOpenKeys(openKeys.filter(key => key !== latestClosedKey));
        }
        // Do nothing if neither a submenu is opened nor closed (e.g., clicking a menu item)
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
                    <Menu.Item key="1" style={{ backgroundColor: selectedKey === "1" ? "#F6EEF0" : "", color: selectedKey === "1" ? "#C87E83" : "black" }}>Manage Order Status</Menu.Item>
                    <Menu.Item key="2" style={{ backgroundColor: selectedKey === "2" ? "#F6EEF0" : "", color: selectedKey === "2" ? "#C87E83" : "black" }}>Manage Cancel Order</Menu.Item>
                    <Menu.Item key="3" style={{ backgroundColor: selectedKey === "3" ? "#F6EEF0" : "", color: selectedKey === "3" ? "#C87E83" : "black" }}>Manage Request Product</Menu.Item>
                </SubMenu>

                <Menu.Item key="6" icon={<ShopOutlined />} style={{ backgroundColor: selectedKey === "6" ? "#F6EEF0" : "", color: selectedKey === "6" ? "#C87E83" : "black" }}>Manage Products</Menu.Item>

                <SubMenu key="sub2" icon={<CommentOutlined />} title="Manage Comments">
                    <Menu.Item key="4" style={{ backgroundColor: selectedKey === "4" ? "#F6EEF0" : "", color: selectedKey === "4" ? "#C87E83" : "black" }}>View Comments</Menu.Item>
                    <Menu.Item key="5" style={{ backgroundColor: selectedKey === "5" ? "#F6EEF0" : "", color: selectedKey === "5" ? "#C87E83" : "black" }}>Review Comments</Menu.Item>
                </SubMenu>

                <Menu.Item key="7" icon={<CalendarOutlined />} style={{ backgroundColor: selectedKey === "7" ? "#F6EEF0" : "", color: selectedKey === "7" ? "#C87E83" : "black" }}>Manage Events</Menu.Item>
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