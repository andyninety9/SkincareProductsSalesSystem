// import React, { useEffect } from 'react';
// import './CheckOutPage.scss';
// import { Col, Container, Row } from 'react-bootstrap';
// import { useForm } from 'antd/es/form/Form';
// import { Form, Input, message, Radio, Select } from 'antd';
// import { Link } from 'react-router-dom';
// import { routes } from '../../routes';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectCartItems } from '../../redux/feature/cartSlice';
// import api from '../../config/api';
// import Cookies from 'js-cookie';
// import { clearCart } from '../../redux/feature/cartSlice';
// import { Button } from 'antd';
// import { LeftOutlined } from '@ant-design/icons';
// import { setPendingOrder } from '../../redux/feature/orderSlice';

// export default function CheckOutPage() {
//     // Add this with your other state declarations
//     const [isSubmitting, setIsSubmitting] = React.useState(false);
//     const [form] = useForm();
//     const dispatch = useDispatch();
//     const cartItems = useSelector(selectCartItems);
//     const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
//     const totalAmount = cartItems.reduce((total, item) => {
//         return total + item.sellPrice * item.quantity;
//     }, 0);
//     const [userAddress, setUserAddress] = React.useState([]);
//     const [userVoucher, setUserVoucher] = React.useState([]);
//     const [selectedVoucher, setSelectedVoucher] = React.useState(null);
//     const [voucherCode, setVoucherCode] = React.useState('');
//     const [discountAmount, setDiscountAmount] = React.useState(0);
//     const [shippingFee, setShippingFee] = React.useState(0);

//     const handleAddressChange = (value) => {
//         const selectedAddress = userAddress.find((address) => address.addressId === value);
//         if (selectedAddress) {
//             form.setFieldsValue({
//                 province: selectedAddress.city,
//                 district: selectedAddress.district,
//                 address: selectedAddress.addDetail,
//                 ward: selectedAddress.ward,
//             });

//             // Calculate shipping fee after setting form values
//             setTimeout(() => handleGetShippingFee(), 100); // Small delay to ensure form values are set
//         }
//     };

//     const handleApplyVoucher = async (voucherCode) => {
//         if (!voucherCode.trim()) {
//             message.error('Vui lòng nhập hoặc chọn mã giảm giá');
//             return;
//         }

//         setIsSubmitting(true); // Set loading state when applying voucher

//         const voucherToApply = userVoucher.find((v) => v.voucherCode === voucherCode && v.statusVoucher === true);

//         if (!voucherToApply) {
//             message.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
//             setIsSubmitting(false);
//             return;
//         }
//         const usrId = user.userId;
//         try {
//             const response = await api.post('user/apply-voucher', { usrId, voucherCode });
//             if (response.data.statusCode === 200) {
//                 // Find the voucher and calculate discount
//                 const appliedVoucher = userVoucher.find((v) => v.voucherCode === voucherCode);
//                 if (appliedVoucher) {
//                     const discount = (totalAmount * appliedVoucher.voucherDiscount) / 100;
//                     setDiscountAmount(discount);
//                     setSelectedVoucher(appliedVoucher.voucherId);
//                     message.success(`Áp dụng mã giảm giá thành công! Giảm ${appliedVoucher.voucherDiscount}%`);
//                 } else {
//                     message.success('Áp dụng mã giảm giá thành công');
//                 }
//                 handleFetchVoucher();
//             } else {
//                 message.error('Áp dụng mã giảm giá thất bại: ' + response.data.message);
//             }
//         } catch (error) {
//             message.error('Áp dụng mã giảm giá thất bại: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
//         } finally {
//             setIsSubmitting(false); // Reset loading state when done
//         }
//     };

//     const clearAppliedVoucher = () => {
//         setSelectedVoucher(null);
//         setVoucherCode('');
//         setDiscountAmount(0);
//         message.info('Đã xóa mã giảm giá');
//     };

//     const handleFetchVoucher = async () => {
//         try {
//             const response = await api.get('user/vouchers?page=1&pageSize=1000');
//             if (response.data.statusCode === 200) {
//                 setUserVoucher(response.data.data.items);
//             }
//             console.log(response.data);
//         } catch (error) {
//             console.error('Failed to fetch voucher:', error.response?.data);
//         }
//     };

//     const handleGetAddressCodeByAddress = async () => {
//         try {
//             // Get current form values
//             const formValues = form.getFieldsValue();
//             const provinceName = formValues.province;
//             const districtName = formValues.district;
//             const wardName = formValues.ward;

//             if (!provinceName || !districtName || !wardName) {
//                 message.error('Vui lòng chọn đầy đủ thông tin địa chỉ');
//                 return null;
//             }

//             // Step 1: Get provinces and find province ID
//             const provinceResponse = await api.get('delivery/provinces');
//             if (provinceResponse.data.statusCode !== 200) {
//                 throw new Error('Không thể lấy thông tin tỉnh/thành phố');
//             }

//             const provinces = provinceResponse.data.data;
//             const province = provinces.find((p) => p.ProvinceName.toLowerCase() === provinceName.toLowerCase());

//             if (!province) {
//                 message.error(`Không tìm thấy tỉnh/thành phố: ${provinceName}`);
//                 return null;
//             }

//             // Step 2: Get districts for the found province
//             const districtResponse = await api.get(`delivery/districts?provinceId=${province.ProvinceID}`);
//             if (districtResponse.data.statusCode !== 200) {
//                 throw new Error('Không thể lấy thông tin quận/huyện');
//             }

