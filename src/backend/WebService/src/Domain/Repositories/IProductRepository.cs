using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<(IEnumerable<Product> Products, int TotalCount)> GetAllProductByQueryAsync(
            string? keyword,
            long? cateId,
            long? brandId,
            long? skinTypeId,
            DateTime? fromDate,
            DateTime? toDate,
            int page,
            int pageSize,
            CancellationToken cancellationToken);
        Task<Product?> GetProductByIdAsync(long productId, CancellationToken cancellationToken);
        Task<IEnumerable<Product>> GetProductByListIdAsync(List<long> listProductId, CancellationToken cancellationToken);
        Task<bool> UpdateRatingProductAsync(long productId, double rating, CancellationToken cancellationToken);
    }
}
