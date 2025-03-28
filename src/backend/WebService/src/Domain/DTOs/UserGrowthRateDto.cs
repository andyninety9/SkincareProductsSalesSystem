using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class UserGrowthRateDto
    {
        public int CurrentUserCount { get; set; }
        public int PreviousUserCount { get; set; }
        public double UserGrowthRate { get; set; }
    }
}