import React from "react";
import "./CartPage.scss";
import { Col, Container, Row } from "react-bootstrap";
import { Button, ConfigProvider, Divider, Table, Typography } from "antd";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/feature/cartSlice";
const { Text } = Typography;

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = [
    {
      id: 1,
      img: "https://images.girlslife.com/posts/041/41861/pinkbeautyproductsskincareinnisfreecherryblossom.png",
      brandName: "dior",
      name: "Suar rua matdadasdasdadasdasdasdddddddddddddddddddddddddddddddd",
      quantity: "23",
      price: 250000,
      total: 2565405,
    },
    {
      id: 1,
      img: "https://images.girlslife.com/posts/041/41861/pinkbeautyproductsskincareinnisfreecherryblossom.png",
      brandName: "dior",
      name: "Serum La Roche-Posay Giảm Thâm Nám & Dưỡng Sáng Da 30ml",
      quantity: "23",
      price: 250000,
      total: 2565405,
    },
    {
      id: 1,
      img: "https://images.girlslife.com/posts/041/41861/pinkbeautyproductsskincareinnisfreecherryblossom.png",
      brandName: "dior",
      name: "Suar rua mat",
      quantity: "23",
      price: 250000,
      total: 2565405,
    },
    {
      id: 1,
      img: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1721749856-1721299452-allies-of-skin-peptides-firming-daily-treatment-6698f1b735c1e.png?crop=0.625xw:0.785xh;0.191xw,0.215xh&resize=980:*",
      brandName: "dior",
      name: "Suar rua mat",
      quantity: "23",
      price: 250000,
      total: 2565405,
    },
  ];

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <>
          <div className="table-col-name">
            {" "}
            <div className="table-col-name-img">
              <img src={record.img} alt={record.img} />
            </div>
            <div className="table-col-name-content">
              <h5>{record.brandName}</h5>
              <Text>{record.name}</Text>
            </div>
          </div>
        </>
      ),
      width: 400,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <Text className="font-bold">{record.price.toLocaleString()} đ</Text>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Button
            size="small"
            onClick={() => {
              console.log("Decrease quantity for:", record);

              dispatch(
                decreaseQuantity({
                  id: record.id,
                })
              );
            }}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <Text>{quantity}</Text>
          <Button
            size="small"
            onClick={() =>
              dispatch(
                increaseQuantity({
                  id: record.id,
                })
              )
            }
          >
            +
          </Button>
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "image",
      render: (_, record) => (
        <Text className="font-bold">{record.total.toLocaleString()} đ</Text>
      ),
    },
    {
      title: "Xoá",
      render: (_, record) => (
        <>
          <RiDeleteBinLine
            size={25}
            color="#D8959A"
            className="button-delete"
          />
        </>
      ),
    },
  ];

  return (
    <Container>
      <div className="cart-title">
        <h5 className="font-bold">Giỏ hàng</h5> <span>(2 sản phẩm)</span>
      </div>

      <div className="cart-div">
        <Row>
          <Col xs={8}>
            <ConfigProvider
              theme={{
                token: {},
                components: {
                  Table: {
                    headerBg: "#EFEFEF",
                    borderColor: "#D8959A",
                    headerBorderRadius: 0,
                  },
                },
              }}
            >
              <Table
                className="table-cart"
                dataSource={cartItems}
                columns={columns}
                pagination={false}
              />
            </ConfigProvider>
          </Col>
          <Col xs={4}>
            <div className="cart-receipt">
              <div className="cart-receipt-main">
                <div className="cart-receipt-main-title">
                  <p>Hoá đơn của bạn</p>
                </div>
                <div className="cart-receipt-main-content">
                  <div className="cart-receipt-main-content-part">
                    <p>Tạm tính: </p>
                    <span className="font-bold" style={{ fontSize: "18px" }}>
                      500.000 đ
                    </span>
                  </div>
                  <div className="cart-receipt-main-content-part">
                    <p>Giảm giá </p>
                    <span className="font-bold" style={{ fontSize: "18px" }}>
                      -0 đ
                    </span>
                  </div>
                  <div className="cart-receipt-main-content-part">
                    <p style={{ fontSize: "13px" }}>
                      Vui lòng kiểm tra giỏ hàng trước khi thanh toán{" "}
                    </p>
                  </div>
                  <div className="cart-receipt-main-content-part-total">
                    <p>Tổng cộng: </p>
                    <span className="font-bold" style={{ fontSize: "18px" }}>
                      500.000 đ
                    </span>
                  </div>
                </div>
              </div>
              <button className="cart-receipt-button">
                Tiến hành đặt hàng
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
