using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class UserDto
    {
        public long UsrId { get; set; }

        public string? Fullname { get; set; }

        public short? Gender { get; set; }

        public string? Phone { get; set; }

        public string Email { get; set; } = null!;
    }
}