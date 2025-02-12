import React from "react";
import { Select, ConfigProvider } from "antd";

const SelectBox = ({ options, placeholder, content }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorPrimary: "#ff69b4", 
            controlOutline: "#D8959A",
            hoverBorderColor: "#D8959A", 
          },
        },
      }}
    >
      <Select
        showSearch
        placeholder={placeholder || content}
        style={{ width: 200 }}
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
      />
    </ConfigProvider>
  );
};

export default SelectBox;
