using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.ReportsService.Queries.Response
{
    public class GetUserSummaryResponse
    {
        public int TotalUser { get; set; }
        public int NewUsers { get; set; }
        public int ActiveUsers { get; set; }
        public double UserGrowthRate { get; set; }
    }
}