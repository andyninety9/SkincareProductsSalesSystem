using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class PaymentRequestDto
    {
        public string OrderId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string ReturnUrl { get; set;} = string.Empty;
        public string IpAddress { get; set; } = string.Empty;
        public string BankCode { get; set; } = string.Empty;
    }
}