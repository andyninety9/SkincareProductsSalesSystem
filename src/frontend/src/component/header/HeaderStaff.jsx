import React from "react";
import { Layout, Typography, Avatar, Badge } from "antd";
import { BellOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "@fontsource/marko-one";

const { Header } = Layout;
const { Text } = Typography;

const HeaderStaff = () => {
  return (
    <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "0 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      {/* Logo / Brand Name */}
      <Text style={{ fontSize: "30px", fontWeight: "bold", fontFamily: "Marko One, serif" }}>Mavid</Text>
      
      {/* Right Side: Icons & Staff Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <Badge count={3} size="small">
          <MessageOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
        </Badge>
        <Badge dot>
          <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
        </Badge>
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#D8959B" }} />
        <Text>Staff Name</Text>
      </div>
    </Header>
  );
};

export default HeaderStaff;
