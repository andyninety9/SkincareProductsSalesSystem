import React from "react";
import { Layout, Menu } from "antd";
import { CommentOutlined, CopyOutlined } from "@ant-design/icons";
import styled from "styled-components";
import "./ManageOrderSidebar.css";


const { Sider } = Layout;
const { SubMenu } = Menu;

const CustomSubMenuTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: #D8959B;
    border-radius: 28px;
    color: white;
    width: 100%;
    cursor: pointer;
    
    &:hover {
        background: #c67f89;
    }
`;
const ManageOrderSidebar = () => {
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
                style={{ flex: 1, borderRight: 0 }}
            >

                <SubMenu key="sub1" icon={<CopyOutlined />} title="Manage Orders">

                    <Menu.Item key="1">Manage Order Status</Menu.Item>
                    <Menu.Item key="2">Manage Cancel Order</Menu.Item>
                    <Menu.Item key="3">Manage Request Product</Menu.Item>
                </SubMenu>

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
                    borderTop: "1px solid #f0f0f0",
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
