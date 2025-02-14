using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IEventRepository : IRepository<Event>
    {
        Task<List<Event>> GetEventsAsync(string? keyword, bool? status, DateTime? fromDate, DateTime? toDate, int page, int limit);
        Task<int> CountEventsAsync(string? keyword, bool? status, DateTime? fromDate, DateTime? toDate);
    }
}