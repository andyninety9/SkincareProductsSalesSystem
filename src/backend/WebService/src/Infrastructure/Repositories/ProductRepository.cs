using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {

        private readonly ILogger<ProductRepository> _logger;

        public ProductRepository(MyDbContext context, ILogger<ProductRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<(IEnumerable<Product> Products, int TotalCount)> GetAllProductByQueryAsync(
            string? keyword,
            long? cateId,
            long? brandId,
            long? skinTypeId,
            DateTime? fromDate,
            DateTime? toDate,
            int page,
            int pageSize,
            CancellationToken cancellationToken)
        {
            var query = _context.Set<Product>()
                .Include(p => p.Brand)
                .Include(p => p.Cate)
                .Include(p => p.ProdStatus)
                .Include(p => p.ProductImages)
                .Include(p => p.Reviews)
                .Include(p => p.RecommendFors)
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(p => p.ProductName.Contains(keyword));
            }

            if (cateId.HasValue)
            {
                query = query.Where(p => p.Cate.CateProdId == cateId.Value);
            }

            if (brandId.HasValue)
            {
                query = query.Where(p => p.Brand.BrandId == brandId.Value);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(p => p.CreatedAt >= fromDate.Value);
            }

            if (toDate.HasValue)
            {
                query = query.Where(p => p.CreatedAt <= toDate.Value);
            }

            if (skinTypeId.HasValue)
            {
                query = query.Where(p => p.RecommendFors.Any(r => r.SkinTypeId == skinTypeId.Value));
            }

            int totalItems = await query.CountAsync(cancellationToken);
            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (products, totalItems);
        }

        public async Task<Product?> GetProductByIdAsync(long productId, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching product with ID: {ProductId}", productId);

            return await _context.Set<Product>()
                .Include(p => p.Brand)
                .Include(p => p.Cate)
                .Include(p => p.ProdStatus)
                .Include(p => p.ProductImages)
                .Include(p => p.Reviews)
                .FirstOrDefaultAsync(p => p.ProductId == productId, cancellationToken);
        }

        public async Task<IEnumerable<Product>> GetProductByListIdAsync(List<long> listProductId, CancellationToken cancellationToken)
        {
            return await _context.Set<Product>()
                .Include(p => p.Brand)
                .Include(p => p.Cate)
                .Include(p => p.ProdStatus)
                .Include(p => p.ProductImages)
                .Include(p => p.Reviews)
                .Where(p => listProductId.Contains(p.ProductId))
                .ToListAsync(cancellationToken);
        }
    }
}