//             const districts = districtResponse.data.data;
//             const district = districts.find((d) => d.DistrictName.toLowerCase() === districtName.toLowerCase());

//             if (!district) {
//                 message.error(`Không tìm thấy quận/huyện: ${districtName}`);
//                 return null;
//             }

//             // Step 3: Get wards for the found district
//             const wardResponse = await api.get(`delivery/wards?districtId=${district.DistrictID}`);
//             if (wardResponse.data.statusCode !== 200) {
//                 throw new Error('Không thể lấy thông tin phường/xã');
//             }

//             const wards = wardResponse.data.data;
//             const ward = wards.find((w) => w.WardName.toLowerCase() === wardName.toLowerCase());

//             if (!ward) {
//                 message.error(`Không tìm thấy phường/xã: ${wardName}`);
//                 return null;
//             }

//             // Return the found IDs and codes
//             return {
//                 provinceId: province.ProvinceID,
//                 districtId: district.DistrictID,
//                 wardCode: ward.WardCode,
//             };
//         } catch (error) {
//             console.error('Lỗi khi lấy mã địa chỉ:', error);
//             message.error('Không thể xác định mã địa chỉ: ' + (error.message || 'Đã xảy ra lỗi'));
//             return null;
//         }
//     };

//     const handleGetShippingFee = async () => {
//         try {
//             // Get location codes from the address
//             const addressCodes = await handleGetAddressCodeByAddress();
//             if (!addressCodes) {
//                 return; // Error message already shown in handleGetAddressCodeByAddress
//             }

//             const response = await api.post('delivery/shipping-fee', {
//                 from_district_id: 1454, // Origin district ID (shop's location)
//                 from_ward_code: '21211', // Origin ward code (shop's location)
//                 service_id: 53320,
//                 service_type_id: null,
//                 to_district_id: addressCodes.districtId, // Customer's district ID
//                 to_ward_code: addressCodes.wardCode, // Customer's ward code
//                 height: 50,
//                 length: 20,
//                 weight: 200,
//                 width: 20,
//                 insurance_value: 10000,
//                 cod_failed_amount: 2000,
//                 coupon: null,
//                 items: cartItems.map((item) => ({
//                     name: item.productName,
//                     quantity: item.quantity,
//                     height: 200,
//                     weight: 1000,
//                     length: 200,
//                     width: 200,
//                 })),
//             });

//             // Log the entire response to diagnose structure
//             console.log('Shipping fee response:', response.data);

//             if (response.data.statusCode === 200) {
//                 // Access the deeply nested total field correctly
//                 const fee = response.data.data.data.total;
//                 setShippingFee(fee);
//                 form.setFieldsValue({ shippingFee: fee });
//                 message.success(`Phí vận chuyển: ${fee.toLocaleString()} đ`);
//                 return fee;
//             } else {
//                 message.error('Không thể tính phí vận chuyển: ' + response.data.message);
//                 return 0;
//             }
//         } catch (error) {
//             console.error('Failed to get shipping fee:', error);
//             // Better error handling with proper data path
//             if (error.response?.data) {
//                 console.error('Error details:', error.response.data);
//             }
//             message.error('Không thể tính phí vận chuyển');
//             return 0;
//         }
//     };

//     const handleCreateDeliveryOrder = async (orderId, customerInfo) => {
//         try {
//             // Extract address information from form values
//             const formValues = form.getFieldsValue();
//             const addressCodes = await handleGetAddressCodeByAddress();

//             if (!addressCodes) {
//                 message.error('Không thể xác định mã địa chỉ giao hàng');
//                 return null;
//             }

//             // Calculate total weight and dimensions based on cart items
//             const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight || 200) * item.quantity, 200);

//             const response = await api.post('delivery/create-order', {
//                 payment_type_id: formValues.paymentMethod === 'COD' ? 2 : 1, // 2 for COD, 1 for paid
//                 note: formValues.note || 'Đơn hàng từ Mavid Skincare',
//                 required_note: 'KHONGCHOXEMHANG',
//                 from_name: 'Mavid Skincare Shop',
//                 from_phone: '0987654321',
//                 from_address: '43 Xô Viết Nghệ Tĩnh, Phường 17, Quận Bình Thạnh, Hồ Chí Minh, Vietnam',
//                 from_ward_name: 'Phường 17',
//                 from_district_name: 'Quận Bình Thạnh',
//                 from_province_name: 'HCM',
//                 return_phone: '0918788433',
//                 return_address: '39 NTT',
//                 to_name: formValues.name,
//                 to_phone: formValues.phone,
//                 to_address: formValues.address,
//                 to_ward_name: formValues.ward,
//                 to_district_name: formValues.district,
//                 to_province_name: formValues.province,
//                 cod_amount: formValues.paymentMethod === 'COD' ? totalAmount + shippingFee - discountAmount : 0,
//                 content: `Đơn hàng #${orderId}`,
//                 weight: totalWeight,
//                 length: 20,
//                 width: 20,
//                 height: 10,
//                 insurance_value: 100000,
//                 service_id: 0,
//                 service_type_id: 2,
//                 items: cartItems.map((item) => ({
//                     name: item.productName,
//                     code: item.productId.toString(),
//                     quantity: item.quantity,
//                     price: item.sellPrice,
//                     length: 12,
//                     width: 12,
//                     height: 12,
//                     weight: item.weight || 200,
//                     category: {
//                         level1: 'Mỹ phẩm',
//                     },
//                 })),
//             });

