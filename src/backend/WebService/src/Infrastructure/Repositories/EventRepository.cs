using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;
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
                query = query.Where(e => e.EventName.Contains(keyword) || (e.EventDesc != null && e.EventDesc.Contains(keyword)));
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

        public async Task<GetEventDetailResponse> GetEventDetailByIdAsync(long eventId)
        {

            var query = _context.Events
                .Include(e => e.EventDetails)
                .Where(e => e.EventId == eventId)
                .Select(e => new GetEventDetailResponse
                {
                    EventId = e.EventId,
                    EventName = e.EventName,
                    StartTime = e.StartTime,
                    EndTime = e.EndTime,
                    EventDesc = e.EventDesc ?? string.Empty,
                    DiscountPercent = (float)e.DiscountPercent,
                    StatusEvent = e.StatusEvent,
                    EventDetails = e.EventDetails.Select(ed => new ProductDTO
                    {
                        ProductId = ed.Product.ProductId,
                        ProductName = ed.Product.ProductName,
                        CateId = ed.Product.CateId,
                        BrandId = ed.Product.BrandId,
                        Stocks = ed.Product.Stocks,
                        CostPrice = ed.Product.CostPrice,
                        SellPrice = ed.Product.SellPrice,
                        TotalRating = ed.Product.TotalRating,
                        Ingredient = ed.Product.Ingredient,
                        Instruction = ed.Product.Instruction,
                        ProdStatusId = ed.Product.ProdStatusId, 
                        CreatedAt = ed.Product.CreatedAt,
                        ProductDesc = ed.Product.ProductDesc ?? string.Empty,
                    }).ToList()
                });

            var result = await query.FirstOrDefaultAsync();
            return result ?? throw new KeyNotFoundException($"Event with ID {eventId} was not found.");
            
        }
    }
}