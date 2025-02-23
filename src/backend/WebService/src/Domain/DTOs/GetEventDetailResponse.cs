using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.DTOs
{
    public class GetEventDetailResponse
    {
        public long EventId { get; set; }
        public required string EventName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public required string EventDesc { get; set; }
        public float DiscountPercent { get; set; }
        public bool StatusEvent { get; set; }
        public List<ProductDTO> EventDetails { get; set; } = new();

    }
}