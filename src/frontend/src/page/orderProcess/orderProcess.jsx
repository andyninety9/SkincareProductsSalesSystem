import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/api';

export default function OrderProcess() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const paramsCheck = Object.fromEntries(queryParams.entries());

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
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    };

    useEffect(() => {
        handlePaymentReturn();
    }, []);

    return <div>orderProcess</div>;
}
