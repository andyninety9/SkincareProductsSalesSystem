import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import HeaderUser from "../../component/header/HeaderUser";
import FooterUser from "../../component/footer/FooterUser";
// import "Login.css" from "../Login.css";
import "../../index.css";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    return (
        <>
            <HeaderUser />
            <div className="d-flex flex-column" style={{ minHeight: "100%" }}>
                <div className="login-container d-flex flex-column align-items-center justify-content-center flex-grow-1" style={{ background: "#F6EEF0" }}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ fontSize: "39px", fontFamily: "'Prata', serif", color: "#5A2D2F" }}>
                            Đăng Ký
                        </h2>
                    </div>

                    <Formik
                        initialValues={{ username: "", email: "", phone: "", password: "", confirmPassword: "" }}
                        validationSchema={Yup.object({
                            username: Yup.string().required("Tên đăng nhập không được để trống"),
                            email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
                            phone: Yup.string().matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ").required("Số điện thoại không được để trống"),
                            password: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
                            confirmPassword: Yup.string()
                                .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
                                .required("Xác nhận mật khẩu không được để trống"),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            console.log("Form Data:", values);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form style={{ width: "380px" }}>
                                {/* Username */}
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontSize: "14px", color: "#C87E83" }}>
                                        <FaUser className="me-1" /> Tên đăng nhập
                                    </label>
                                    <Field
                                        name="username"
                                        type="text"
                                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                        style={{ backgroundColor: "#F6EEF0" }}
                                    />
                                    <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontSize: "14px", color: "#C87E83" }}>
                                        <FaEnvelope className="me-1" /> Email
                                    </label>
                                    <Field
                                        name="username"
                                        type="text"
                                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                        style={{ backgroundColor: "#F6EEF0" }}
                                    />
                                    <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                                </div>

                                {/* Phone Number */}
                                <div className="mb-3">
                                    <label className="form-label" style={{ fontSize: "14px", color: "#C87E83" }}>
                                        <FaPhone className="me-1" /> Số điện thoại
                                    </label>
                                    <Field
                                        name="username"
                                        type="text"
                                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                        style={{ backgroundColor: "#F6EEF0" }}
                                    />
                                    <ErrorMessage name="phone" component="div" className="text-danger small mt-1" />
                                </div>

                                {/* Password */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label" style={{ fontSize: "14px", color: "#C87E83" }}>
                                        <FaLock className="me-1" /> Mật khẩu
                                    </label>
                                    <Field
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                        style={{ backgroundColor: "#F6EEF0" }}
                                    />
                                    {/* Eye Icon */}
                                    <span
                                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                                        style={{ cursor: "pointer", color: "#C87E83" }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    </span>
                                    <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                                </div>

                                {/* Confirm Password */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label" style={{ fontSize: "14px", color: "#C87E83" }}>
                                        <FaLock className="me-1" /> Xác nhận mật khẩu
                                    </label>
                                    <Field
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                        style={{ backgroundColor: "#F6EEF0" }}
                                    />
                                    {/* Eye Icon */}
                                    <span
                                        className="position-absolute top-50 end-0 translate-middle-y me-3"
                                        style={{ cursor: "pointer", color: "#C87E83" }}
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    </span>
                                    <ErrorMessage name="confirmPassword" component="div" className="text-danger small mt-1" />
                                </div>


                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className=" d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "80%",
                                        height: "45px",
                                        borderRadius: "10px",
                                        border: "1px solid #5A2D2F",
                                        backgroundColor: "#F6EEF0",
                                        color: "#5A2D2F",
                                        fontWeight: "bold",
                                        fontFamily: "'Nunito', sans-serif",
                                        marginLeft: "40px",
                                        marginTop: "40px"
                                    }}
                                    disabled={isSubmitting}
                                >
                                    ĐĂNG KÝ
                                </button>

                                <div className="text-center mt-3">
                                    <p className="text-muted small">
                                        Bạn đã có tài khoản? <Link to="/login" className="fw-bold" style={{ color: "#C87E83" }}>Đăng nhập</Link>
                                    </p>
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

export default Register;
