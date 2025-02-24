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
    public class CategoryProductRepository : Repository<CategoryProduct>, ICategoryProductRepository
    {
        public CategoryProductRepository(MyDbContext context) : base(context)
        {
        }

        public Task<CategoryProduct> GetCategoryByIdAsync(short categoryId, CancellationToken cancellationToken)
        {
            return _context.CategoryProducts.FirstAsync(x => x.CateProdId == categoryId, cancellationToken);
            
        }
    }
}