//             console.log('Delivery order response:', response.data);

//             if (response.data.statusCode === 200) {
//                 const deliveryOrderId = response.data.data.data.order_code;

//                 // Update order with delivery tracking code
//                 try {
//                     await api.put(`Orders/update-tracking/${orderId}`, {
//                         trackingCode: deliveryOrderId,
//                     });
//                     message.success('Đã tạo đơn vận chuyển thành công');
//                 } catch (updateError) {
//                     console.error('Failed to update order with tracking code:', updateError);
//                 }

//                 return deliveryOrderId;
//             } else {
//                 message.error('Không thể tạo đơn vận chuyển: ' + response.data.message);
//                 return null;
//             }
//         } catch (error) {
//             console.error('Failed to create delivery order:', error);
//             if (error.response?.data) {
//                 console.error('Error details:', error.response.data);
//             }
//             message.error('Không thể tạo đơn vận chuyển');
//             return null;
//         }
//     };

//     useEffect(() => {
//         handleFetchVoucher();
//     }, []);

//     const handleUseVoucher = async (orderId) => {
//         try {
//             const response = await api.post('user/use-voucher', {
//                 voucherCode: voucherCode,
//                 orderId: orderId,
//             });

//             if (response.data.statusCode === 200) {
//                 console.log('Voucher used successfully');
//                 return true;
//             } else {
//                 console.error('Failed to use voucher:', response.data.message);
//                 return false;
//             }
//         } catch (error) {
//             console.error('Error using voucher:', error.response?.data || error);
//             throw error;
//         }
//     };
//     const handleCheckout = async (values) => {
//         // Set loading state to true at the start
//         setIsSubmitting(true);

//         // Recalculate total amount to ensure it's current
//         const currentTotalAmount = cartItems.reduce((total, item) => {
//             return total + item.sellPrice * item.quantity;
//         }, 0);
//         const finalAmount = currentTotalAmount - discountAmount + shippingFee;

//         if (selectedVoucher !== null) {
//             values.VoucherCodeApplied = voucherCode;
//         }
//         values.shippingFee = shippingFee.toString();
//         values.orderItems = cartItems.map((item) => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             sellPrice: item.sellPrice,
//             discountedPrice: item.discountedPrice,
//         }));

//         try {
//             const response = await api.post('Orders/create', values);

//             if (response.data.statusCode === 201) {
//                 const OrderId = BigInt(response.data.data.ordId).toString();

//                 // Apply voucher if selected
//                 if (voucherCode && discountAmount > 0) {
//                     try {
//                         await handleUseVoucher(OrderId);
//                         console.log('Voucher marked as used successfully');
//                     } catch (error) {
//                         console.error('Failed to mark voucher as used:', error);
//                         // Continue with payment even if voucher marking fails
//                     }
//                 }

//                 if (values.paymentMethod === 'COD') {
//                     // For COD, create delivery order immediately
//                     try {
//                         const deliveryOrderId = await handleCreateDeliveryOrder(OrderId, values);
//                         if (deliveryOrderId) {
//                             message.success('Đặt hàng thành công!');
//                             dispatch(clearCart());
//                             window.location.href = routes.orderSuccess || routes.home;
//                         }
//                     } catch (deliveryError) {
//                         console.error('Error creating delivery order:', deliveryError);
//                         // Still consider order successful even if delivery creation fails
//                         message.warning('Đặt hàng thành công, nhưng có lỗi khi tạo đơn vận chuyển');
//                         dispatch(clearCart());
//                         window.location.href = routes.orderSuccess || routes.home;
//                     }
//                 } else {
//                     // For VNPay, store order details in Redux
//                     const orderDetails = {
//                         orderId: OrderId,
//                         items: cartItems,
//                         recipientInfo: {
//                             name: values.name,
//                             phone: values.phone,
//                             email: values.email,
//                             address: values.address,
//                             ward: values.ward,
//                             district: values.district,
//                             province: values.province,
//                             note: values.note || '',
//                         },
//                         paymentDetails: {
//                             totalAmount: currentTotalAmount,
//                             shippingFee,
//                             discountAmount,
//                             finalAmount,
//                             paymentMethod: values.paymentMethod,
//                             shippingMethod: values.shippingMethod,
//                             voucherCode: voucherCode || null,
//                         },
//                         timestamp: new Date().toISOString(),
//                     };

//                     // Store in Redux
//                     dispatch(setPendingOrder(orderDetails));

//                     // Proceed with payment creation
//                     const paymentCreate = {
//                         OrderId,
//                         PaymentMethod: values.paymentMethod,
//                         PaymentAmount: finalAmount,
//                         ShippingMethod: values.shippingMethod,
//                     };

//                     try {
//                         const responsePayment = await api.post('Payment/create', paymentCreate);
//                         const paymentUrl = responsePayment.data.data.paymentUrl;

//                         // Clear cart and redirect to payment URL
//                         message.success('Đặt hàng thành công! Chuyển hướng đến trang thanh toán...');
//                         dispatch(clearCart());
//                         window.location.assign(paymentUrl);
//                     } catch (error) {
//                         setIsSubmitting(false);
//                         message.error(
//                             'Không thể tạo thanh toán: ' + (error.response?.data?.message || 'Đã xảy ra lỗi')
//                         );
//                         console.log('Failed to create payment:', error.response?.data);
//                     }
//                 }
//             }
//         } catch (error) {
//             setIsSubmitting(false);
//             message.error('Không thể đặt hàng: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
//             console.error('Failed to checkout:', error.response?.data);
//         }
//     };

