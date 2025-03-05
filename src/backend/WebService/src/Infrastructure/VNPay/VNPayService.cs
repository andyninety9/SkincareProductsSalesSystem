using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
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
            try
            {
                Console.WriteLine("========== Debug: VerifySecureHash ==========");
                Console.WriteLine("🔹 Received SecureHash (Raw): '" + secureHash + "'");

                // 1️⃣ Loại bỏ `vnp_SecureHash`, `vnp_SecureHashType`, `method`, `orderId`
                var sortedParams = new SortedList<string, string>(new VnPayCompare());

                foreach (var param in parameters)
                {
                    if (!string.IsNullOrEmpty(param.Value)
                        && param.Key != "vnp_SecureHash"
                        && param.Key != "vnp_SecureHashType"
                        && param.Key != "method"
                        && !param.Key.StartsWith("orderId")) // Loại bỏ orderId
                    {
                        sortedParams.Add(param.Key, param.Value);
                    }
                }

                // 2️⃣ Kiểm tra `vnp_Amount` có cần chia lại 100 không
                if (sortedParams.ContainsKey("vnp_Amount"))
                {
                    long amount = long.Parse(sortedParams["vnp_Amount"]);
                    if (amount % 100 == 0) // Nếu giá trị có thể chia hết cho 100 thì chia lại
                    {
                        sortedParams["vnp_Amount"] = (amount / 100).ToString();
                    }
                }

                // 3️⃣ Debug: Hiển thị danh sách tham số sau khi sắp xếp
                Console.WriteLine("🔹 Sorted Parameters for SecureHash:");
                foreach (var kvp in sortedParams)
                {
                    Console.WriteLine($"{kvp.Key} = {kvp.Value}");
                }

                // 4️⃣ Tạo query string
                var queryString = string.Join("&", sortedParams.Select(kv => $"{WebUtility.UrlEncode(kv.Key)}={WebUtility.UrlEncode(kv.Value)}"));
                Console.WriteLine("🔹 Query String: " + queryString);

                // 5️⃣ Tạo SecureHash mong đợi
                string expectedHash = HmacSHA512(_config.VNPayHashSecret, queryString);
                Console.WriteLine("🔹 Expected SecureHash (Raw): '" + expectedHash + "'");

                // 6️⃣ Chuẩn hóa SecureHash trước khi so sánh
                secureHash = secureHash.Trim().ToLower();
                expectedHash = expectedHash.Trim().ToLower();

                // Nếu có khoảng trắng hoặc ký tự lạ, loại bỏ
                secureHash = Regex.Replace(secureHash, @"\s+", "");
                expectedHash = Regex.Replace(expectedHash, @"\s+", "");

                Console.WriteLine("🔹 Processed SecureHash: '" + secureHash + "'");
                Console.WriteLine("🔹 Processed ExpectedHash: '" + expectedHash + "'");

                // 7️⃣ So sánh lại
                bool isValid = expectedHash.Equals(secureHash, StringComparison.OrdinalIgnoreCase);
                Console.WriteLine("✅ SecureHash Match: " + isValid);

                return isValid;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error in VerifySecureHash: " + ex.Message);
                return false;
            }
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
            var requestId = DateTime.UtcNow.Ticks.ToString();
            var createDate = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var clientIp = GetClientIPAddress();

            AddRequestData("vnp_RequestId", requestId);
            AddRequestData("vnp_Version", "2.1.0");
            AddRequestData("vnp_Command", "querydr");
            AddRequestData("vnp_TmnCode", _config.VNPayTmnCode);
            AddRequestData("vnp_TxnRef", orderId);
            AddRequestData("vnp_CreateDate", createDate);
            AddRequestData("vnp_TransactionDate", createDate);
            AddRequestData("vnp_IpAddr", clientIp);

            // Tạo SecureHash
            var data = $"{requestId}|2.1.0|querydr|{_config.VNPayTmnCode}|{orderId}|{createDate}|{clientIp}";
            var secureHash = HmacSHA512(_hashSecret, data);
            AddRequestData("vnp_SecureHash", secureHash);

            var content = new StringContent(JsonSerializer.Serialize(_requestData), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync("https://sandbox.vnpayment.vn/merchant_webapi/api/transaction", content);
                response.EnsureSuccessStatusCode(); // Ném lỗi nếu HTTP status code không thành công

                var result = await response.Content.ReadAsStringAsync();
                var jsonDoc = JsonDocument.Parse(result);

                string resultCode = jsonDoc.RootElement.GetProperty("vnp_TransactionStatus").GetString();
                string message = jsonDoc.RootElement.GetProperty("vnp_Message").GetString();

                return new PaymentResponseDto
                {
                    Success = resultCode == "00",
                    Message = message
                };
            }
            catch (Exception ex)
            {
                return new PaymentResponseDto { Success = false, Message = $"Lỗi khi kiểm tra trạng thái giao dịch: {ex.Message}" };
            }
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
            try
            {
                Console.WriteLine("========== Debug: HmacSHA512 ==========");
                Console.WriteLine("🔹 Key: " + key);
                Console.WriteLine("🔹 Input Data: " + inputData);

                using (var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key)))
                {
                    byte[] hashValue = hmac.ComputeHash(Encoding.UTF8.GetBytes(inputData));
                    string hashString = BitConverter.ToString(hashValue).Replace("-", "").ToLower(); // Đảm bảo là chữ thường

                    Console.WriteLine("✅ Generated Hash: " + hashString);
                    return hashString;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error in HmacSHA512: " + ex.Message);
                return string.Empty;
            }
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
