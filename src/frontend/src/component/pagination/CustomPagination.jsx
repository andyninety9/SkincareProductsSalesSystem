import React from "react";
import { Pagination as AntdPagination, ConfigProvider } from "antd";

const CustomPagination = ({ currentPage, totalItems, pageSize, onPageChange }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            colorPrimary: "#ff69b4", 
            colorPrimaryHover: "#ff85c0", 
            itemActiveBg: "#ff69b4", 
            itemActiveColor: "#fff", 
            itemSize: 36, 
            itemBorderRadius: 8, 
            colorText: "#000", 
            colorTextDisabled: "#ccc", 
            colorBgContainer: "transparent", 
          },
        },
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <AntdPagination
          current={currentPage}
          total={totalItems}
          pageSize={pageSize}
          onChange={onPageChange}
          showSizeChanger={false} 
          hideOnSinglePage={true} 
          simple
        />
      </div>
    </ConfigProvider>
  );
};

export default CustomPagination;
