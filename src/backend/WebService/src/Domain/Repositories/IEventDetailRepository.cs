using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IEventDetailRepository : IRepository<EventDetail>
    {
        Task<bool> AddProductToEventAsync(long eventId, long productId);
        Task<bool> ExistsAsync(long eventId, long productId);


    }
}