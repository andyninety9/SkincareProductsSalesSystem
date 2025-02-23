import React from "react";
import { Button as AntdButton } from "antd";

const Button = ({ type = "default", text, onClick, style }) => {
  return (
    <AntdButton
      type={type} 
      onClick={onClick}
      style={{ 
        ...style, 
        borderRadius: "6px", 
        padding: "8px 16px",
        fontSize: "14px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {text}
    </AntdButton>
  );
};

export default Button;
