using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ProductImageRepository : Repository<ProductImage>, IProductImageRepository
    {
        public ProductImageRepository(MyDbContext context) : base(context)
        {
        }

        public Task<ProductImage?> GetByProductAndImageIdAsync(long productId, long imageId, CancellationToken cancellationToken)
        {
            return _context.ProductImages
                .Where(x => x.ProdId == productId && x.ProdImageId == imageId)
                .FirstOrDefaultAsync(cancellationToken);
            
        }

        public async Task<IEnumerable<ProductImage>> GetImagesByProductIdAsync(long productId, CancellationToken cancellationToken)
        {
            return await _context.ProductImages
                .Where(x => x.ProdId == productId)
                .ToListAsync(cancellationToken);
        }
    }
}