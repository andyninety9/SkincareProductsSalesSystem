using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class OrderProductDto
    {
        public long ProductId { get; set; }
        public required string ProductName { get; set; }
        public int Quantity { get; set; }
        public double UnitPrice { get; set; }
    }
}