//     useEffect(() => {
//         const fetchAddressAndSetDefault = async () => {
//             try {
//                 const response = await api.get('address/get-all-address?page1&pageSize=1000');
//                 if (response.data.statusCode === 200) {
//                     const addresses = response.data.data.items;

//                     // Filter addresses to only include those with status === true
//                     const activeAddresses = addresses.filter((address) => address.status === true);

//                     // Set only active addresses to state
//                     setUserAddress(activeAddresses);

//                     // Select the first active address as default (since all are now active)
//                     if (activeAddresses.length > 0) {
//                         const defaultAddress = activeAddresses[0];
//                         form.setFieldsValue({
//                             userAddress: defaultAddress.addressId,
//                             province: defaultAddress.city,
//                             district: defaultAddress.district,
//                             address: defaultAddress.addDetail,
//                             ward: defaultAddress.ward,
//                             email: user?.email || '',
//                             name: user?.fullName || '',
//                             phone: user?.phone || '',
//                             shippingMethod: 'Ahamove',
//                         });

//                         // Calculate shipping fee for default address
//                         setTimeout(() => handleGetShippingFee(), 500);
//                     } else {
//                         console.log('No active addresses found');
//                     }
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch address:', error.response?.data);
//             }
//         };

//         fetchAddressAndSetDefault();
//     }, [form]);

//     return (
//         <Container>
//             <Link to={routes.cart}>
//                 <Button
//                     type="default"
//                     icon={<LeftOutlined />}
//                     size="large"
//                     style={{ fontWeight: 'bold', marginTop: '3%' }}>
//                     Quay về giỏ hàng
//                 </Button>
//             </Link>
//             <Row className="order-checkout">
//                 <Col xs={6} className="order-checkout-info">
//                     <Form form={form} layout="vertical" className="form-checkout" onFinish={handleCheckout}>
//                         <h4
//                             style={{
//                                 fontWeight: 'bold',
//                                 marginBottom: '5%',
//                                 marginTop: '5%',
//                             }}>
//                             Thông tin nhận hàng
//                         </h4>
//                         <Form.Item name="userAddress" rules={[{ required: true, message: 'Chọn địa chỉ' }]}>
//                             <Select size="large" placeholder="Chọn địa chỉ nhận hàng" onChange={handleAddressChange}>
//                                 {userAddress.map((address, index) => (
//                                     <Select.Option value={address.addressId} key={index}>
//                                         {address.addDetail}, {address.ward}, {address.district}, {address.city}
//                                     </Select.Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>

//                         <Form.Item name="email" rules={[{ required: true, message: 'Nhập Email' }]}>
//                             <Input placeholder="Email" size="large" />
//                         </Form.Item>

//                         <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên người nhận' }]}>
//                             <Input placeholder="Họ và Tên" size="large" />
//                         </Form.Item>

//                         <Form.Item name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
//                             <Input placeholder="Số điện thoại" size="large" />
//                         </Form.Item>

//                         <Form.Item name="address">
//                             <Input placeholder="Địa Chỉ" disabled size="large" />
//                         </Form.Item>

//                         <Form.Item name="ward">
//                             <Input placeholder="Phường xã" disabled size="large" />
//                         </Form.Item>

//                         <Form.Item name="district">
//                             <Input placeholder="Quận huyện" disabled size="large" />
//                         </Form.Item>

//                         <Form.Item name="province">
//                             <Input placeholder="Tỉnh thành" disabled size="large" />
//                         </Form.Item>

//                         <Form.Item name="note">
//                             <Input.TextArea rows={3} placeholder="Ghi chú" size="large" />
//                         </Form.Item>

//                         <div className="order-method">
//                             <Form.Item
//                                 className="order-method-pay"
//                                 name="paymentMethod"
//                                 rules={[{ required: true, message: 'Chọn phướng thức thanh toán' }]}>
//                                 <div>
//                                     <h5 className="font-bold">Thanh toán</h5>
//                                     <Radio.Group className="radio-group1">
//                                         <Radio value="VNPay" className="border-bottom">
//                                             <div className="pay-row-vnp">
//                                                 <p>Thanh toán qua VNPAY</p>
//                                                 <img
//                                                     src="https://static.ybox.vn/2024/1/4/1705551987477-logo-ngang.png"
//                                                     alt=""
//                                                 />
//                                             </div>
//                                         </Radio>
//                                         <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
//                                     </Radio.Group>
//                                 </div>
//                             </Form.Item>

