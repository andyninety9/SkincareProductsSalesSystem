using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetAllOrdersResponse
    {
        public long OrderId { get; set; }
        public string? CustomerName { get; set; }
        public long ? EventId { get; set; }
        public DateTime OrderDate { get; set; }
        public required string OrderStatus { get; set; }
        public double TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        // public string DeliveryStatus { get; set; } // Trạng thái giao hàng (nếu có)
        // public string PaymentMethod { get; set; } // Phương thức thanh toán
        // public bool IsReturned { get; set; } // Kiểm tra đơn hàng có yêu cầu hoàn trả không
        public List<OrderProductDto> Products { get; set; } = new List<OrderProductDto>(); // Danh sách sản phẩm trong đơn hàng
    }
}