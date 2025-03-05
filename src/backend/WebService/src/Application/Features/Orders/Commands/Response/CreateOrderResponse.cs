using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Entities;

namespace Application.Features.Orders.Commands.Response
{
    public class CreateOrderResponse
    {
        public long OrdId { get; set; }   // Mã đơn hàng
        public long UsrId { get; set; }   // Mã người dùng
        public long? EventId { get; set; } // Sự kiện (nếu có)
        public DateTime OrdDate { get; set; } // Ngày đặt hàng
        public string OrderStatus { get; set; } // Trạng thái đơn hàng (Pending, Processing,...)
        public double TotalOrdPrice { get; set; } // Tổng tiền đơn hàng
        public bool? IsPaid { get; set; } // Đã thanh toán hay chưa

        public List<OrderItem> Items { get; set; } = new(); // Danh sách sản phẩm
    }
}