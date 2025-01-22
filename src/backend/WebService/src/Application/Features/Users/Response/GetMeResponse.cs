using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Users.Response
{
    public sealed record GetMeResponse
    {
        public string Fullname { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateOnly? Dob { get; set; } = null;
        public string? AvatarUrl { get; set; } = null;
        public string? CoverUrl { get; set; } = null;
        public short? RewardPoint { get; set; } = null;
        public DateTime? CreatedAt { get; set; } = null;
        public DateTime? UpdatedAt { get; set; } = null;

    }
}