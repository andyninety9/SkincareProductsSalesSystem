import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, Result } from 'antd';
import api from '../../config/api';

export default function OrderProcess() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const paramsCheck = Object.fromEntries(queryParams.entries());

    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);

    console.log(paramsCheck);

    const handlePaymentReturn = async () => {
        try {
            const response = await api.get('Payment/payment-return', {
                params: {
                    OrderId: paramsCheck.OrderId,
                    Vnp_TransactionStatus: paramsCheck.Vnp_TransactionStatus,
                    Vnp_SecureHash: paramsCheck.Vnp_SecureHash,
                    Vnp_Amount: paramsCheck.Vnp_Amount,
                    Method: paramsCheck.Method,
                },
            });

            console.log(response.data);
            setPaymentStatus(response.data);
        } catch (error) {
            console.error('Failed to process payment:', error);
            setPaymentStatus({ success: false, message: 'Có lỗi xảy ra khi xử lý thanh toán.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handlePaymentReturn();
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                }}>
                <Spin size="large" />
                <p style={{ marginTop: '20px', fontSize: '18px', color: '#D8959A' }}>Đang xử lý thanh toán...</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '10%' }}>
            {paymentStatus?.success ? (
                <Result
                    status="success"
                    title="Thanh toán thành công!"
                    subTitle={`Số tiền thanh toán: ${(paramsCheck.Vnp_Amount / 100).toLocaleString()} VNĐ`}
                    extra={[
                        <button
                            key="order"
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#D8959A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/profile')}>
                            Xem đơn hàng của bạn
                        </button>,
                    ]}
                />
            ) : (
                <Result
                    status="error"
                    title="Quá trình thanh đoán đang được xử lý!"
                    subTitle={paymentStatus?.message || 'Có lỗi xảy ra khi xử lý thanh toán.'}
                    extra={[
                        <button
                            key="retry"
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#D8959A',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/')}>
                            Liên hệ với chúng tôi
                        </button>,
                    ]}
                />
            )}
        </div>
    );
}
