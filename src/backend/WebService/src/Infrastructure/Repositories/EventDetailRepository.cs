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
    public class EventDetailRepository : Repository<EventDetail>, IEventDetailRepository
    {
        public EventDetailRepository(MyDbContext context) : base(context)
        {
        }

        public Task<bool> AddProductToEventAsync(long eventId, long productId)
        {
            bool isExisted = _context.EventDetails.Any(ed => ed.EventId == eventId && ed.ProductId == productId);
            if (isExisted)
            {
                return Task.FromResult(false);
            }
            EventDetail eventDetail = new EventDetail
            {
                EventId = eventId,
                ProductId = productId
            };
            _context.EventDetails.Add(eventDetail);
            _context.SaveChanges();
            return Task.FromResult(true);
        }

        public Task<bool> ExistsAsync(long eventId, long productId)
        {
            bool isExisted = _context.EventDetails.Any(ed => ed.EventId == eventId && ed.ProductId == productId);
            return Task.FromResult(isExisted);
        }

       
    }
}