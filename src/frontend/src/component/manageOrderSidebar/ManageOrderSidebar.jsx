import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, CommentOutlined, ContainerOutlined, ShopOutlined, CalendarOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManageOrderSidebar.css";

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
    // if (pathname.includes("manage-img-product")) return "7";
    if (pathname.includes("manage-order")) return "1";
    if (pathname.includes("manage-cancel-order")) return "2";
    if (pathname.includes("manage-request-product")) return "3";
    if (pathname.includes("view-comments")) return "4";
    if (pathname.includes("review-comments")) return "5";
    return "0"; // Mặc định vào "Manage Account" nếu không khớp
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

        if (path.includes("manage-order")) {
            setOpenKeys(["sub1"]);
        } else if (path.includes("manage-comment")) {
            setOpenKeys(["sub2"]);
        } 
        // else {
        //     setOpenKeys([]);
        // }
    }, [location.pathname]); 

    const handleMenuClick = (e) => {
        navigate(
            e.key === "0" ? "/manage-account" :
            e.key === "1" ? "/manage-order" :
            e.key === "6" ? "/manage-product" :
            e.key === "8" ? "/manage-event" :
            "/"
        );
    };

    const handleOpenChange = (keys) => {
        setOpenKeys(keys); // Cập nhật trạng thái submenu mở
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
                onOpenChange={handleOpenChange} // Cập nhật trạng thái submenu mở
                onClick={handleMenuClick}
                style={{ flex: 1, borderRight: 0 }}
            >
                <Menu.Item key="0" icon={<UserOutlined />}>Manage Account</Menu.Item>
                <SubMenu key="sub1" icon={<ContainerOutlined />} title="Manage Orders">
                    <Menu.Item key="1">Manage Order Status</Menu.Item>
                    <Menu.Item key="2">Manage Cancel Order</Menu.Item>
                    <Menu.Item key="3">Manage Request Product</Menu.Item>
                </SubMenu>
                {/* <SubMenu key="sub3" icon={<ShopOutlined />} title="Manage Products"> */}
                    <Menu.Item key="6">Manage Products</Menu.Item>
                    {/* <Menu.Item key="7">Manage Image</Menu.Item> */}
                {/* </SubMenu> */}
                <SubMenu key="sub2" icon={<CommentOutlined />} title="Manage Comments">
                    <Menu.Item key="4">View Comments</Menu.Item>
                    <Menu.Item key="5">Review Comments</Menu.Item>
                </SubMenu>
                <Menu.Item key="8" icon={<CalendarOutlined />}>Manage Events</Menu.Item>
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
