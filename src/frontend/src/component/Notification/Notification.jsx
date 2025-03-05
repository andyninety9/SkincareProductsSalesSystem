import { useState } from "react";
import { notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons/lib/icons/CheckCircleOutlined";
import { CloseCircleOutlined } from "@ant-design/icons/lib/icons/CloseCircleOutlined";

// eslint-disable-next-line react/prop-types
const Notification = ({ type, message }) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = () => {
    api.open({
      message: type === "success" ? "Success" : "Failed",
      description: message,
      icon: type === "success" ? (
        <CheckCircleOutlined style={{ color: "green" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "red" }} />
      ),
    });
  };

  return (
    <>
      {contextHolder}
      <button onClick={openNotification}> Show Notification</button>
    </>
  );
};

export default Notification;
