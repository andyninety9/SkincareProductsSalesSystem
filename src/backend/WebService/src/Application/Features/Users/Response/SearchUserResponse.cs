using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Users.Response
{
    public class SearchUserResponse
    {
        public long UsrId { get; set; }
        public short RoleId { get; set; }
        public short StatusId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Fullname { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime? Dob { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public string CoverUrl { get; set; } = string.Empty;
        public string RewardRank { get; set; } = string.Empty;
    }
}