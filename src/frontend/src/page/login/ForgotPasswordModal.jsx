import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Typography } from "@mui/material";
import { AiOutlineMail, AiOutlineArrowLeft } from "react-icons/ai";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handleSend = () => {
        console.log("Email gửi đi:", email);
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
                        height: "250px",
                        backgroundColor: "#F6EEF0",
                        borderRadius: "10px",
                        padding: "20px",
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
                <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{
                            backgroundColor: "#F6EEF0",
                            fontFamily: "'Nunito', sans-serif",
                            "& .MuiInput-underline:before": { borderBottomColor: "#C87E83" },
                            "& .MuiInput-underline:after": { borderBottomColor: "#C87E83" },
                            "& .MuiInputAdornment-root": { color: "#C87E83" },
                        }}
                        InputProps={{
                            startAdornment: (
                                <AiOutlineMail size={20} style={{ marginRight: 10, color: "#C87E83" }} />
                            ),
                        }}
                    />
                </DialogContent>

                {/* Send Button */}
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button
                        onClick={handleSend}
                        sx={{
                            width: "80px",
                            height: "45px",
                            borderRadius: "20px",
                            border: "1px solid #5A2D2F",
                            backgroundColor: "#F6EEF0",
                            color: "#5A2D2F",
                            fontWeight: "bold",
                            fontFamily: "'Nunito', sans-serif",
                            textTransform: "none",
                            "&:hover": { backgroundColor: "#EAD5D8" },
                        }}
                    >
                        Gửi
                    </Button>
                </DialogActions>
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
                    <Typography sx={{ color: "#5A2D2F", mb: 2 }}>
                        Mavid đã gửi một email xác minh đến <strong>{email}</strong>.
                        Vui lòng kiểm tra hộp thư và nhấp vào link để hoàn tất xác minh.
                    </Typography>
                    <AiOutlineMail size={120} style={{ color: "#C87E83", marginBottom: "10px" }} />

                    {/* Resend Email */}
                    <Button
                        onClick={handleSend}
                        sx={{
                            color: "#C87E83",
                            textDecoration: "underline",
                            fontSize: "16px",
                            fontWeight: "bold",
                        }}
                    >
                        Gửi lại email
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ForgotPasswordModal;
