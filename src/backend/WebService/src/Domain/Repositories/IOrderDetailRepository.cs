using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IOrderDetailRepository : IRepository<OrderDetail>
    {
        Task<Dictionary<long, double>> GetProductPrices(List<long> productIds, long orderId, CancellationToken cancellationToken);
        Task<bool> OrderExists(long orderId, CancellationToken cancellationToken);
    }
}