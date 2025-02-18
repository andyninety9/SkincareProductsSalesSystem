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

        public async Task<PaymentResponseDto> CreatePaymentUrl(PaymentRequestDto request)
        {
            try
            {
                var vnpParams = new SortedDictionary<string, string>
        {
            { "vnp_Version", "2.1.0" },
            { "vnp_Command", "pay" },
            { "vnp_TmnCode", _config.VNPayTmnCode },
            { "vnp_Amount", ((int)(request.Amount * 100)).ToString() }, // Đúng định dạng VNPay yêu cầu
            { "vnp_CurrCode", "VND" },
            { "vnp_TxnRef", request.OrderId },
            { "vnp_OrderInfo", $"Thanh toán đơn hàng {request.OrderId}" },
            { "vnp_OrderType", request.OrderType ?? "other" },
            { "vnp_Locale", string.IsNullOrEmpty(request.Locale) ? "vn" : request.Locale },
            { "vnp_ReturnUrl", request.ReturnUrl },
            { "vnp_IpAddr", request.IpAddress },
            { "vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss") }, // Format chuẩn VNPay
            { "vnp_ExpireDate", DateTime.Now.AddMinutes(15).ToString("yyyyMMddHHmmss") } // Format chuẩn VNPay
        };

                if (!string.IsNullOrEmpty(request.BankCode))
                {
                    vnpParams.Add("vnp_BankCode", request.BankCode);
                }

                // Tạo query string từ dictionary (đã encode URL)
                string queryString = string.Join("&", vnpParams.Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));

                // Tạo SecureHash
                string hashData = HashVNPay(queryString, _config.VNPayHashSecret);

                // Tạo URL thanh toán
                string paymentUrl = $"{_config.VNPayUrl}?{queryString}&vnp_SecureHash={hashData}&vnp_SecureHashType=SHA512";

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




        public async Task<PaymentCallbackResponseDto> ValidatePaymentResponse(Dictionary<string, string> queryParams)
        {
            string transactionStatus = queryParams.GetValueOrDefault("vnp_TransactionStatus", "99");
            string orderId = queryParams.GetValueOrDefault("vnp_TxnRef", "");
            string amount = queryParams.GetValueOrDefault("vnp_Amount", "0");

            bool success = transactionStatus == "00";

            return await Task.FromResult(new PaymentCallbackResponseDto
            {
                Success = success,
                OrderId = orderId,
                Amount = int.Parse(amount) / 100
            });
        }
        private string HashVNPay(string data, string secretKey)
        {
            using (var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secretKey)))
            {
                byte[] hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }




        public async Task<PaymentStatusDto> GetPaymentStatus(string orderId)
        {
            // Giả định trạng thái đơn hàng (trong thực tế có thể cần query từ database)
            var status = new PaymentStatusDto
            {
                OrderId = orderId,
                Status = "Paid", // Giả định đơn hàng đã thanh toán thành công
                Amount = 500000, // Ví dụ số tiền thanh toán
                TransactionId = $"VNP{new Random().Next(10000, 99999)}"
            };

            return await Task.FromResult(status);
        }
    }
}
