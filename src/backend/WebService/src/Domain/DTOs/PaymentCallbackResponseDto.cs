using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class PaymentCallbackResponseDto
    {
        public bool Success { get; set; }
        public string OrderId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}