using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class ListTopSpendingUserDto
    {
        public List<GetTopSpendingUsersDto> TopSpendingUsers { get; set; } = new List<GetTopSpendingUsersDto>();
    }
}