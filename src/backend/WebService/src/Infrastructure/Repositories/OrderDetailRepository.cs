using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{
    public class OrderDetailRepository : Repository<OrderDetail>, IOrderDetailRepository
    {
        private readonly ILogger<OrderDetailRepository> _logger;
        public OrderDetailRepository(MyDbContext context, ILogger<OrderDetailRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<Dictionary<long, double>> GetProductPrices(List<long> productIds, long orderId, CancellationToken cancellationToken)
        {
            // Kiểm tra danh sách sản phẩm có trống không
            if (productIds == null || !productIds.Any())
            {
                _logger.LogWarning("Product list is empty for OrderId: {OrderId}", orderId);
                return new Dictionary<long, double>();
            }

            _logger.LogInformation("Fetching product prices for OrderId: {OrderId}", orderId);

            var productPrices = await _context.OrderDetails
                .Where(od => od.OrdId == orderId && productIds.Contains(od.ProdId))
                .Select(od => new { od.ProdId, od.SellPrice }) // Chỉ lấy thông tin cần thiết
                .ToDictionaryAsync(od => od.ProdId, od => od.SellPrice, cancellationToken);

            // Log nếu không tìm thấy sản phẩm nào trong đơn hàng
            if (!productPrices.Any())
            {
                _logger.LogWarning("No matching products found in order {OrderId}", orderId);
            }

            return productPrices;
        }

        public async Task<bool> OrderExists(long orderId, CancellationToken cancellationToken)
        {
            return await _context.Orders
                .AnyAsync(o => o.OrdId == orderId, cancellationToken);
        }

    }
}