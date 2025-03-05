import React from 'react';
import './CheckOutPage.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Radio, Select } from 'antd';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import { useSelector } from 'react-redux';
import { selectCartItems } from '../../redux/feature/cartSlice';
import api from '../../config/api';
import Cookies from 'js-cookie';

export default function CheckOutPage() {
    const [form] = useForm();
    const cartItems = useSelector(selectCartItems);
    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.sellPrice * item.quantity;
    }, 0);
    

    const user = JSON.parse(Cookies.get('user'));
    console.log(user);
    const userAddress = [
        {
            id: '1',
            address: '1231231231/1312312312 ',
            ward: 'phường 11',
            district: 'quan3',
            province: 'tphcm',
        },
        {
            id: '2',
            address: '65656 ',
            ward: 'phường 11',
            district: 'quan2',
            province: 'dalat',
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

    const handleFetchAddress = async () => { 
        try {
            const response = await api.get('Users/address');
            console.log(response.data);
            // setUserAddress(response.data.data);
            
        }catch (error) {
            console.error('Failed to fetch address:', error.response.data);
        }
    };

    const handleCheckout = async (values) => {
        // values.userId = user.usrId;
        values.eventId = 5;
        values.orderItems = cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            sellPrice: item.sellPrice,
        }));

        console.log(values);
        try {
            const response = await api.post('Orders/create', values);
            console.log(response.data);

            if (response.data.statusCode === 201) {
                const OrderId = BigInt(response.data.data.ordId).toString();
                const paymentCreate = {
                    OrderId,
                    PaymentMethod: values.paymentMethod,
                    PaymentAmount: totalAmount,
                };
                console.log(paymentCreate);
                try {
                    const responsePayment = await api.post('Payment/create', paymentCreate);
                    console.log(responsePayment.data);
                    const paymentUrl = responsePayment.data.data.paymentUrl;
                    window.location.assign(paymentUrl);
                } catch (error) {
                    console.log('Failed to create payment:', error.response.data);
                }
            }
            console.log(values);
        } catch (error) {
            console.error('Failed to checkout:', error.response.data);
        }
    };

    return (
        <Container>
            <Link to={routes.cartPage} style={{ textDecoration: 'none', color: 'black' }}>
                {'<'} Quay về giỏ hàng
            </Link>
            <Row className="order-checkout">
                <Col xs={6} className="order-checkout-info">
                    <Form form={form} layout="vertical" className="form-checkout" onFinish={handleCheckout}>
                        <h4
                            style={{
                                fontWeight: 'bold',
                                marginBottom: '5%',
                                marginTop: '5%',
                            }}>
                            Thông tin nhận hàng
                        </h4>
                        <Form.Item name="userAddress" rules={[{ required: true, message: 'Chọn địa chỉ' }]}>
                            <Select size="large" placeholder="Chọn địa chỉ nhận hàng" onChange={handleAddressChange}>
                                {userAddress.map((address, index) => (
                                    <Select.Option value={address.id} key={index}>
                                        {address.address}, {address.ward}, {address.district}, {address.district}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="email" rules={[{ required: true, message: 'Nhập Email' }]}>
                            <Input placeholder="Email" size="large" />
                        </Form.Item>

                        <Form.Item name="name">
                            <Input placeholder="Họ và Tên" size="large" />
                        </Form.Item>

                        <Form.Item name="phone">
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
                            <Form.Item
                                className="order-method-pay"
                                name="paymentMethod"
                                rules={[{ required: true, message: 'Chọn phướng thức thanh toán' }]}>
                                <div>
                                    <h5 className="font-bold">Thanh toán</h5>
                                    <Radio.Group className="radio-group1">
                                        <Radio value="VNPay" className="border-bottom">
                                            Thanh toán qua VNPAY
                                        </Radio>
                                        <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                                    </Radio.Group>
                                </div>
                            </Form.Item>

                            <Form.Item
                                className="order-method-ship"
                                rules={[{ required: true, message: 'Chọn phướng thức vận chuyển' }]}>
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
                            <h5 style={{ fontWeight: 'bold' }}>Đơn hàng</h5>
                            <span>({cartItems.length} sản phẩm)</span>
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
                                            <img src={item.images[0]} alt="" />
                                        </div>
                                        <div className="confirm-receipt-items-row-part1-name">
                                            <p>{item.productName}</p>
                                            <p>Số lượng: {item.quantity} </p>
                                        </div>
                                    </div>
                                    <div className="confirm-receipt-items-row-part2">
                                        <p className="font-bold">{item.sellPrice.toLocaleString()} đ</p>
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
                                <span className="font-bold">{totalAmount.toLocaleString()} đ</span>
                            </div>
                            <div className="confirm-receipt-price-spacebetween">
                                <p>Phí vận chuyển </p>
                                <span className="font-bold">-</span>
                            </div>
                        </div>
                        <div className="confirm-receipt-total">
                            <h5>Tổng cộng</h5>
                            <span className="font-bold">{totalAmount.toLocaleString()} đ</span>
                        </div>
                        <div className="confirm-receipt-button" onClick={() => form.submit()}>
                            <button>Đặt hàng</button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
