using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Application.Abstractions.Payment;
using Domain.DTOs;
using Microsoft.Extensions.Options;

namespace Infrastructure.VNPay
{
    public class VNPayService : IPaymentVNPayService
    {
        private readonly VNPayConfig _config;
        private readonly string _vnpayApiUrl;
        private readonly string _hashSecret;
        private readonly SortedList<string, string> _requestData = new(new VnPayCompare());
        private readonly HttpClient _httpClient;

        public VNPayService(IOptions<VNPayConfig> config, HttpClient httpClient)
        {
            _config = config.Value;
            _vnpayApiUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
            _hashSecret = _config.VNPayHashSecret;
            _httpClient = httpClient;
        }

        public bool VerifySecureHash(string secureHash, Dictionary<string, string> parameters)
        {
            // ✅ Bỏ `vnp_SecureHash` và `vnp_SecureHashType` khi hash
            var sortedParams = parameters
                .Where(p => p.Key != "vnp_SecureHash" && p.Key != "vnp_SecureHashType")
                .OrderBy(p => p.Key)
                .ToDictionary(k => k.Key, v => v.Value);

            // ✅ Tạo query string từ dictionary (Encode URL để tránh lỗi ký tự đặc biệt)
            string queryString = string.Join("&", sortedParams.Select(kvp => $"{kvp.Key}={Uri.EscapeDataString(kvp.Value)}"));

            // ✅ Tạo lại SecureHash để so sánh
            string expectedHash = HmacSHA512(_config.VNPayHashSecret, queryString);

            return expectedHash.Equals(secureHash, StringComparison.OrdinalIgnoreCase);
        }



        public Task<PaymentResponseDto> CreatePaymentAsync(PaymentDto dto, double amount)
        {
            var clientIPAddress = GetClientIPAddress();

            AddRequestData("vnp_Version", "2.1.0");
            AddRequestData("vnp_Command", "pay");
            AddRequestData("vnp_TmnCode", _config.VNPayTmnCode); // Use the environment variable
            AddRequestData("vnp_Amount", DoubleToString(amount));
            AddRequestData("vnp_BankCode", "");
            AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            AddRequestData("vnp_CurrCode", "VND");
            AddRequestData("vnp_IpAddr", clientIPAddress);
            AddRequestData("vnp_Locale", "vn");
            AddRequestData("vnp_OrderInfo", "Payment for " + dto.OrderId);
            AddRequestData("vnp_OrderType", "other");
            AddRequestData("vnp_ReturnUrl", $"{$"{Environment.GetEnvironmentVariable("ENDPOINT_URL")}/payment-return?method=vnpay"}&orderId={dto.OrderId}");
            AddRequestData("vnp_TxnRef", dto.OrderId.ToString());

            var paymentUrl = CreateRequestUrl(_vnpayApiUrl, _hashSecret); // Use the environment variable
            return
                Task.FromResult(new PaymentResponseDto
                {
                    PaymentUrl = paymentUrl,
                });
        }

        public async Task<PaymentResponseDto> CheckTransactionStatus(string orderId)
        {
            _requestData.Clear();
            var requestId = DateTime.Now.Ticks.ToString();
            var createDate = DateTime.Now.ToString("yyyyMMddHHmmss");
            var clientIp = GetClientIPAddress();

            AddRequestData("vnp_RequestId", requestId);
            AddRequestData("vnp_Version", "2.1.0");
            AddRequestData("vnp_Command", "querydr");
            AddRequestData("vnp_TmnCode", _config.VNPayTmnCode);
            AddRequestData("vnp_TxnRef", orderId);
            AddRequestData("vnp_OrderInfo", $"Query transaction {orderId}");
            AddRequestData("vnp_TransactionNo", "123456");
            AddRequestData("vnp_TransactionDate", createDate);
            AddRequestData("vnp_CreateDate", createDate);
            AddRequestData("vnp_IpAddr", clientIp);

            // Create checksum
            var data =
                $"{requestId}|2.1.0|querydr|{_config.VNPayTmnCode}|{orderId}|{createDate}|{createDate}|{clientIp}|Query transaction {orderId}";
            var secureHash = HmacSHA512(_hashSecret, data);
            AddRequestData("vnp_SecureHash", secureHash);

            var content = new StringContent(
                JsonSerializer.Serialize(_requestData),
                Encoding.UTF8,
                "application/json"
            );

            var response =
                await _httpClient.PostAsync("https://sandbox.vnpayment.vn/merchant_webapi/api/transaction", content);
            var result = await response.Content.ReadAsStringAsync();

            var jsonDoc = JsonDocument.Parse(result);
            var resultCode = jsonDoc.RootElement.GetProperty("vnp_TransactionStatus").GetString();
            var message = jsonDoc.RootElement.GetProperty("vnp_Message").GetString();
            if (resultCode == "01")
                return new PaymentResponseDto { Success = true, Message = message };
            return new PaymentResponseDto { Success = false, Message = message };
        }

        private static string DoubleToString(double value)
        {
            // Round the double to the nearest integer
            var roundedValue = (int)Math.Round(value);
            // Multiply by 100
            var multipliedValue = roundedValue * 100;
            // Convert to string
            return multipliedValue.ToString();
        }
        private string GetClientIPAddress()
        {
            try
            {
                var hostName = Dns.GetHostName();
                var addresses = Dns.GetHostAddresses(hostName);
                var ipv4Address = addresses.FirstOrDefault(a => a.AddressFamily == AddressFamily.InterNetwork);
                return ipv4Address?.ToString() ?? "127.0.0.1";
            }
            catch (Exception)
            {
                return "127.0.0.1";
            }
        }

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value)) _requestData.Add(key, value);
        }
        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            var data = new StringBuilder();
            foreach (var kv in _requestData)
                if (!string.IsNullOrEmpty(kv.Value))
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
            var queryString = data.ToString();

            baseUrl += "?" + queryString;
            var signData = queryString;
            if (signData.Length > 0) signData = signData.Remove(data.Length - 1, 1);
            var vnp_SecureHash = HmacSHA512(vnp_HashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnp_SecureHash;

            return baseUrl;
        }

        public static string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                var hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue) hash.Append(theByte.ToString("x2"));
            }

            return hash.ToString();
        }
    }

}
public class VnPayCompare : IComparer<string>
{
    public int Compare(string? x, string? y)
    {
        if (x == y) return 0;
        if (x == null) return -1;
        if (y == null) return 1;
        var vnpCompare = CompareInfo.GetCompareInfo("en-US");
        return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
    }
}
