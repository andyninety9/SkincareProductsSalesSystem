using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain.DTOs;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Common;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ReviewRepository : Repository<Review>, IReviewRepository
    {
        public ReviewRepository(MyDbContext context) : base(context)
        {
        }

        public async Task<(IEnumerable<GetAllProductReviewsResponse> Reviews, int TotalCount)> GetReviewsByProductIdAsync(
     long productId,
     string? keyword,
     DateTime? fromDate,
     DateTime? toDate,
     int page,
     int pageSize,
     CancellationToken cancellationToken)
        {
            var query = from review in _context.Set<Review>()
                        join user in _context.Set<User>() on review.UsrId equals user.UsrId
                        where review.ProdId == productId
                        select new GetAllProductReviewsResponse
                        {
                            ReviewId = review.ReviewId,
                            ReviewContent = review.ReviewContent,
                            Username = user.Fullname ?? user.Email,
                            Rating = review.Rating,
                            CreatedAt = review.CreatedAt,
                            UpdatedAt = review.UpdatedAt
                        };

            // ✅ Lọc theo từ khóa (ReviewContent)
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(r => r.ReviewContent.Contains(keyword));
            }

            // ✅ Lọc theo FromDate (Ngày tạo review)
            if (fromDate.HasValue)
            {
                query = query.Where(r => r.CreatedAt >= fromDate.Value);
            }

            // ✅ Lọc theo ToDate (Ngày tạo review)
            if (toDate.HasValue)
            {
                query = query.Where(r => r.CreatedAt <= toDate.Value);
            }

            // ✅ Tổng số review sau khi áp dụng bộ lọc
            int totalItems = await query.CountAsync(cancellationToken);

            // ✅ Phân trang
            var reviews = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(cancellationToken);

            return (reviews, totalItems);
        }

    }
}
