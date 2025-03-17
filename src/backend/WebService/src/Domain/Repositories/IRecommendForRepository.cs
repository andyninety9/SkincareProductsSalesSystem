using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IRecommendForRepository : IRepository<RecommendFor>
    {
        Task<IEnumerable<RecommendFor>> GetRecommendForByProductIdAsync(long productId, CancellationToken cancellationToken);

        Task<bool> IsExistAsync(RecommendFor recommendFor, CancellationToken cancellationToken);
        
    }
}