import { useState } from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
} from "@ant-design/icons";

const SidebarStaff = () => {
  const [openKeys, setOpenKeys] = useState(["manageOrder"]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const handleSelect = ({ key }) => {
    setSelectedKeys([key]);
  };

  return (
    <div className="h-screen bg-white shadow-md flex flex-col"
      style={{ width: "20vw", marginTop: "1px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", height: "100vh" }}>
      <div className="flex-1 overflow-auto">
        <Menu
          mode="inline"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={handleOpenChange}
          onSelect={handleSelect}
          style={{ borderRight: 0 }}
        >
          {/* Manage Account */}
          <Menu.Item
            key="manageAccount"
            icon={<UserOutlined />}
            style={{
              backgroundColor: selectedKeys.includes("manageAccount") ? "#D8959A" : "",
              color: selectedKeys.includes("manageAccount") ? "white" : "black"
            }}
          >
            Manage Account
          </Menu.Item>

          {/* Manage Order */}
          <Menu.SubMenu
            key="manageOrder"
            title={
              <span style={{ color: "black" }}>
                <FileTextOutlined style={{ color: "black" }} /> Manage Order
              </span>
            }
            style={{ color: "black" }}
          >
            <Menu.Item
              key="orderStatus"
              style={{
                backgroundColor: selectedKeys.includes("orderStatus") ? "#D8959A" : "",
                color: selectedKeys.includes("orderStatus") ? "white" : "black"
              }}
            >
              Manage Order Status
            </Menu.Item>
            <Menu.Item
              key="cancelOrder"
              style={{
                backgroundColor: selectedKeys.includes("cancelOrder") ? "#D8959A" : "",
                color: selectedKeys.includes("cancelOrder") ? "white" : "black"
              }}
            >
              Manage Cancel Order
            </Menu.Item>
            <Menu.Item
              key="requestProduct"
              style={{
                backgroundColor: selectedKeys.includes("requestProduct") ? "#D8959A" : "",
                color: selectedKeys.includes("requestProduct") ? "white" : "black"
              }}
            >
              Manage Request Product
            </Menu.Item>
          </Menu.SubMenu>

          {/* Manage Comment */}
          <Menu.Item
            key="manageComment"
            icon={<CommentOutlined />}
            style={{
              backgroundColor: selectedKeys.includes("manageComment") ? "#D8959A" : "",
              color: selectedKeys.includes("manageComment") ? "white" : "black"
            }}
          >
            Manage Comment
          </Menu.Item>
        </Menu>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: "0",
          transform: "translateX(10%)",
          textAlign: "center",
        }}
      >
        <p>Mavid Vietnam @ 2025 Company</p>
      </div>
    </div>
  );
};

export default SidebarStaff;
