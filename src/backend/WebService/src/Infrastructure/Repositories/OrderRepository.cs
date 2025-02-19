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

        public async Task<OrderDetailResponse?> GetOrderByIdAsync(long orderId, CancellationToken cancellationToken)
        {
            var order = await _context.Orders
                .Include(o => o.Usr)
                .Include(o => o.OrdStatus)
                .Include(o => o.OrderDetails).ThenInclude(od => od.Prod)
                .Include(o => o.Payments)
                .Include(o => o.DeliveryDetails)
                    .ThenInclude(d => d.DeliService)
                .Include(o => o.WarantyOrders)
                .Include(o => o.OrderLogs).ThenInclude(ol => ol.NewStatusOrd)
                .OrderBy(o => o.CreatedAt)
                .Select(o => new
                {
                    Order = o,
                    Address = o.DeliveryDetails.Select(d => d.Address).FirstOrDefault() // Lấy Address từ DeliveryDetails
                })
                .FirstOrDefaultAsync(o => o.Order.OrdId == orderId, cancellationToken);


            if (order == null) return null;

            return new OrderDetailResponse
            {
                OrderId = order.Order.OrdId,
                CustomerId = order.Order.UsrId,
                CustomerName = order.Order.Usr.Fullname ?? "Unknown",
                CustomerEmail = order.Order.Usr.Email,
                OrderDate = order.Order.OrdDate,
                OrderStatus = order.Order.OrdStatus.OrdStatusName,
                TotalPrice = order.Order.TotalOrdPrice,
                CreatedAt = order.Order.CreatedAt,
                UpdatedAt = order.Order.UpdatedAt,
                Payment = order.Order.Payments.Select(p => new PaymentDto
                {
                    PaymentId = p.PaymentId,
                    PaymentMethod = p.PaymentMethod,
                    PaymentAmount = p.PaymentAmount,
                    // CreatedAt = p.CreatedAt
                }).FirstOrDefault() ?? new PaymentDto(),
                Products = order.Order.OrderDetails.Select(od => new OrderProductDto
                {
                    ProductId = od.ProdId,
                    ProductName = od.Prod.ProductName,
                    Quantity = od.Quantity,
                    UnitPrice = od.SellPrice
                }).ToList(),
                ShippingAddress = order.Address != null ? new AddressDto
                {
                    AddressId = order.Address.AddressId,
                    Detail = order.Address.AddDetail + ", " + order.Address.Ward + ", " + order.Address.District + ", " + order.Address.City + ", " + order.Address.Country
                    // IsDefault = order.ShippingAddress.IsDefault
                } : new AddressDto(),
                Delivery = order.Order.DeliveryDetails.Select(d => new DeliveryDto
                {
                    DeliveryId = d.DeliId,
                    DeliveryService = d.DeliService.DeliServiceName,
                    DeliveryPhone = d.DeliPhone,
                    DeliveryStatus = d.DeliStatus ? "Success" : "Failed",
                    CreatedAt = d.CreateAt
                }).FirstOrDefault() ?? new DeliveryDto(),
                Warranty = order.Order.WarantyOrders.Select(w => new WarrantyOrderDto
                {
                    WarrantyId = w.WarantyId,
                    StartDate = w.CreatedAt,
                    EndDate = w.EndDate
                }).FirstOrDefault() ?? new WarrantyOrderDto(),
                OrderLogs = order.Order.OrderLogs.Select(ol => new OrderLogDto
                {
                    OrderLogId = ol.OrdLogId,
                    NewStatusOrderId = ol.NewStatusOrdId,
                    NewStatusOrderName = ol.NewStatusOrd.OrdStatusName, 
                    UserId = ol.UsrId,
                    Note = ol.Note,
                    CreatedAt = ol.CreatedAt
                }).ToList()
            };
        }

        public async Task<(IEnumerable<GetAllOrdersResponse> Orders, int TotalCount)> GetAllUserOrdersHistoryByQueryAsync(long userId, DateTime? fromDate, DateTime? toDate, int page, int pageSize, CancellationToken cancellationToken)
        {
            var query = _context.Orders
                .Include(o => o.Usr) // Join với User (CustomerName)
                .Include(o => o.OrdStatus) // Join với OrderStatus
                .Include(o => o.OrderDetails) // Lấy thông tin chi tiết đơn hàng
                    .ThenInclude(od => od.Prod) // Lấy thông tin sản phẩm
                .Where(o => o.Usr.UsrId == userId)
                .AsQueryable();

            // Áp dụng bộ lọc nếu có

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
