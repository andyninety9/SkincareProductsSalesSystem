using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class OrderItem
    {
        public long ProductId { get; set; }
        public short Quantity { get; set; }
        public double SellPrice { get; set; }
        
    }
}