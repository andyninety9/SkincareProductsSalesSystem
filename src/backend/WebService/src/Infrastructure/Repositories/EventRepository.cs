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
    public class EventRepository : Repository<Event>, IEventRepository
    {
        public EventRepository(MyDbContext context) : base(context)
        {
        }

        public async Task<List<Event>> GetEventsAsync(string? keyword, bool? status, DateTime? fromDate, DateTime? toDate, int page, int limit)
        {
            var query = _context.Events.AsQueryable();

            // ✅ Lọc theo từ khóa (Keyword)
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(e => e.EventName.Contains(keyword) || e.EventDesc.Contains(keyword));
            }

            // ✅ Lọc theo trạng thái sự kiện (Status)
            if (status.HasValue)
            {
                query = query.Where(e => e.StatusEvent == status.Value);
            }

            // ✅ Lọc theo ngày bắt đầu (FromDate) và ngày kết thúc (ToDate)
            if (fromDate.HasValue)
            {
                query = query.Where(e => e.StartTime >= fromDate.Value);
            }
            if (toDate.HasValue)
            {
                query = query.Where(e => e.EndTime <= toDate.Value);
            }

            // ✅ Sắp xếp theo `CreatedAt` giảm dần
            query = query.OrderByDescending(e => e.StartTime);

            // ✅ Phân trang
            return await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<int> CountEventsAsync(string? keyword, bool? status, DateTime? fromDate, DateTime? toDate)
        {
            var query = _context.Events.AsQueryable();

            // ✅ Lọc theo từ khóa (Keyword)
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(e => e.EventName.Contains(keyword) || e.EventDesc.Contains(keyword));
            }

            // ✅ Lọc theo trạng thái sự kiện (Status)
            if (status.HasValue)
            {
                query = query.Where(e => e.StatusEvent == status.Value);
            }

            // ✅ Lọc theo ngày bắt đầu (FromDate) và ngày kết thúc (ToDate)
            if (fromDate.HasValue)
            {
                query = query.Where(e => e.StartTime >= fromDate.Value);
            }
            if (toDate.HasValue)
            {
                query = query.Where(e => e.EndTime <= toDate.Value);
            }

            return await query.CountAsync();
        }

    }
}