using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetAllProductReviewsResponse
    {
        public long ReviewId { get; set; }
        public string ReviewContent { get; set; } = null!;
        public string Username { get; set; } = null!; // ✅ Lấy từ bảng User
        public double Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}