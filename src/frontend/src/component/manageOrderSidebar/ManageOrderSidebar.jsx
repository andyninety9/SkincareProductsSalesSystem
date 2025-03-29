import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, ContainerOutlined, ShopOutlined, CalendarOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManageOrderSidebar.css";
import { Dashboard } from '@mui/icons-material';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Lưu trạng thái menu mở vào localStorage
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
    if (pathname.includes("manage-event")) return "8";
    if (pathname.includes("manage-order")) return "1";
    if (pathname.includes("manage-return")) return "3";
    if (pathname.includes("manage-category")) return "11";
    if (pathname.includes("manage-quiz")) return "7";
    if (pathname.includes("manage-skintype")) return "12";
    if (pathname.includes("manage-brand")) return "10";
    if (pathname.includes("dashboard")) return "5";
    return "0";
};

const ManageOrderSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(getSelectedKeyFromPath(location.pathname));
    const [openKeys, setOpenKeys] = useState(getPersistedOpenKeys());

    useEffect(() => {
        const path = location.pathname;
        const newSelectedKey = getSelectedKeyFromPath(path);

        if (selectedKey !== newSelectedKey) {
            setSelectedKey(newSelectedKey);
        }

        let newOpenKey = null;
        if (path.includes("manage-order") || path.includes("manage-return")) {
            newOpenKey = "sub1"; 
        } else if (path.includes("manage-product") || path.includes("manage-brand") || path.includes("manage-category")) {
            newOpenKey = "sub3"; 
        } else if (path.includes("manage-quiz") || path.includes("manage-skintype")) {
            newOpenKey = "sub4"; 
        }

        if (newOpenKey && !openKeys.includes(newOpenKey)) {
            setOpenKeys((prevKeys) => {
                const updatedKeys = [...new Set([...prevKeys, newOpenKey])]; 
                setPersistedOpenKeys(updatedKeys); 
                return updatedKeys;
            });
        }
    }, [location.pathname]);

    const handleMenuClick = (e) => {
        navigate(
            e.key === "0" ? "/manage-account" :
                e.key === "1" ? "/manage-order" :
                    e.key === "6" ? "/manage-product" :
                        e.key === "8" ? "/manage-event" :
                            e.key === "10" ? "/manage-brand" :
                                e.key === "11" ? "/manage-category" :
                                    e.key === "7" ? "/manage-quiz" :
                                        e.key === "12" ? "/manage-skintype" :
                                            e.key === "5" ? "/dashboard" :
                                                e.key === "3" ? "/manage-return" :
                                                    "/"
        );
    };

    const handleOpenChange = (keys) => {
        setOpenKeys(keys);
        setPersistedOpenKeys(keys);
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
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                onClick={handleMenuClick}
                style={{ flex: 1, borderRight: 0 }}
            >
                <Menu.Item key="5" icon={<Dashboard />}>Dashboard</Menu.Item>
                <Menu.Item key="0" icon={<UserOutlined />}>Manage Account</Menu.Item>
                <Menu.Item key="8" icon={<CalendarOutlined />}>Manage Events</Menu.Item>
                <SubMenu key="sub1" icon={<ContainerOutlined />} title="Manage Orders">
                    <Menu.Item key="1">Manage Order Status</Menu.Item>
                    <Menu.Item key="3">Manage Return Order</Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" icon={<ShopOutlined />} title="Manage Products">
                    <Menu.Item key="6">Manage Product</Menu.Item>
                    <Menu.Item key="10">Manage Brand</Menu.Item>
                    <Menu.Item key="11">Manage Category</Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" icon={<QuestionCircleOutlined />} title="Manage Quiz">
                    <Menu.Item key="7">Manage Quiz</Menu.Item>
                    <Menu.Item key="12">Manage Skintype</Menu.Item>
                </SubMenu>
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