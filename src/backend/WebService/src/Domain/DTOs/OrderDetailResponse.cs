using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.DTOs
{
    public class OrderDetailResponse
    {
        public long OrderId { get; set; }
        public long CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; } = string.Empty;
        public double TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public PaymentDto Payment { get; set; } = new();
        public List<OrderProductDto> Products { get; set; } = new();
        public AddressDto ShippingAddress { get; set; } = new();
        public DeliveryDto Delivery { get; set; } = new();
        public WarrantyOrderDto Warranty { get; set; } = new();
        public List<OrderLogDto> OrderLogs { get; set; } = new();
    }
}