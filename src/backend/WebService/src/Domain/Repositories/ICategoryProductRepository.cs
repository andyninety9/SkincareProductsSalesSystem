using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface ICategoryProductRepository : IRepository<CategoryProduct>
    {
        Task<CategoryProduct> GetCategoryByIdAsync(short categoryId, CancellationToken cancellationToken);
    }
}