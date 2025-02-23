using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
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
        public string? AccountStatus { get; set; } = null;
        public string? Role { get; set; } = null;
        public string? SkinType { get; set; } = null;
        public short? RewardPoint { get; set; } = null;
        public DateTime? CreatedAt { get; set; } = null;
        public DateTime? UpdatedAt { get; set; } = null;

    }
}