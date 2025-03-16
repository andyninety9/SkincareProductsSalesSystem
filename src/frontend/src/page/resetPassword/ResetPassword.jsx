import React, { useEffect } from 'react';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaLock } from 'react-icons/fa';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import HeaderUser from '../../component/header/HeaderUser';
import FooterUser from '../../component/footer/FooterUser';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import { routes } from '../../routes';
import '../../index.css';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const backesUrl = import.meta.env.VITE_BACK_END_BASE_URL;
    const navigate = useNavigate();
    const [forgotPasswordToken, setForgotPasswordToken] = useState('');

    useEffect(() => {
        // Extract token from URL query parameters
        const searchParams = new URLSearchParams(window.location.search);
        const token = searchParams.get('token');

        if (token) {
            setForgotPasswordToken(token);
        } else {
            toast.error('Token không hợp lệ');
            // Redirect to login if no token is present
            setTimeout(() => {
                navigate(routes.login);
            }, 2000);
        }
    }, [navigate]);

    const handleResetPassword = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post(`${backesUrl}user/change-password-forgot`, {
                ForgotPasswordToken: forgotPasswordToken,
                NewPassword: values.password,
                ConfirmPassword: values.confirmPassword,
            });

            if (response.status === 200) {
                toast.success('Đặt lại mật khẩu thành công');
                setTimeout(() => {
                    navigate(routes.login);
                }, 1000);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Đặt lại mật khẩu không thành công');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <HeaderUser />
            <div className="d-flex flex-column" style={{ minHeight: '100%' }}>
                <div
                    className="login-container d-flex flex-column align-items-center justify-content-center flex-grow-1"
                    style={{ background: '#F6EEF0' }}>
                    <div className="text-center mb-4">
                        <h2
                            className="fw-bold"
                            style={{
                                fontSize: '39px',
                                fontFamily: "'Prata', serif",
                                color: '#5A2D2F',
                                marginTop: '-100px',
                            }}>
                            Mật khẩu mới
                        </h2>
                    </div>

                    <Formik
                        initialValues={{ password: '', confirmPassword: '' }}
                        validationSchema={Yup.object({
                            password: Yup.string()
                                .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
                                .required('Mật khẩu không được để trống'),
                            confirmPassword: Yup.string()
                                .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận phải trùng khớp')
                                .required('Xác nhận mật khẩu không được để trống'),
                        })}
                        onSubmit={handleResetPassword}>
                        {({ isSubmitting }) => (
                            <Form style={{ width: '380px' }}>
                                {/* Password Field */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label" style={{ fontSize: '14px', color: '#C87E83' }}>
                                        <FaLock className="me-1" /> Mật khẩu mới
                                    </label>
                                    <div className="position-relative">
                                        <Field
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control border-0 border-bottom rounded-0 custom-border-bottom pe-4"
                                            style={{ backgroundColor: '#F6EEF0', paddingRight: '40px' }} // Added padding for space
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y me-3" // Ensures alignment
                                            style={{ cursor: 'pointer', color: '#C87E83' }}
                                            onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </span>
                                    </div>
                                    <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label" style={{ fontSize: '14px', color: '#C87E83' }}>
                                        <FaLock className="me-1" /> Xác nhận mật khẩu
                                    </label>
                                    <div className="position-relative">
                                        <Field
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="form-control border-0 border-bottom rounded-0 custom-border-bottom pe-4"
                                            style={{ backgroundColor: '#F6EEF0', paddingRight: '40px' }} // Added padding for space
                                        />
                                        <span
                                            className="position-absolute top-50 end-0 translate-middle-y me-3" // Ensures alignment
                                            style={{ cursor: 'pointer', color: '#C87E83' }}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </span>
                                    </div>
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-danger small mt-1"
                                    />
                                </div>

                                <p className="text-muted small" style={{ textAlign: 'center', marginTop: '40px' }}>
                                    Sau khi xác nhận bạn có thể đăng nhập lại
                                </p>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '50%',
                                        height: '45px',
                                        borderRadius: '10px',
                                        border: '1px solid #5A2D2F',
                                        backgroundColor: '#F6EEF0',
                                        color: '#5A2D2F',
                                        fontWeight: 'bold',
                                        fontFamily: "'Nunito', sans-serif",
                                        marginLeft: '90px',
                                        marginTop: '20px',
                                    }}
                                    disabled={isSubmitting}>
                                    XÁC NHẬN
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                <FooterUser />
            </div>
        </>
    );
};

export default ResetPassword;
