using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetTopSpendingUsersDto
    {
        public long UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int OrderCount { get; set; }
        public double TotalSpent { get; set; }
        public double AvgOrderValue { get; set; }
    }
}