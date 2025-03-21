using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IProductImageRepository : IRepository<ProductImage>
    {
        Task<ProductImage?> GetByProductAndImageIdAsync(long productId, long imageId, CancellationToken cancellationToken);
        Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(long productId, CancellationToken cancellationToken);
    }
}