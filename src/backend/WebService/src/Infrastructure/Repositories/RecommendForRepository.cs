using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;

namespace Infrastructure.Repositories
{
    public class RecommendForRepository : Repository<RecommendFor>, IRecommendForRepository
    {
        public RecommendForRepository(MyDbContext context) : base(context)
        {
        }

        public Task<IEnumerable<RecommendFor>> GetRecommendForByProductIdAsync(long productId, CancellationToken cancellationToken)
        {
            try
            {
                return Task.FromResult(_context.RecommendFors.Where(x => x.ProdId == productId).AsEnumerable());
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}