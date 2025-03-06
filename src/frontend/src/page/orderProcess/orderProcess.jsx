import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { routes } from '../../routes';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/feature/cartSlice';
import toast from 'react-hot-toast';
import { Spin } from 'antd';

export default function OrderProcess() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const paramsCheck = Object.fromEntries(queryParams.entries());
    const dispatch = useDispatch();

    console.log(paramsCheck);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handlePaymentReturn = async () => {
            setLoading(true);
            const { orderId, vnp_TransactionStatus, vnp_SecureHash, vnp_Amount, method } = paramsCheck;
            const LongOrderId = BigInt(orderId);
            try {
                const response = await api.get(
                    `Payment/payment-return?OrderId=${LongOrderId}&Vnp_TransactionStatus=${vnp_TransactionStatus}&Vnp_SecureHash=${vnp_SecureHash}&Vnp_Amount=${vnp_Amount}&Method=${method}`
                );
                console.log(response.data);
                if (response.data.statusCode === 200) {
                    toast.success('Thanh toán thành công');
                    dispatch(clearCart());
                } else {
                    toast.error('Thanh toán thất bại');
                    navigate(routes.cart);
                }
            } catch (error) {
                console.error('Payment failed:', error);
            }
            setLoading(false);
        };
        handlePaymentReturn();
    }, []);
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
        <>
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    fontSize: '30px',
                    fontWeight: 'bold',
                }}>
                Thanh Toán thành công
            </div>
        </>
    );
}
