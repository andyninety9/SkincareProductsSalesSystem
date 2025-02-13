import React from "react";
import "./CheckOutPage.scss";
import { Col, Container, Row } from "react-bootstrap";
import { useForm } from "antd/es/form/Form";
import { Form, Input, Radio, Select } from "antd";
import Title from "antd/es/typography/Title";
import { Link } from "react-router-dom";
import { routes } from "../../routes";
export default function CheckOutPage() {
  const [form] = useForm();

  const cartItems = [
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

  const userAddress = [
    {
      id: "1",
      address: "1231231231/1312312312 ",
      ward: "phường 11",
      district: "quan3",
      province: "tphcm",
    },
    {
      id: "2",
      address: "65656 ",
      ward: "phường 11",
      district: "quan2",
      province: "dalat",
    },
  ];

  const handleAddressChange = (value) => {
    const selectedAddress = userAddress.find((address) => address.id === value);
    if (selectedAddress) {
      form.setFieldsValue({
        province: selectedAddress.province,
        district: selectedAddress.district,
        address: selectedAddress.address,
        ward: selectedAddress.ward,
      });
    }
  };

  return (
    <Container>
      <Link
        to={routes.cartPage}
        style={{ textDecoration: "none", color: "black" }}
      >
        {"<"} Quay về giỏ hàng
      </Link>
      <Row className="order-checkout">
        <Col xs={6} className="order-checkout-info">
          <Form form={form} layout="vertical" className="form-checkout">
            <h4
              style={{
                fontWeight: "bold",
                marginBottom: "5%",
                marginTop: "5%",
              }}
            >
              Thông tin nhận hàng
            </h4>
            <Form.Item
              name="userAddress"
              rules={[{ required: true, message: "Chọn địa chỉ" }]}
            >
              <Select
                size="large"
                placeholder="Chọn địa chỉ nhận hàng"
                onChange={handleAddressChange}
              >
                {userAddress.map((address, index) => (
                  <Select.Option value={address.id} key={index}>
                    {address.address}, {address.ward}, {address.district},{" "}
                    {address.district}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="perfume_Name"
              rules={[{ required: true, message: "Nhập Email" }]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item name="perfume_Name">
              <Input placeholder="Họ và Tên" size="large" />
            </Form.Item>

            <Form.Item name="perfume_Name">
              <Input placeholder="Số điện thoại" size="large" />
            </Form.Item>

            <Form.Item name="address">
              <Input placeholder="Địa Chỉ" disabled size="large" />
            </Form.Item>

            <Form.Item name="ward">
              <Input placeholder="Phường xã" disabled size="large" />
            </Form.Item>

            <Form.Item name="district">
              <Input placeholder="Quận huyện" disabled size="large" />
            </Form.Item>

            <Form.Item name="province">
              <Input placeholder="Tỉnh thành" disabled size="large" />
            </Form.Item>

            <Form.Item name="note">
              <Input.TextArea rows={3} placeholder="Ghi chú" size="large" />
            </Form.Item>

            <div className="order-method">
              <Form.Item className="order-method-pay">
                <div>
                  <h5 className="font-bold">Thanh toán</h5>
                  <Radio.Group className="radio-group1">
                    <Radio value="VNPAY" className="border-bottom">
                      Thanh toán qua VNPAY
                    </Radio>
                    <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                  </Radio.Group>
                </div>
              </Form.Item>

              <Form.Item className="order-method-ship">
                <div>
                  <h5 className="font-bold">Vận chuyển</h5>
                  <Radio.Group className="radio-group2">
                    <Radio value="Ahamove" className="border-bottom">
                      <div className="ship-row-ahamove">
                        <p> Vận chuyển Ahamove</p>
                        <img
                          src="https://home.ahamove.com/wp-content/uploads/2022/04/Logo-dung-full-color-moi-2022-03.png"
                          alt=""
                        />
                      </div>
                    </Radio>
                    <Radio value="GHTK">
                      <div className="ship-row-ghtk">
                        <p> Vận chuyển GHTK</p>
                        <img
                          src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-H.png"
                          alt=""
                        />
                      </div>
                    </Radio>
                  </Radio.Group>
                </div>
              </Form.Item>
            </div>
          </Form>
        </Col>
        <Col xs={1}></Col>
        <Col xs={5} className="order-checkout-receipt">
          <div className="confirm-receipt">
            <div className="confirm-receipt-title">
              <h5 style={{ fontWeight: "bold" }}>Đơn hàng</h5>
              <span>(2 sản phẩm)</span>
            </div>
            <div className="confirm-receipt-items">
              {cartItems.map((item, index) => (
                <div key={index} className="confirm-receipt-items-row">
                  {/* <div className="confirm-receipt-items-row-part">
                    <div className="confirm-receipt-items-row-part-img">
                      <img src={item.img} alt="" />
                    </div>
                    <p>{item.name}</p>
                  </div>
                  <p>{item.price.toLocaleString()} đ</p> */}
                  <div className="confirm-receipt-items-row-part1">
                    <div className="confirm-receipt-items-row-part1-img">
                      <img src={item.img} alt="" />
                    </div>
                    <div className="confirm-receipt-items-row-part1-name">
                      <p>{item.name}</p>
                    </div>
                  </div>
                  <div className="confirm-receipt-items-row-part2">
                    <p className="font-bold">{item.price.toLocaleString()} đ</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="confirm-receipt-voucher">
              <input type="text" placeholder="Mã giảm giá" />
              <button>Áp dụng</button>
            </div>
            <div className="confirm-receipt-price">
              <div className="confirm-receipt-price-spacebetween">
                <p>Tạm tính: </p>
                <span className="font-bold">1.380.000 đ</span>
              </div>
              <div className="confirm-receipt-price-spacebetween">
                <p>Phí vận chuyển </p>
                <span className="font-bold">-</span>
              </div>
            </div>
            <div className="confirm-receipt-total">
              <h5>Tổng cộng</h5>
              <span className="font-bold">1.380.000 đ</span>
            </div>
            <div className="confirm-receipt-button">
              <button>Đặt hàng</button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
