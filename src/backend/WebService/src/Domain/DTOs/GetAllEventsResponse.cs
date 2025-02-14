using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetAllEventsResponse
    {
        public long EventId { get; set; }

        public string EventName { get; set; } = null!;

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string? EventDesc { get; set; }

        public double DiscountPercent { get; set; }

        public bool StatusEvent { get; set; }
    }
}