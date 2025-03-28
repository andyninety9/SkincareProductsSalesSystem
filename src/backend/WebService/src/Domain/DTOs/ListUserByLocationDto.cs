using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ListUserByLocationDto
    {
        public List<UserLocationDto> UserByLocation { get; set; } = new List<UserLocationDto>();
    }
}