using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IProductRepository
    {
        Task<(IEnumerable<Product> Products, int TotalCount)> GetAllProductByQueryAsync(
            string? keyword,
            int? cateId,
            int? brandId,
            DateTime? fromDate,
            DateTime? toDate,
            int page,
            int pageSize,
            CancellationToken cancellationToken);
        Task<Product?> GetProductByIdAsync(long productId, CancellationToken cancellationToken);
    }
}