//                             <Form.Item
//                                 className="order-method-ship"
//                                 name="shippingMethod"
//                                 rules={[{ required: true, message: 'Chọn phương thức vận chuyển' }]}>
//                                 <div>
//                                     <h5 className="font-bold">Vận chuyển</h5>
//                                     <Radio.Group className="radio-group2">
//                                         <Radio value="Ahamove" className="">
//                                             <div className="ship-row-ahamove">
//                                                 <p> Vận chuyển Giao Hàng Nhanh</p>
//                                                 <img
//                                                     src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Orange.png"
//                                                     alt=""
//                                                 />
//                                             </div>
//                                         </Radio>
//                                     </Radio.Group>
//                                 </div>
//                             </Form.Item>
//                         </div>
//                     </Form>
//                 </Col>
//                 <Col xs={1}></Col>
//                 <Col xs={5} className="order-checkout-receipt">
//                     <div className="confirm-receipt">
//                         <div className="confirm-receipt-title">
//                             <h5 style={{ fontWeight: 'bold' }}>Đơn hàng</h5>
//                             <span>({cartItems.length} sản phẩm)</span>
//                         </div>
//                         <div className="confirm-receipt-items">
//                             {cartItems.map((item, index) => (
//                                 <div key={index} className="confirm-receipt-items-row">
//                                     <div className="confirm-receipt-items-row-part1">
//                                         <div className="confirm-receipt-items-row-part1-img">
//                                             <img src={item.images[0]} alt="" />
//                                         </div>
//                                         <div className="confirm-receipt-items-row-part1-name">
//                                             <p>{item.productName}</p>
//                                             <p>Số lượng: {item.quantity} </p>
//                                         </div>
//                                     </div>
//                                     <div className="confirm-receipt-items-row-part2">
//                                         <p className="font-bold">{item.sellPrice.toLocaleString()} đ</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="available-vouchers">
//                             <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Voucher khả dụng</h6>
//                             <div className="voucher-list">
//                                 {userVoucher.filter((voucher) => voucher.statusVoucher === true).length > 0 ? (
//                                     userVoucher
//                                         .filter((voucher) => voucher.statusVoucher === true)
//                                         .map((voucher, index) => (
//                                             <div
//                                                 key={index}
//                                                 className={`voucher-card ${
//                                                     selectedVoucher === voucher.voucherId ? 'selected' : ''
//                                                 }`}
//                                                 onClick={() => {
//                                                     setSelectedVoucher(voucher.voucherId);
//                                                     setVoucherCode(voucher.voucherCode);
//                                                 }}>
//                                                 <div className="voucher-info">
//                                                     <div className="voucher-code">{voucher.voucherCode}</div>
//                                                     <div className="voucher-discount">
//                                                         Giảm {voucher.voucherDiscount}%
//                                                     </div>
//                                                     <div className="voucher-desc">{voucher.voucherDesc}</div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                 ) : (
//                                     <p>Không có voucher nào khả dụng</p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="confirm-receipt-voucher">
//                             <input
//                                 type="text"
//                                 placeholder="Mã giảm giá"
//                                 value={voucherCode}
//                                 onChange={(e) => setVoucherCode(e.target.value)}
//                                 disabled={isSubmitting}
//                             />
//                             <button
//                                 onClick={() => {
//                                     handleApplyVoucher(voucherCode);
//                                 }}
//                                 disabled={isSubmitting}>
//                                 Áp dụng
//                             </button>
//                         </div>
//                         {selectedVoucher && discountAmount === 0 && (
//                             <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
//                                 Nhấn Áp dụng để sử dụng voucher
//                             </div>
//                         )}
//                         <div className="confirm-receipt-price">
//                             <div className="confirm-receipt-price-spacebetween">
//                                 <p>Tạm tính: </p>
//                                 <span className="font-bold">{totalAmount.toLocaleString()} đ</span>
//                             </div>
//                             <div className="confirm-receipt-price-spacebetween">
//                                 <p>Phí vận chuyển </p>
//                                 <span className="font-bold">
//                                     {shippingFee > 0 ? `${shippingFee.toLocaleString()} đ` : '-'}
//                                 </span>
//                             </div>
//                             {discountAmount > 0 && (
//                                 <div className="confirm-receipt-price-spacebetween">
//                                     <p>Giảm giá: </p>
//                                     <div>
//                                         <span className="font-bold text-success">
//                                             -{discountAmount.toLocaleString()} đ
//                                         </span>
//                                         <button
//                                             style={{
//                                                 marginLeft: '8px',
//                                                 background: 'none',
//                                                 border: 'none',
//                                                 color: '#ff4d4f',
//                                                 cursor: 'pointer',
//                                             }}
//                                             onClick={clearAppliedVoucher}>
//                                             ✕
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="confirm-receipt-total">
//                             <h5>Tổng cộng</h5>
//                             <span className="font-bold">
//                                 {(totalAmount + shippingFee - discountAmount).toLocaleString()} đ
//                             </span>
//                         </div>
//                         <div
//                             className="confirm-receipt-button"
//                             onClick={() => {
//                                 if (isSubmitting) return; // Prevent multiple submissions

//                                 form.validateFields(['paymentMethod', 'shippingMethod'])
//                                     .then(() => {
//                                         form.submit();
//                                     })
//                                     .catch(() => {
//                                         const paymentMethod = form.getFieldValue('paymentMethod');
//                                         const shippingMethod = form.getFieldValue('shippingMethod');

//                                         if (!paymentMethod) {
//                                             message.error('Vui lòng chọn phương thức thanh toán');
//                                         }

//                                         if (!shippingMethod) {
//                                             message.error('Vui lòng chọn phương thức vận chuyển');
//                                         }
//                                     });
//                             }}>
//                             <button disabled={isSubmitting || cartItems.length === 0}>
//                                 {isSubmitting
//                                     ? 'Đang xử lý...'
//                                     : cartItems.length === 0
//                                     ? 'Không có sản phẩm'
//                                     : 'Đặt hàng'}
//                             </button>
//                         </div>
//                     </div>
//                 </Col>
//             </Row>
//         </Container>
//     );
// }
import React, { useEffect } from 'react';
import './CheckOutPage.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, message, Radio, Select } from 'antd';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../redux/feature/cartSlice';
import api from '../../config/api';
import Cookies from 'js-cookie';
import { clearCart } from '../../redux/feature/cartSlice';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

