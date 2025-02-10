using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(MyDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<GetAllOrdersResponse> Orders, int TotalCount)> GetAllOrdersByQueryAsync(
            string? status,
            long? customerId,
            long? eventId,
            DateTime? fromDate,
            DateTime? toDate,
            int page,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var query = _context.Orders
                .Include(o => o.Usr) // Join với User (CustomerName)
                .Include(o => o.OrdStatus) // Join với OrderStatus
                .Include(o => o.OrderDetails) // Lấy thông tin chi tiết đơn hàng
                    .ThenInclude(od => od.Prod) // Lấy thông tin sản phẩm
                .AsQueryable();

            // Áp dụng bộ lọc nếu có
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.OrdStatus.OrdStatusName == status);
            }

            if (customerId.HasValue)
            {
                query = query.Where(o => o.UsrId == customerId.Value);
            }

            if (eventId.HasValue)
            {
                query = query.Where(o => o.EventId == eventId.Value);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(o => o.OrdDate >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(o => o.OrdDate <= toDate.Value);
            }

            int totalItems = await query.CountAsync(cancellationToken);

            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new GetAllOrdersResponse
                {
                    OrderId = o.OrdId,
                    CustomerName = o.Usr.Fullname ?? o.Usr.Email ?? "Unknow", // Nếu `Fullname` NULL thì lấy `Username`
                    EventId = o.EventId, // Nếu NULL, mặc định trả về `0`
                    OrderDate = o.OrdDate,
                    OrderStatus = o.OrdStatus.OrdStatusName,
                    TotalPrice = o.TotalOrdPrice,
                    CreatedAt = o.CreatedAt,

                    // Danh sách sản phẩm trong đơn hàng
                    Products = o.OrderDetails.Select(od => new OrderProductDto
                    {
                        ProductId = od.Prod.ProductId,
                        ProductName = od.Prod.ProductName,
                        Quantity = od.Quantity,
                        UnitPrice = od.SellPrice
                    }).ToList()
                })
                .ToListAsync(cancellationToken);

            return (orders, totalItems);
        }
    }
}
