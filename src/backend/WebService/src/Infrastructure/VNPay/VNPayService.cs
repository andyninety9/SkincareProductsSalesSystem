using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Application.Abstractions.Payment;
using Domain.DTOs;
using Microsoft.Extensions.Options;

namespace Infrastructure.VNPay
{
    public class VNPayService : IPaymentService
    {
        private readonly VNPayConfig _config;

        public VNPayService(IOptions<VNPayConfig> config)
        {
            _config = config.Value;
        }

        /// <summary>
        /// Tạo URL thanh toán VNPay
        /// </summary>
        public async Task<PaymentResponseDto> CreatePaymentUrl(PaymentRequestDto request)
        {
            try
            {
                string vnp_TmnCode = _config.VNPayTmnCode;
                string vnp_HashSecret = _config.VNPayHashSecret;
                string vnp_Url = _config.VNPayUrl;

                string vnp_ReturnUrl = request.ReturnUrl;
                string vnp_OrderInfo = $"Thanh toán đơn hàng {request.OrderId}";
                string vnp_TxnRef = request.OrderId;
                string vnp_Amount = (request.Amount * 100).ToString(); // VNPay tính bằng đồng, không phải VND
                string vnp_BankCode = request.BankCode;

                Dictionary<string, string> vnp_Params = new Dictionary<string, string>
                {
                    { "vnp_Version", "2.1.0" },
                    { "vnp_Command", "pay" },
                    { "vnp_TmnCode", vnp_TmnCode },
                    { "vnp_Amount", vnp_Amount },
                    { "vnp_CurrCode", "VND" },
                    { "vnp_TxnRef", vnp_TxnRef },
                    { "vnp_OrderInfo", vnp_OrderInfo },
                    { "vnp_OrderType", "billpayment" },
                    { "vnp_Locale", "vn" },
                    { "vnp_ReturnUrl", vnp_ReturnUrl },
                    { "vnp_IpAddr", request.IpAddress },
                    { "vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss") }
                };

                if (!string.IsNullOrEmpty(vnp_BankCode))
                {
                    vnp_Params.Add("vnp_BankCode", vnp_BankCode);
                }

                // Tạo query string
                string queryString = string.Join("&", vnp_Params);
                string hashData = HashVNPay(queryString, vnp_HashSecret);

                string paymentUrl = $"{vnp_Url}?{queryString}&vnp_SecureHash={hashData}";

                return await Task.FromResult(new PaymentResponseDto
                {
                    Success = true,
                    Message = "Payment URL created successfully",
                    PaymentUrl = paymentUrl
                });
            }
            catch (Exception ex)
            {
                return new PaymentResponseDto
                {
                    Success = false,
                    Message = $"Error generating VNPay URL: {ex.Message}",
                    PaymentUrl = string.Empty
                };
            }
        }

        /// <summary>
        /// Xác thực phản hồi từ VNPay
        /// </summary>
        public async Task<bool> ValidatePaymentResponse(PaymentResponseDto response)
        {
            // Giả sử VNPay có trả về mã giao dịch để kiểm tra
            return await Task.FromResult(response.TransactionId != null);
        }

        /// <summary>
        /// Tạo chữ ký bảo mật cho VNPay
        /// </summary>
        private string HashVNPay(string data, string secretKey)
        {
            var hash = new HMACSHA512(Encoding.UTF8.GetBytes(secretKey));
            byte[] hashBytes = hash.ComputeHash(Encoding.UTF8.GetBytes(data));
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
