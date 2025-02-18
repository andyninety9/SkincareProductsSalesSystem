import React from "react";
import { Button, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const StartQuizPage = ({ onExit }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F6EEF0",
        height: "auto",
        position: "relative",
      }}
    >
      {/* Exit Button */}
      <Button
        onClick={onExit}
        shape="circle"
        icon={<LogoutOutlined style={{ fontSize: "24px", color: "#E57373" }} />}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "transparent",
          border: "none",
        }}
      />

      <div
        style={{
          maxWidth: "750px",
          margin: "50px auto",
          padding: 20,
          textAlign: "center",
        }}
      >
        <Title style={{ fontSize: "30px" }} level={3}>
          Bạn thuộc Type Da Baumann nào trong số 16 loại da?
        </Title>
        <Paragraph style={{ fontSize: "15px" }}>
          Bạn muốn có làn da đẹp rạng rỡ như ý muốn? Chỉ cần 3 phút thôi, bạn sẽ
          biết chính xác loại da của mình và có ngay một kế hoạch chăm sóc da
          phù hợp.
        </Paragraph>
        <Paragraph style={{ fontSize: "15px" }}>
          Bài kiểm tra quy trình chăm sóc da miễn phí của chúng tôi được phát
          triển bởi các bác sĩ da liễu để chẩn đoán chính xác loại da của bạn và
          kê đơn một quy trình chăm sóc da tùy chỉnh trong thực hành y tế của
          họ. Giờ đây, bạn có thể sử dụng cùng một bài kiểm tra mà họ sử dụng
          trong phòng khám của họ và mua sắm sản phẩm bằng Týp Da Baumann của
          bạn!
        </Paragraph>
        <Paragraph strong style={{ fontSize: "15px" }}>
          Bạn đã sẵn sàng khám phá làn da của mình chưa?
        </Paragraph>
        <Button
          type="primary"
          size="large"
          style={{ backgroundColor: "#D8959A", width: "50%", height: "50px" }}
        >
          Xác định loại da của tôi
        </Button>
      </div>
    </div>
  );
};

export default StartQuizPage;
