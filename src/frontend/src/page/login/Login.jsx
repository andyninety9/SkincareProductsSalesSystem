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
import ForgotPasswordModal from './ForgotPasswordModal';
import { routes } from '../../routes';
import { GoogleLogin } from '@react-oauth/google';

import './Login.css';
import '../../index.css';
import api from '../../config/api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const Login = () => {
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = await api.post('oauth/google', {
                idToken: credentialResponse.credential,
            });

            Cookies.set('accessToken', response.data?.data.accessToken, {
                expires: 3,
                secure: true,
            });
            Cookies.set('refreshToken', response.data?.data.refreshToken, {
                expires: 5,
                secure: true,
            });

            const userGetMe = await api.get('user/get-me');
            const user = {
                ...userGetMe.data.data,
                usrId: jwtDecode(response.data?.data.accessToken).sub,
            };

            Cookies.set('user', JSON.stringify(user), {
                expires: 5,
                secure: true,
            });

            navigate(routes.home);
            toast.success('Google login successful');
        } catch (error) {
            console.error('Google login error:', error);
            toast.error('Google login failed');
        }
    };

    const handleLogin = async (values) => {
        console.log(values);
        try {
            const response = await api.post('Authen/login', values);
            console.log('response: ', response);
            Cookies.set('accessToken', response.data?.data.accessToken, {
                expires: 3,
                secure: true,
            });
            Cookies.set('refreshToken', response.data?.data.refreshToken, {
                expires: 5,
                secure: true,
            });

            const decodedToken = jwtDecode(response.data?.data.accessToken);
            // console.log(decodedToken.sub);
            // console.log(decodedToken);
            // const decodedRefreshToken = jwtDecode(response.data?.data.refreshToken);
            // console.log("refreshToken", decodedRefreshToken);

            const userGetMe = await api.get('user/get-me');
            // console.log(userGetMe.data.data);
            const user = {
                ...userGetMe.data.data,
                usrId: decodedToken.sub,
            };

            Cookies.set('user', JSON.stringify(user), {
                expires: 7,
                secure: true,
            });
            if (user) {
                navigate(routes.home);
                toast.success('Login successfully');
            }
        } catch (error) {
            if (error.response.data.errors != null) {
                toast.error(error.response.data.errors[0].description);
            } else if (error.response.data.detail != null) {
                toast.error(error.response.data.detail);
            } else {
                toast.error('Login failed');
            }
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
                            }}>
                            Đăng Nhập
                        </h2>
                    </div>

                    <Formik
                        initialValues={{ username: '', password: '', remember: false }}
                        validationSchema={Yup.object({
                            username: Yup.string().required('Tên đăng nhập không được để trống'),
                            password: Yup.string()
                                .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
                                .max(100, 'Mật khẩu không được dài quá 100 ký tự')
                                .matches(
                                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,100}$/,
                                    'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'
                                )
                                .required('Mật khẩu không được để trống'),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            // console.log("Form Data:", values);
                            setSubmitting(false);
                            handleLogin(values);
                        }}>
                        {({ isSubmitting }) => (
                            <Form style={{ width: '380px' }}>
                                {/* Username */}
                                <div className="mb-3">
                                    <label
                                        className="form-label"
                                        style={{
                                            fontSize: '14px',
                                            color: '#C87E83',
                                            fontFamily: "'Nunito', sans-serif",
                                        }}>
                                        <FaUser className="me-1" /> Tên đăng nhập
                                    </label>
                                    <Field
                                        name="username"
                                        type="text"
                                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                        style={{ backgroundColor: '#F6EEF0' }}
                                    />
                                    <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
                                </div>

                                {/* Password with Eye Icon */}
                                <div className="mb-3 position-relative">
                                    <label
                                        className="form-label"
                                        style={{
                                            fontSize: '14px',
                                            color: '#C87E83',
                                            fontFamily: "'Nunito', sans-serif",
                                        }}>
                                        <FaLock className="me-1" /> Mật khẩu
                                    </label>
                                    <div className="position-relative">
                                        <Field
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            className="form-control border-0 border-bottom rounded-0 custom-border-bottom pe-4"
                                            style={{ backgroundColor: '#F6EEF0' }}
                                        />
                                        <span
                                            className="position-absolute top-50 translate-middle-y"
                                            style={{
                                                right: '10px',
                                                cursor: 'pointer',
                                                color: '#C87E83',
                                            }}
                                            onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                        </span>
                                    </div>
                                    <ErrorMessage name="password" component="div" className="text-danger small mt-1" />

                                    {/* Forgot Password */}
                                    <span
                                        onClick={() => setIsForgotPasswordOpen(true)}
                                        className="d-block text-end small text-decoration-none mt-1"
                                        style={{ color: '#C87E83', cursor: 'pointer' }}>
                                        Quên mật khẩu?
                                    </span>

                                    {/* Forgot Password Modal */}
                                    {isForgotPasswordOpen && (
                                        <ForgotPasswordModal
                                            isOpen={isForgotPasswordOpen}
                                            onClose={() => setIsForgotPasswordOpen(false)}
                                        />
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className="form-check mb-3">
                                    <Field
                                        type="checkbox"
                                        name="remember"
                                        className="form-check-input"
                                        style={{
                                            border: '1px solid #C87E83', // Change border color
                                            accentColor: '#C87E83', // Change check color
                                        }}
                                    />
                                    <label className="form-check-label text-muted" style={{ fontSize: '14px' }}>
                                        Ghi nhớ mật khẩu
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className=" d-flex align-items-center justify-content-center"
                                    style={{
                                        width: '80%',
                                        height: '45px',
                                        borderRadius: '10px',
                                        border: '1px solid #5A2D2F',
                                        backgroundColor: '#F6EEF0',
                                        color: '#5A2D2F',
                                        fontWeight: 'bold',
                                        fontFamily: "'Nunito', sans-serif",
                                        marginLeft: '40px',
                                        marginTop: '40px',
                                    }}
                                    disabled={isSubmitting}>
                                    ĐĂNG NHẬP
                                </button>

                                {/* Link qua Signup */}
                                <div className="text-center mt-3 ">
                                    <p className="text-muted small">
                                        Bạn chưa có tài khoản?
                                        <Link
                                            to={routes.register}
                                            className="text-decoration-none fw-bold text-decoration-underline"
                                            style={{
                                                color: '#C87E83',
                                                fontFamily: "'Nunito', sans-serif",
                                                fontStyle: 'italic',
                                            }}>
                                            Tạo tài khoản
                                        </Link>
                                    </p>
                                </div>

                                {/* Login with socials */}
                                <div className="text-center mt-3">
                                    <div className="d-flex align-items-center">
                                        <hr
                                            className="flex-grow-1"
                                            style={{ flex: 0.4, borderTop: '1px solid #C87E83' }}
                                        />
                                        <p
                                            className="small mx-2"
                                            style={{
                                                color: '#C87E83',
                                                fontFamily: "'Nunito', sans-serif",
                                                fontWeight: 'bold',
                                                margin: 0,
                                            }}>
                                            Đăng nhập bằng
                                        </p>
                                        <hr
                                            className="flex-grow-1"
                                            style={{ flex: 0.4, borderTop: '1px solid #C87E83' }}
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center gap-3">
                                        <div className="google-login-button">
                                            <GoogleLogin
                                                onSuccess={handleGoogleLogin}
                                                onError={() => {
                                                    toast.error('Google login failed');
                                                }}
                                                theme="outline"
                                                size="large"
                                                shape="rectangular"
                                                logo_alignment="center"
                                                text="signin_with"
                                                useOneTap
                                                render={({ onClick }) => (
                                                    <button
                                                        type="button"
                                                        onClick={onClick}
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '80px',
                                                            height: '40px',
                                                            borderRadius: '10px',
                                                            border: '1px solid #5A2D2F',
                                                            backgroundColor: '#F6EEF0',
                                                        }}>
                                                        <FaGoogle size={18} style={{ color: '#5A2D2F' }} />
                                                    </button>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

                <FooterUser />
            </div>
        </>
    );
};

export default Login;
