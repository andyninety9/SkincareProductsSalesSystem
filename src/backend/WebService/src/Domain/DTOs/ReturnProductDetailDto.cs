using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ReturnProductDetailDto
    {
        public long ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductImage { get; set; } = string.Empty;
        public double SellPrice { get; set; }
        public short Quantity { get; set; }

    }
}