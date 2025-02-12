using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Common;
using Domain.DTOs;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IReviewRepository:IRepository<Review>
    {
        Task<(IEnumerable<GetAllProductReviewsResponse> Reviews, int TotalCount)> GetReviewsByProductIdAsync(
         long productId,
         string? keyword,
         DateTime? fromDate,
         DateTime? toDate,
         int page,
         int pageSize,
         CancellationToken cancellationToken);
    }
}