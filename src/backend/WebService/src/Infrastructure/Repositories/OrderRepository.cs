using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Enum;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        private readonly ILogger<OrderRepository> _logger;
        public OrderRepository(MyDbContext context, ILogger<OrderRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<(IEnumerable<GetAllOrdersResponse> Orders, int TotalCount)> GetAllOrdersByQueryAsync(
            string? status,
            string? keyword,
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

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(o => o.OrdId.ToString().Contains(keyword) || o.Usr.Email.Contains(keyword));
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
                IsPaid = order.Order.IsPaid,
                CreatedAt = order.Order.CreatedAt,
                UpdatedAt = order.Order.UpdatedAt,
                Payment = order.Order.Payments.Select(p => new PaymentDto
                {
                    PaymentId = p.PaymentId,
                    PaymentMethod = p.PaymentMethod,
                    PaymentAmount = p.PaymentAmount,
                    OrderId = p.OrderId,
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

        public async Task<Order?> NextStatusOrderAsync(long orderId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Checking NextStatusOrderAsync for OrderID: {OrderId}", orderId);

            if (orderId <= 0)
            {
                _logger.LogWarning("Invalid Order ID: {OrderId}", orderId);
                return null;
            }

            var order = await _context.Orders
                .Include(o => o.OrdStatus)
                .FirstOrDefaultAsync(o => o.OrdId == orderId, cancellationToken);

            if (order == null)
            {
                _logger.LogWarning("Order not found: {OrderId}", orderId);
                return null;
            }

            if (!Enum.IsDefined(typeof(OrderStatusEnum), order.OrdStatusId))
            {
                _logger.LogWarning("Invalid status found for Order ID {OrderId}: {StatusId}", order.OrdId, order.OrdStatusId);
                return null;
            }

            if ((OrderStatusEnum)order.OrdStatusId == OrderStatusEnum.Completed)
            {
                _logger.LogInformation("Order {OrderId} is already completed. No status update needed.", order.OrdId);
                return null;
            }

            order.OrdStatusId = (short)(((OrderStatusEnum)order.OrdStatusId switch
            {
                OrderStatusEnum.Pending => OrderStatusEnum.Processing,
                OrderStatusEnum.Processing => OrderStatusEnum.Shipping,
                OrderStatusEnum.Shipping => OrderStatusEnum.Shipped,
                OrderStatusEnum.Shipped => OrderStatusEnum.Completed,
                _ => (OrderStatusEnum)order.OrdStatusId
            }));


            order.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

            var changes = await _context.SaveChangesAsync(cancellationToken);
            if (changes == 0)
            {
                _logger.LogWarning("No changes saved for Order ID {OrderId}", order.OrdId);
            }
            else
            {
                _logger.LogInformation("Order ID {OrderId} updated successfully to status {StatusId}.", order.OrdId, order.OrdStatusId);
            }

            return order;
        }

        public async Task<Order?> ReverseStatusOrderAsync(long orderId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Checking NextStatusOrderAsync for OrderID: {OrderId}", orderId);

            if (orderId <= 0)
            {
                _logger.LogWarning("Invalid Order ID: {OrderId}", orderId);
                return null;
            }

            var order = await _context.Orders
                .Include(o => o.OrdStatus)
                .FirstOrDefaultAsync(o => o.OrdId == orderId, cancellationToken);

            if (order == null)
            {
                _logger.LogWarning("Order not found: {OrderId}", orderId);
                return null;
            }

            if (!Enum.IsDefined(typeof(OrderStatusEnum), order.OrdStatusId))
            {
                _logger.LogWarning("Invalid status found for Order ID {OrderId}: {StatusId}", order.OrdId, order.OrdStatusId);
                return null;
            }

            if ((OrderStatusEnum)order.OrdStatusId == OrderStatusEnum.Pending)
            {
                _logger.LogInformation("Order {OrderId} is already pending. No status update needed.", order.OrdId);
                return null;
            }

            order.OrdStatusId = (short)(((OrderStatusEnum)order.OrdStatusId switch
            {
                OrderStatusEnum.Completed => OrderStatusEnum.Shipped,
                OrderStatusEnum.Shipped => OrderStatusEnum.Shipping,
                OrderStatusEnum.Shipping => OrderStatusEnum.Processing,
                OrderStatusEnum.Processing => OrderStatusEnum.Pending,
                _ => (OrderStatusEnum)order.OrdStatusId
            }));

            order.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

            var changes = await _context.SaveChangesAsync(cancellationToken);
            if (changes == 0)
            {
                _logger.LogWarning("No changes saved for Order ID {OrderId}", order.OrdId);
            }
            else
            {
                _logger.LogInformation("Order ID {OrderId} updated successfully to status {StatusId}.", order.OrdId, order.OrdStatusId);
            }

            return order;
        }

        public async Task<GetSalesSummaryDto?> GetSalesSummaryAsync(DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken)
        {
            var overviewQuery = _context.Orders
                .Where(o => o.OrdDate >= fromDate && o.OrdDate <= toDate && o.IsPaid == true)
                .Join(_context.OrderDetails,
                    o => o.OrdId,
                    od => od.OrdId,
                    (o, od) => new { o.TotalOrdPrice, o.OrdId, od.Quantity });

            var overview = await overviewQuery
                .GroupBy(_ => 1)
                .Select(g => new
                {
                    TotalRevenue = g.Sum(x => x.TotalOrdPrice),
                    TotalOrders = g.Select(x => x.OrdId).Distinct().Count(),
                    AverageOrderValue = g.Average(x => x.TotalOrdPrice),
                    TotalProductsSold = g.Sum(x => x.Quantity)
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (overview == null)
            {
                return null;
            }

            return new GetSalesSummaryDto
            {
                TotalRevenue = (decimal)overview.TotalRevenue,
                TotalOrders = overview.TotalOrders,
                AverageOrderValue = (decimal)overview.AverageOrderValue,
                TotalProductsSold = overview.TotalProductsSold,
                StartDate = fromDate.Value,
                EndDate = toDate.Value
            };
        }

        public async Task<IEnumerable<GetDailySaleDto>> GetDailySalesAsync(DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken)
        {
            var dailySales = await _context.Orders
            .Where(o => o.OrdDate >= fromDate && o.OrdDate <= toDate && o.IsPaid == true)
            .GroupJoin(_context.OrderDetails,
                    o => o.OrdId,
                    od => od.OrdId,
                    (o, odGroup) => new { o, odGroup })
            .SelectMany(x => x.odGroup.DefaultIfEmpty(),
                        (o, od) => new
                        {
                            o.o.OrdDate,
                            o.o.TotalOrdPrice,
                            o.o.OrdId,
                            Quantity = od != null ? od.Quantity : 0
                        })
            .GroupBy(x => x.OrdDate.Date)
            .Select(g => new GetDailySaleDto
            {
                Date = g.Key,
                Revenue = (decimal)g.Sum(x => x.TotalOrdPrice),
                OrderCount = g.Select(x => x.OrdId).Distinct().Count(),
                ProductsSold = g.Sum(x => x.Quantity)
            })
            .OrderBy(ds => ds.Date)
            .ToListAsync(cancellationToken);

            return dailySales;
        }

        public async Task<IEnumerable<GetTopSellingProductDto>> GetTopSellingProductsAsync(DateTime? fromDate, DateTime? toDate, CancellationToken cancellationToken)
        {
            var topSellingProducts = await _context.OrderDetails
    .GroupJoin(_context.Orders,
               od => od.OrdId,
               o => o.OrdId,
               (od, oGroup) => new { od, oGroup })
    .SelectMany(x => x.oGroup.DefaultIfEmpty(),
                (x, o) => new { x.od, o })
    .Where(x => x.o != null && x.o.OrdDate >= fromDate && x.o.OrdDate <= toDate && x.o.IsPaid == true)
    .Join(_context.Products,
          x => x.od.ProdId,
          p => p.ProductId,
          (x, p) => new { x.od, p })
    .Join(_context.ProductImages,
          x => x.p.ProductId,
          pi => pi.ProdId,
          (x, pi) => new { x.od, x.p, pi })
    .GroupBy(x => new { x.p.ProductId, x.p.ProductName, x.p.SellPrice, x.pi.ProdImageUrl })
    .Select(g => new GetTopSellingProductDto
    {
        ProductId = g.Key.ProductId,
        ProductName = g.Key.ProductName,
        ImageUrl = g.Key.ProdImageUrl,
        QuantitySold = g.Sum(x => x.od.Quantity),
        Revenue = (decimal)g.Sum(x => x.od.Quantity * x.od.SellPrice),
        UnitPrice = (decimal)g.Key.SellPrice
    })
    .OrderByDescending(p => p.QuantitySold)
    .Take(10)
    .ToListAsync(cancellationToken);
    
            return topSellingProducts;
        }
    }
    }
