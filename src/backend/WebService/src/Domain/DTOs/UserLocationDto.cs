using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class UserLocationDto
    {
        public string Location { get; set; } = string.Empty;
        public int UserCount { get; set; }
    }
}