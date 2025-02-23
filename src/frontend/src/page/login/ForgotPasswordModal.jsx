import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Typography } from "@mui/material";
import { AiOutlineMail, AiOutlineArrowLeft } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Box } from "@mui/material";
import * as Yup from "yup";


const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
    });

    const handleSend = (emailValue) => {
        console.log("Email gửi đi:", emailValue);
        setEmail(emailValue);
        setIsSent(true);
    };

    return (
        <>
            {/* Nhap email */}
            <Dialog
                open={isOpen}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                sx={{
                    "& .MuiPaper-root": {
                        height: "260px",
                        backgroundColor: "#F6EEF0",
                        borderRadius: "10px",
                        padding: "20px",
                        overflow: "hidden",
                    },
                }}
            >
                {/* Back Button */}
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 10, left: 10, color: "#C87E83" }}
                >
                    <AiOutlineArrowLeft size={24} />
                </IconButton>

                {/* Title */}
                <DialogTitle
                    sx={{ textAlign: "center", fontFamily: "'Nunito', sans-serif", color: "#5A2D2F", fontSize: "22px" }}
                >
                    Nhập email để nhận mã xác minh
                </DialogTitle>

                

                {/* Input Field */}
                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSend(values.email); 
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form>
                            <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 1 }}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    name="email"
                                    type="email"
                                    variant="standard"
                                    placeholder="Email của bạn"
                                    error={touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={{
                                        backgroundColor: "#F6EEF0",
                                        fontFamily: "'Nunito', sans-serif",
                                        "& .MuiInput-underline:before": { borderBottomColor: "#C87E83" },
                                        "& .MuiInput-underline:after": { borderBottomColor: "#C87E83" },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <AiOutlineMail size={20} style={{ marginRight: 10, color: "#C87E83" }} />
                                        ),
                                    }}
                                />
                            </DialogContent>

                            <DialogActions sx={{ justifyContent: "center" }}>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !!errors.email}
                                    sx={{
                                        width: "80px",
                                        height: "40px",
                                        borderRadius: "10px",
                                        border: "1px solid #5A2D2F",
                                        backgroundColor: "#F6EEF0",
                                        color: "#5A2D2F",
                                        fontWeight: "bold",
                                        fontFamily: "'Nunito', sans-serif",
                                        textTransform: "none",
                                        marginTop: "10px",
                                        "&:hover": { backgroundColor: "#EAD5D8" },
                                    }}
                                >
                                    Gửi
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>

            </Dialog>

            {/* Email Confirmation */}
            <Dialog
                open={isSent}
                onClose={() => setIsSent(false)}
                maxWidth="xs"
                fullWidth
                sx={{
                    "& .MuiPaper-root": {
                        textAlign: "center",
                        backgroundColor: "#FDF6F6",
                        padding: "20px",
                        borderRadius: "10px",

                    },
                }}
            >
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        height: "300px"
                    }}
                >
                    {/* Back Button */}
                    <IconButton
                        onClick={() => setIsSent(false)}
                        sx={{ position: "absolute", top: 10, left: 10, color: "#5A2D2F" }}
                    >
                        <AiOutlineArrowLeft size={24} />
                    </IconButton>

                    <Typography variant="h5" sx={{ fontFamily: "'Prata', serif", color: "#5A2D2F", mb: 2 }}>
                        Xác thực email
                    </Typography>
                    <Typography sx={{ color: "#5A2D2F", mb: 1, textAlign: "center" }}>
                        Mavid đã gửi một email xác minh đến <strong>{email}</strong>.
                        Vui lòng kiểm tra hộp thư và nhấp vào link để hoàn tất xác minh.
                    </Typography>
                    
                    {/* Resend Email */}
                    <Button
                        onClick={() => handleSend(email)}
                        sx={{
                            color: "#C87E83",
                            textDecoration: "underline",
                            fontSize: "14px",
                            textTransform: "none"
                        
                        }}
                    >
                        Gửi lại email
                    </Button>

                    <AiOutlineMail style={{ color: "#C87E83", marginBottom: "10px", marginTop: "40px", transform: "scale(8)"}} />

                </DialogContent>
            </Dialog>
        </>
    );
};

export default ForgotPasswordModal;
