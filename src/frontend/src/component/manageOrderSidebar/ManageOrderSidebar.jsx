import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, CommentOutlined, ContainerOutlined, ShopOutlined, CalendarOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManageOrderSidebar.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

// manage openKeys in local storage
const getPersistedOpenKeys = () => {
    const stored = localStorage.getItem("sidebarOpenKeys");
    return stored ? JSON.parse(stored) : [];
};

const setPersistedOpenKeys = (keys) => {
    localStorage.setItem("sidebarOpenKeys", JSON.stringify(keys));
};
const getSelectedKeyFromPath = (pathname) => {
    if (pathname.includes("manage-account")) return "0";
    if (pathname.includes("manage-product")) return "6";
    if (pathname.includes("manage-events")) return "7";
    if (pathname.includes("manage-order")) return "1";
    if (pathname.includes("manage-cancel-order")) return "2";
    if (pathname.includes("manage-request-product")) return "3";
    if (pathname.includes("view-comments")) return "4";
    if (pathname.includes("review-comments")) return "5";
    return "0"; // Default to "Manage Account" if no match
};

const ManageOrderSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(getSelectedKeyFromPath(location.pathname));
    const [openKeys, setOpenKeys] = useState(getPersistedOpenKeys());
    const openKeysRef = useRef(getPersistedOpenKeys());

    useEffect(() => {
        const path = location.pathname;
        const newSelectedKey = getSelectedKeyFromPath(path);

        if (selectedKey !== newSelectedKey) {
            setSelectedKey(newSelectedKey);
        }
        setOpenKeys(openKeysRef.current);
    }, [location.pathname]); 

    const handleMenuClick = (e) => {
        if (e.key === "0") navigate("/manage-account");
        else if (e.key === "1") navigate("/manage-order");
        else if (e.key === "6") navigate("/manage-product");
        
    };

    const handleTitleClick = (key) => {
        if (openKeysRef.current.includes(key)) {
            openKeysRef.current = openKeysRef.current.filter(k => k !== key);
        } else {
            openKeysRef.current = [...openKeysRef.current, key];
        }
        setOpenKeys([...openKeysRef.current]);
        setPersistedOpenKeys(openKeysRef.current);
    };

    const handleOpenChange = () => {
        // prevent Ant Design from automatically updating openKeys
    };

    if (openKeys.length !== openKeysRef.current.length || !openKeys.every(key => openKeysRef.current.includes(key))) {
        setOpenKeys([...openKeysRef.current]);
    }

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
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                onClick={handleMenuClick}
                style={{ flex: 1, borderRight: 0 }}
            >
                <Menu.Item key="0" icon={<UserOutlined />} style={{ backgroundColor: selectedKey === "0" ? "#F6EEF0" : "", color: selectedKey === "0" ? "#C87E83" : "black" }}>Manage Account</Menu.Item>

                <SubMenu
                    key="sub1"
                    icon={<ContainerOutlined />}
                    title="Manage Orders"
                    onTitleClick={() => handleTitleClick("sub1")}
                >
                    <Menu.Item key="1" style={{ backgroundColor: selectedKey === "1" ? "#F6EEF0" : "", color: selectedKey === "1" ? "#C87E83" : "black" }}>Manage Order Status</Menu.Item>
                    <Menu.Item key="2" style={{ backgroundColor: selectedKey === "2" ? "#F6EEF0" : "", color: selectedKey === "2" ? "#C87E83" : "black" }}>Manage Cancel Order</Menu.Item>
                    <Menu.Item key="3" style={{ backgroundColor: selectedKey === "3" ? "#F6EEF0" : "", color: selectedKey === "3" ? "#C87E83" : "black" }}>Manage Request Product</Menu.Item>
                </SubMenu>

                <Menu.Item key="6" icon={<ShopOutlined />} style={{ backgroundColor: selectedKey === "6" ? "#F6EEF0" : "", color: selectedKey === "6" ? "#C87E83" : "black" }}>Manage Products</Menu.Item>

                <SubMenu
                    key="sub2"
                    icon={<CommentOutlined />}
                    title="Manage Comments"
                    onTitleClick={() => handleTitleClick("sub2")}
                >
                    <Menu.Item key="4" style={{ backgroundColor: selectedKey === "4" ? "#F6EEF0" : "", color: selectedKey === "4" ? "#C87E83" : "black" }}>View Comments</Menu.Item>
                    <Menu.Item key="5" style={{ backgroundColor: selectedKey === "5" ? "#F6EEF0" : "", color: selectedKey === "5" ? "#C87E83" : "black" }}>Review Comments</Menu.Item>
                </SubMenu>

                <Menu.Item key="7" icon={<CalendarOutlined />} style={{ backgroundColor: selectedKey === "7" ? "#F6EEF0" : "", color: selectedKey === "7" ? "#C87E83" : "black" }}>Manage Events</Menu.Item>
            </Menu>

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