export default function CheckOutPage() {
    // Add this with your other state declarations
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [form] = useForm();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.sellPrice * item.quantity;
    }, 0);
    const [userAddress, setUserAddress] = React.useState([]);
    const [userVoucher, setUserVoucher] = React.useState([]);
    const [selectedVoucher, setSelectedVoucher] = React.useState(null);
    const [voucherCode, setVoucherCode] = React.useState('');
    const [discountAmount, setDiscountAmount] = React.useState(0);
    const [shippingFee, setShippingFee] = React.useState(0);

    const handleAddressChange = (value) => {
        const selectedAddress = userAddress.find((address) => address.addressId === value);
        if (selectedAddress) {
            form.setFieldsValue({
                province: selectedAddress.city,
                district: selectedAddress.district,
                address: selectedAddress.addDetail,
                ward: selectedAddress.ward,
            });

            // Calculate shipping fee after setting form values
            setTimeout(() => handleGetShippingFee(), 100); // Small delay to ensure form values are set
        }
    };

    const handleApplyVoucher = async (voucherCode) => {
        if (!voucherCode.trim()) {
            message.error('Vui lòng nhập hoặc chọn mã giảm giá');
            return;
        }

        setIsSubmitting(true); // Set loading state when applying voucher

        const voucherToApply = userVoucher.find((v) => v.voucherCode === voucherCode && v.statusVoucher === true);

        if (!voucherToApply) {
            message.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
            setIsSubmitting(false);
            return;
        }
        const usrId = user.userId;
        try {
            const response = await api.post('user/apply-voucher', { usrId, voucherCode });
            if (response.data.statusCode === 200) {
                // Find the voucher and calculate discount
                const appliedVoucher = userVoucher.find((v) => v.voucherCode === voucherCode);
                if (appliedVoucher) {
                    const discount = (totalAmount * appliedVoucher.voucherDiscount) / 100;
                    setDiscountAmount(discount);
                    setSelectedVoucher(appliedVoucher.voucherId);
                    message.success(`Áp dụng mã giảm giá thành công! Giảm ${appliedVoucher.voucherDiscount}%`);
                } else {
                    message.success('Áp dụng mã giảm giá thành công');
                }
                handleFetchVoucher();
            } else {
                message.error('Áp dụng mã giảm giá thất bại: ' + response.data.message);
            }
        } catch (error) {
            message.error('Áp dụng mã giảm giá thất bại: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
        } finally {
            setIsSubmitting(false); // Reset loading state when done
        }
    };

    const clearAppliedVoucher = () => {
        setSelectedVoucher(null);
        setVoucherCode('');
        setDiscountAmount(0);
        message.info('Đã xóa mã giảm giá');
    };

    const handleFetchVoucher = async () => {
        try {
            const response = await api.get('user/vouchers?page=1&pageSize=1000');
            if (response.data.statusCode === 200) {
                setUserVoucher(response.data.data.items);
            }
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch voucher:', error.response?.data);
        }
    };

    const handleGetAddressCodeByAddress = async () => {
        try {
            // Get current form values
            const formValues = form.getFieldsValue();
            const provinceName = formValues.province;
            const districtName = formValues.district;
            const wardName = formValues.ward;

            if (!provinceName || !districtName || !wardName) {
                message.error('Vui lòng chọn đầy đủ thông tin địa chỉ');
                return null;
            }

            // Step 1: Get provinces and find province ID
            const provinceResponse = await api.get('delivery/provinces');
            if (provinceResponse.data.statusCode !== 200) {
                throw new Error('Không thể lấy thông tin tỉnh/thành phố');
            }

            const provinces = provinceResponse.data.data;
            const province = provinces.find((p) => p.ProvinceName.toLowerCase() === provinceName.toLowerCase());

            if (!province) {
                message.error(`Không tìm thấy tỉnh/thành phố: ${provinceName}`);
                return null;
            }

            // Step 2: Get districts for the found province
            const districtResponse = await api.get(`delivery/districts?provinceId=${province.ProvinceID}`);
            if (districtResponse.data.statusCode !== 200) {
                throw new Error('Không thể lấy thông tin quận/huyện');
            }

            const districts = districtResponse.data.data;
            const district = districts.find((d) => d.DistrictName.toLowerCase() === districtName.toLowerCase());

            if (!district) {
                message.error(`Không tìm thấy quận/huyện: ${districtName}`);
                return null;
            }

            // Step 3: Get wards for the found district
            const wardResponse = await api.get(`delivery/wards?districtId=${district.DistrictID}`);
            if (wardResponse.data.statusCode !== 200) {
                throw new Error('Không thể lấy thông tin phường/xã');
            }

            const wards = wardResponse.data.data;
            const ward = wards.find((w) => w.WardName.toLowerCase() === wardName.toLowerCase());

            if (!ward) {
                message.error(`Không tìm thấy phường/xã: ${wardName}`);
                return null;
            }

            // Return the found IDs and codes
            return {
                provinceId: province.ProvinceID,
                districtId: district.DistrictID,
                wardCode: ward.WardCode,
            };
        } catch (error) {
            console.error('Lỗi khi lấy mã địa chỉ:', error);
            message.error('Không thể xác định mã địa chỉ: ' + (error.message || 'Đã xảy ra lỗi'));
            return null;
        }
    };

    const handleGetShippingFee = async () => {
        try {
            // Get location codes from the address
            const addressCodes = await handleGetAddressCodeByAddress();
            if (!addressCodes) {
                return; // Error message already shown in handleGetAddressCodeByAddress
            }

            const response = await api.post('delivery/shipping-fee', {
                from_district_id: 1454, // Origin district ID (shop's location)
                from_ward_code: '21211', // Origin ward code (shop's location)
                service_id: 53320,
                service_type_id: null,
                to_district_id: addressCodes.districtId, // Customer's district ID
                to_ward_code: addressCodes.wardCode, // Customer's ward code
                height: 50,
                length: 20,
                weight: 200,
                width: 20,
                insurance_value: 10000,
                cod_failed_amount: 2000,
                coupon: null,
                items: cartItems.map((item) => ({
                    name: item.productName,
                    quantity: item.quantity,
                    height: 200,
                    weight: 1000,
                    length: 200,
                    width: 200,
                })),
            });

            // Log the entire response to diagnose structure
            console.log('Shipping fee response:', response.data);

            if (response.data.statusCode === 200) {
                // Access the deeply nested total field correctly
                const fee = response.data.data.data.total;
                setShippingFee(fee);
                form.setFieldsValue({ shippingFee: fee });
                message.success(`Phí vận chuyển: ${fee.toLocaleString()} đ`);
                return fee;
            } else {
                message.error('Không thể tính phí vận chuyển: ' + response.data.message);
                return 0;
            }
        } catch (error) {
            console.error('Failed to get shipping fee:', error);
            // Better error handling with proper data path
            if (error.response?.data) {
                console.error('Error details:', error.response.data);
            }
            message.error('Không thể tính phí vận chuyển');
            return 0;
        }
    };

    useEffect(() => {
        handleFetchVoucher();
    }, []);

    const handleUseVoucher = async (orderId) => {
        try {
            const response = await api.post('user/use-voucher', {
                voucherCode: voucherCode,
                orderId: orderId,
            });

            if (response.data.statusCode === 200) {
                console.log('Voucher used successfully');
                return true;
            } else {
                console.error('Failed to use voucher:', response.data.message);
                return false;
            }
        } catch (error) {
            console.error('Error using voucher:', error.response?.data || error);
            throw error;
        }
    };
    const handleCheckout = async (values) => {
        // Set loading state to true at the start
        setIsSubmitting(true);

        // Recalculate total amount to ensure it's current
        const currentTotalAmount = cartItems.reduce((total, item) => {
            return total + item.sellPrice * item.quantity;
        }, 0);
        const finalAmount = currentTotalAmount - discountAmount + shippingFee;

        if (selectedVoucher !== null) {
            values.VoucherCodeApplied = voucherCode;
        }
        values.shippingFee = shippingFee.toString();
        values.orderItems = cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            sellPrice: item.sellPrice,
            discountedPrice: item.discountedPrice,
        }));

        try {
            const response = await api.post('Orders/create', values);

            if (response.data.statusCode === 201) {
                const OrderId = BigInt(response.data.data.ordId).toString();
                if (voucherCode && discountAmount > 0) {
                    try {
                        await handleUseVoucher(OrderId);
                        console.log('Voucher marked as used successfully');
                    } catch (error) {
                        console.error('Failed to mark voucher as used:', error);
                        // Continue with payment even if voucher marking fails
                    }
                }
                if (values.paymentMethod === 'COD') {
                    // For COD, skip payment API call
                    message.success('Đặt hàng thành công!');
                    dispatch(clearCart());
                    // Redirect to order confirmation page or homepage
                    window.location.href = routes.orderSuccess || routes.home;
                } else {
                    // For VNPay, proceed with payment creation
                    const paymentCreate = {
                        OrderId,
                        PaymentMethod: values.paymentMethod,
                        PaymentAmount: finalAmount,
                        ShippingMethod: values.shippingMethod,
                    };
                    try {
                        const responsePayment = await api.post('Payment/create', paymentCreate);
                        const paymentUrl = responsePayment.data.data.paymentUrl;
                        // Clear the cart after successful payment initiation
                        message.success('Đặt hàng thành công!');
                        dispatch(clearCart());
                        window.location.assign(paymentUrl);
                    } catch (error) {
                        setIsSubmitting(false); // Reset loading state on error
                        message.error(
                            'Không thể tạo thanh toán: ' + (error.response?.data?.message || 'Đã xảy ra lỗi')
                        );
                        console.log('Failed to create payment:', error.response?.data);
                    }
                }
            }
        } catch (error) {
            setIsSubmitting(false); // Reset loading state on error
            message.error('Không thể đặt hàng: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
            console.error('Failed to checkout:', error.response?.data);
        }
    };

    useEffect(() => {
        const fetchAddressAndSetDefault = async () => {
            try {
                const response = await api.get('address/get-all-address?page1&pageSize=1000');
                if (response.data.statusCode === 200) {
                    const addresses = response.data.data.items;

                    // Filter addresses to only include those with status === true
                    const activeAddresses = addresses.filter((address) => address.status === true);

                    // Set only active addresses to state
                    setUserAddress(activeAddresses);

                    // Select the first active address as default (since all are now active)
                    if (activeAddresses.length > 0) {
                        const defaultAddress = activeAddresses[0];
                        form.setFieldsValue({
                            userAddress: defaultAddress.addressId,
                            province: defaultAddress.city,
                            district: defaultAddress.district,
                            address: defaultAddress.addDetail,
                            ward: defaultAddress.ward,
                            email: user?.email || '',
                            name: user?.fullName || '',
                            phone: user?.phone || '',
                        });

                        // Calculate shipping fee for default address
                        setTimeout(() => handleGetShippingFee(), 500);
                    } else {
                        console.log('No active addresses found');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch address:', error.response?.data);
            }
        };

        fetchAddressAndSetDefault();
    }, [form]);

    return (
        <Container>
            <Link to={routes.cart}>
                <Button
                    type="default"
                    icon={<LeftOutlined />}
                    size="large"
                    style={{ fontWeight: 'bold', marginTop: '3%' }}>
                    Quay về giỏ hàng
                </Button>
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
                                    <Select.Option value={address.addressId} key={index}>
                                        {address.addDetail}, {address.ward}, {address.district}, {address.city}
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
                                            <div className="pay-row-vnp">
                                                <p>Thanh toán qua VNPAY</p>
                                                <img
                                                    src="https://static.ybox.vn/2024/1/4/1705551987477-logo-ngang.png"
                                                    alt=""
                                                />
                                            </div>
                                        </Radio>
                                        <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                                    </Radio.Group>
                                </div>
                            </Form.Item>

                            <Form.Item
                                className="order-method-ship"
                                name="shippingMethod"
                                rules={[{ required: true, message: 'Chọn phương thức vận chuyển' }]}>
                                <div>
                                    <h5 className="font-bold">Vận chuyển</h5>
                                    <Radio.Group className="radio-group2">
                                        <Radio value="Ahamove" className="">
                                            <div className="ship-row-ahamove">
                                                <p> Vận chuyển Giao Hàng Nhanh</p>
                                                <img
                                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Orange.png"
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
                                    <div className="confirm-receipt-items-row-part1">
                                        <div className="confirm-receipt-items-row-part1-img">
                                            <img
                                                src={
                                                    typeof item.images[0] === 'string'
                                                        ? item.images[0]
                                                        : item.images[0]?.prodImageUrl || 'https://via.placeholder.com/80'
                                                }
                                                alt={item.productName}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                            />

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
                        <div className="available-vouchers">
                            <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Voucher khả dụng</h6>
                            <div className="voucher-list">
                                {userVoucher.filter((voucher) => voucher.statusVoucher === true).length > 0 ? (
                                    userVoucher
                                        .filter((voucher) => voucher.statusVoucher === true)
                                        .map((voucher, index) => (
                                            <div
                                                key={index}
                                                className={`voucher-card ${selectedVoucher === voucher.voucherId ? 'selected' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelectedVoucher(voucher.voucherId);
                                                    setVoucherCode(voucher.voucherCode);
                                                }}>
                                                <div className="voucher-info">
                                                    <div className="voucher-code">{voucher.voucherCode}</div>
                                                    <div className="voucher-discount">
                                                        Giảm {voucher.voucherDiscount}%
                                                    </div>
                                                    <div className="voucher-desc">{voucher.voucherDesc}</div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <p>Không có voucher nào khả dụng</p>
                                )}
                            </div>
                        </div>
                        <div className="confirm-receipt-voucher">
                            <input
                                type="text"
                                placeholder="Mã giảm giá"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <button
                                onClick={() => {
                                    handleApplyVoucher(voucherCode);
                                }}
                                disabled={isSubmitting}>
                                Áp dụng
                            </button>
                        </div>
                        {selectedVoucher && discountAmount === 0 && (
                            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                                Nhấn Áp dụng để sử dụng voucher
                            </div>
                        )}
                        <div className="confirm-receipt-price">
                            <div className="confirm-receipt-price-spacebetween">
                                <p>Tạm tính: </p>
                                <span className="font-bold">{totalAmount.toLocaleString()} đ</span>
                            </div>
                            <div className="confirm-receipt-price-spacebetween">
                                <p>Phí vận chuyển </p>
                                <span className="font-bold">
                                    {shippingFee > 0 ? `${shippingFee.toLocaleString()} đ` : '-'}
                                </span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="confirm-receipt-price-spacebetween">
                                    <p>Giảm giá: </p>
                                    <div>
                                        <span className="font-bold text-success">
                                            -{discountAmount.toLocaleString()} đ
                                        </span>
                                        <button
                                            style={{
                                                marginLeft: '8px',
                                                background: 'none',
                                                border: 'none',
                                                color: '#ff4d4f',
                                                cursor: 'pointer',
                                            }}
                                            onClick={clearAppliedVoucher}>
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="confirm-receipt-total">
                            <h5>Tổng cộng</h5>
                            <span className="font-bold">
                                {(totalAmount + shippingFee - discountAmount).toLocaleString()} đ
                            </span>
                        </div>
                        <div
                            className="confirm-receipt-button"
                            onClick={() => {
                                if (isSubmitting) return; // Prevent multiple submissions

                                form.validateFields(['paymentMethod', 'shippingMethod'])
                                    .then(() => {
                                        form.submit();
                                    })
                                    .catch(() => {
                                        const paymentMethod = form.getFieldValue('paymentMethod');
                                        const shippingMethod = form.getFieldValue('shippingMethod');

                                        if (!paymentMethod) {
                                            message.error('Vui lòng chọn phương thức thanh toán');
                                        }

                                        if (!shippingMethod) {
                                            message.error('Vui lòng chọn phương thức vận chuyển');
                                        }
                                    });
                            }}>
                            <button disabled={isSubmitting}>{isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}</button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
