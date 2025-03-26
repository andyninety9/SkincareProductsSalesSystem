using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetTopSellingProductDto
    {
        public long ProductId { get; set; } 
        public string ProductName { get; set; }
        public string ImageUrl { get; set; }
        public long QuantitySold { get; set; } 
        public decimal Revenue { get; set; }
        public decimal UnitPrice { get; set; }
    }
}