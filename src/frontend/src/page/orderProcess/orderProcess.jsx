import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { routes } from '../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/feature/cartSlice';
import toast from 'react-hot-toast';
import { Button, Spin } from 'antd';
import { clearPendingOrder, selectPendingOrder } from '../../redux/feature/orderSlice';

export default function OrderProcess() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const paramsCheck = Object.fromEntries(queryParams.entries());
    const dispatch = useDispatch();
    const pendingOrder = useSelector(selectPendingOrder);

    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);

    const handleCreateDeliveryOrder = async (orderId) => {
        try {
            if (!orderDetails) {
                console.error('Order details not available for delivery creation');
                return null;
            }

            // Calculate total weight based on products
            const totalWeight = orderDetails.products.reduce(
                (sum, item) => sum + (item.weight || 200) * item.quantity,
                200
            );

            // Extract shipping address from orderDetails or get separately
            // Since the response doesn't include complete address details,
            // we need to handle this differently
            const customerInfo = {
                name: orderDetails.customerName,
                phone: orderDetails.delivery?.deliveryPhone || '0123456789', // Default if missing
                // If these fields don't exist in your response, you may need to fetch customer details separately
                address: orderDetails.shippingAddress?.detail || 'Default address',
                province: 'Hồ Chí Minh', // Default values - ideally get from order data
                district: 'Quận 1', // Default values - ideally get from order data
                ward: 'Phường Bến Nghé', // Default values - ideally get from order data
            };

            const response = await api.post('delivery/create-order', {
                payment_type_id: 1, // 1 for paid (since this is after payment success)
                note: orderDetails.note || 'Đơn hàng từ Mavid Skincare',
                required_note: 'KHONGCHOXEMHANG',
                from_name: 'Mavid Skincare Shop',
                from_phone: '0987654321',
                from_address: '43 Xô Viết Nghệ Tĩnh, Phường 17, Quận Bình Thạnh, Hồ Chí Minh, Vietnam',
                from_ward_name: 'Phường 17',
                from_district_name: 'Quận Bình Thạnh',
                from_province_name: 'HCM',
                return_phone: '0918788433',
                return_address: '39 NTT',
                to_name: customerInfo.name || 'Khách hàng Mavid',
                to_phone: customerInfo.phone,
                to_address: customerInfo.address,
                to_ward_name: customerInfo.ward,
                to_district_name: customerInfo.district,
                to_province_name: customerInfo.province,
                cod_amount: 0, // Already paid online
                content: `Đơn hàng #${orderId}`,
                weight: totalWeight,
                length: 20,
                width: 20,
                height: 10,
                insurance_value: 1000000, // Use totalPrice from the response
                service_id: 0,
                service_type_id: 2,
                items: orderDetails.products.map((item) => ({
                    name: item.productName,
                    code: item.productId.toString(),
                    quantity: item.quantity,
                    price: item.unitPrice,
                    length: 12,
                    width: 12,
                    height: 12,
                    weight: item.weight || 200,
                    category: {
                        level1: 'Mỹ phẩm',
                    },
                })),
            });

            console.log('Delivery order response:', response.data);

            if (response.data.statusCode === 200) {
                const deliveryOrderId = response.data.data.data.order_code;

                // Update order with delivery tracking code
                try {
                    await api.put(`Orders/update-tracking/${orderId}`, {
                        trackingCode: deliveryOrderId,
                    });
                    toast.success('Đã tạo đơn vận chuyển thành công');
                    return deliveryOrderId;
                } catch (updateError) {
                    console.error('Failed to update order with tracking code:', updateError);
                    return null;
                }
            } else {
                toast.error('Không thể tạo đơn vận chuyển: ' + response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Failed to create delivery order:', error);
            if (error.response?.data) {
                console.error('Error details:', error.response.data);
            }
            toast.error('Không thể tạo đơn vận chuyển');
            return null;
        }
    };

    const handleFetchOrderDetail = async (orderId) => {
        try {
            const response = await api.get(`Orders/${orderId}`);
            if (response.data.statusCode === 200) {
                setOrderDetails(response.data.data);
                return response.data.data;
            } else {
                console.error('Failed to fetch order details:', response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Failed to fetch order details:', error);
            return null;
        }
    };

    useEffect(() => {
        const handlePaymentReturn = async () => {
            setLoading(true);
            const { orderId, vnp_TransactionStatus, vnp_SecureHash, vnp_Amount, method } = paramsCheck;
            const LongOrderId = BigInt(orderId);
            console.log('Pending order from Redux:', pendingOrder);

            try {
                // Step 1: Verify payment status
                const response = await api.get(
                    `Payment/payment-return?OrderId=${LongOrderId}&Vnp_TransactionStatus=${vnp_TransactionStatus}&Vnp_SecureHash=${vnp_SecureHash}&Vnp_Amount=${vnp_Amount}&Method=${method}`
                );
                console.log(response.data);

                if (response.data.statusCode === 200) {
                    toast.success('Thanh toán thành công');

                    // Get order details - use pendingOrder data if available
                    let customerInfo;
                    if (pendingOrder && pendingOrder.orderId === orderId) {
                        customerInfo = pendingOrder.recipientInfo;
                        // Can use other data from pendingOrder as needed
                    } else {
                        // Fallback to fetching from API if needed
                        const orderData = await handleFetchOrderDetail(orderId);
                        // Process orderData...
                    }

                    // Create delivery order with enhanced information
                    const deliveryOrderId = await handleCreateDeliveryOrder(orderId);

                    // Clear pending order from Redux when done
                    dispatch(clearPendingOrder());
                } else {
                    toast.error('Thanh toán thất bại');
                    navigate(routes.cart);
                }
            } catch (error) {
                console.error('Payment failed:', error);
                toast.error('Có lỗi xảy ra khi xử lý thanh toán');
                navigate(routes.cart);
            } finally {
                setLoading(false);
            }
        };

        handlePaymentReturn();
    }, [dispatch, pendingOrder, paramsCheck]);

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Spin size="large" tip="Đang xử lý đơn hàng..." />
            </div>
        );
    }
    return (
        <div
            className="payment-success-container"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                background: '#f8f9fa',
            }}>
            <div
                className="success-icon"
                style={{
                    fontSize: '60px',
                    color: '#52c41a',
                    marginBottom: '20px',
                }}>
                ✓
            </div>
            <h1
                style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '30px',
                }}>
                Thanh Toán Thành Công
            </h1>
            <p
                style={{
                    fontSize: '18px',
                    color: '#666',
                    marginBottom: '40px',
                }}>
                Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
            </p>
            <Button
                type="primary"
                size="large"
                onClick={() => navigate(routes.home)}
                style={{
                    height: '48px',
                    fontSize: '16px',
                    padding: '0 40px',
                    borderRadius: '24px',
                }}>
                Tiếp tục mua sắm
            </Button>
        </div>
    );
}
