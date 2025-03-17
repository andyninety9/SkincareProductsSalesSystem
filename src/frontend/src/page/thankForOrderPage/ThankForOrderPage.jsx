import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { routes } from '../../routes';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../redux/feature/cartSlice';
import toast from 'react-hot-toast';
import { Button, Spin } from 'antd';

export default function ThankForOrderPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <div className="text-center max-w-md mx-auto">
                {/* <div className="mb-5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-green-500 mx-auto rounded-full p-3 bg-green-50 shadow-sm"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </div> */}
                <div
                    className="success-icon"
                    style={{
                        fontSize: '60px',
                        color: '#52c41a',
                        marginBottom: '20px',
                    }}>
                    ✓
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h1>

                <p className="text-gray-600 mb-6">
                    Đơn hàng của bạn sẽ sớm được xử lý và giao đến địa chỉ đã đăng ký. Vui lòng thanh toán khi nhận
                    hàng.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                    <p className="text-gray-700 mb-2">
                        <span className="font-semibold">Hình thức thanh toán:</span> Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Thời gian giao hàng dự kiến:</span> 3-5 ngày làm việc
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* <Button type="primary" onClick={() => (window.location.href = '/orders')} className="bg-blue-500">
                        Xem đơn hàng của tôi
                    </Button> */}
                    <Button onClick={() => navigate(routes.home)} className="bg-gray-500">
                        Tiếp tục mua sắm
                    </Button>
                </div>
            </div>
        </div>
    );
}
