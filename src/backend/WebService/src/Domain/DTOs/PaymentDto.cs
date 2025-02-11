using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class PaymentDto
    {
        public long PaymentId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public double PaymentAmount { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}