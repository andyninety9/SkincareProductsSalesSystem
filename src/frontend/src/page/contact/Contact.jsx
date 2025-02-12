import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaPhone, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import contactImg from "../../assets/contact.jpg";
import "../../index.css";
import "../login/Login.css";


const Contact = () => {
    return (
        <>

            <div className="contact-container d-flex flex-column align-items-center justify-content-center flex-grow-1 "
                style={{
                    background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${contactImg}) no-repeat center center / cover`,
                    backgroundAttachment: "fixed", 
                    maxWidth: "100%",
                    minHeight: "100vh", 
                    margin: "0 auto",
                    padding: "20px",
                    position: "relative",
                    overflow: "hidden", }}>
                <div className="text-center mt-5 mb-4">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ fontSize: "39px", fontFamily: "'Prata', serif", color: "#5A2D2F" }}>
                            Liên hệ với <span style={{ fontFamily: "'Oooh Baby', cursive", fontSize:"45px" }}>Mavid</span>
                        </h2>
                    </div>
                </div>
                <Formik
                    initialValues={{ fullname: "", phone: "", email: "", question: "" }}
                    validationSchema={Yup.object({
                        fullname: Yup.string().required("Họ và tên không được để trống"),
                        phone: Yup.string().required("Số điện thoại không được để trống"),
                        email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
                        question: Yup.string().required("Câu hỏi không được để trống"),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log("Form Data:", values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form style={{ width: "400px",  }}>
                            <div className="mb-3">
                                <label className="form-label" style={{ fontSize: "14px", color: "#C87E83", fontFamily: "'Nunito', sans-serif" }}>
                                    <FaUser className="me-1" /> Họ và tên

                                </label>
                                <Field
                                    name="fullname"
                                    type="text"
                                    className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                    style={{ backgroundColor: "transparent" }}
                                />
                                <ErrorMessage name="fullname" component="div" className="text-danger small mt-1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" style={{ fontSize: "14px", color: "#C87E83", fontFamily: "'Nunito', sans-serif" }}>
                                    <FaPhone className="me-1" /> Số điện thoại
                                </label>
                                <Field
                                    name="phone"
                                    type="text"
                                    className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                    style={{ backgroundColor: "transparent" }}
                                />
                                <ErrorMessage name="phone" component="div" className="text-danger small mt-1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" style={{ fontSize: "14px", color: "#C87E83", fontFamily: "'Nunito', sans-serif" }}>
                                    <FaEnvelope className="me-1" /> Địa chỉ email
                                </label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="form-control border-0 border-bottom rounded-0 custom-border-bottom"
                                    style={{ backgroundColor: "transparent" }}
                                />
                                <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" style={{ fontSize: "14px", color: "#C87E83", fontFamily: "'Nunito', sans-serif" }}>
                                    <FaQuestionCircle className="me-1" /> Câu hỏi của bạn
                                </label>
                                <Field
                                    name="question"
                                    as="textarea"
                                    className="form-control -0 custom-border"
                                    style={{ backgroundColor: "transparent", borderColor: "#C87E83", minHeight: "150px" }}
                                    
                                />
                                <ErrorMessage name="question" component="div" className="text-danger small mt-1" />
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
                                    backgroundColor: "transparent",
                                    color: "#5A2D2F",
                                    fontWeight: "bold",
                                    fontFamily: "'Nunito', sans-serif",
                                    marginLeft: "40px",
                                    marginTop: "80px",
                                    marginBottom: "80px"
                                }}
                                disabled={isSubmitting}
                            >
                                GỬI CÂU HỎI 
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>

        </>
    );
};

export default Contact;
