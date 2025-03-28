using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetUserRetentionRateDto
    {
        public double After1Month { get; set; }
        public double After3Month { get; set; }
        public double After6Month { get; set; }
        public double After12Month { get; set; }
    }
}