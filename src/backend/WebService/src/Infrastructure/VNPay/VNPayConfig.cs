using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.VNPay
{
    public class VNPayConfig
    {
        public string VNPayUrl { get; set; }
        public string VNPayTmnCode { get; set; }
        public string VNPayHashSecret { get; set; }

        public VNPayConfig()
        {
            VNPayUrl = Environment.GetEnvironmentVariable("VNPAY_BASE_URL") ?? string.Empty;
            VNPayTmnCode = Environment.GetEnvironmentVariable("VNPAY_TMNCODE") ?? string.Empty;
            VNPayHashSecret = Environment.GetEnvironmentVariable("VNPAY_HASHSECRET") ?? string.Empty;
        }

    }
}