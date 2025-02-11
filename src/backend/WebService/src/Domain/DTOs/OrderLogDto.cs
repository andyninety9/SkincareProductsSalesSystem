using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class OrderLogDto
    {
        public long OrderLogId { get; set; }
        public short NewStatusOrderId { get; set; }
        public string NewStatusOrderName { get; set; } = string.Empty;
        public long UserId { get; set; }
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}