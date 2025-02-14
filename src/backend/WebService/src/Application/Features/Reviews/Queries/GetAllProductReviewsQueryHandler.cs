using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Reviews.Queries
{
    public sealed record GetAllProductReviewQuery(
        string? Keyword,
        PaginationParams PaginationParams,
        int ProductId,
        string? FromDate,
        string? ToDate) : IQuery<PagedResult<GetAllProductReviewsResponse>>;

    internal sealed class GetAllProductReviewsQueryHandler : IQueryHandler<GetAllProductReviewQuery, PagedResult<GetAllProductReviewsResponse>>
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllProductReviewsQueryHandler> _logger;

        public GetAllProductReviewsQueryHandler(
            IReviewRepository reviewRepository,
            IMapper mapper,
            ILogger<GetAllProductReviewsQueryHandler> logger)
        {
            _reviewRepository = reviewRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetAllProductReviewsResponse>>> Handle(GetAllProductReviewQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching reviews for ProductId={ProductId}, Keyword={Keyword}, FromDate={FromDate}, ToDate={ToDate}",
                request.ProductId, request.Keyword, request.FromDate, request.ToDate);

            DateTime? fromDateTime = string.IsNullOrEmpty(request.FromDate) ? null : DateTime.Parse(request.FromDate);
            DateTime? toDateTime = string.IsNullOrEmpty(request.ToDate) ? null : DateTime.Parse(request.ToDate);

            var (reviews, totalItems) = await _reviewRepository.GetReviewsByProductIdAsync(
                request.ProductId,
                request.Keyword,
                fromDateTime,
                toDateTime,
                request.PaginationParams.Page,
                request.PaginationParams.PageSize,
                cancellationToken);

            if (!reviews.Any())
            {
                _logger.LogWarning("No reviews found for ProductId={ProductId}.", request.ProductId);
                return Result<PagedResult<GetAllProductReviewsResponse>>.Failure<PagedResult<GetAllProductReviewsResponse>>(new Error("NotFound", "No reviews found for the given product."));
            }

            var mappedReviews = _mapper.Map<List<GetAllProductReviewsResponse>>(reviews);

            var pagedResult = new PagedResult<GetAllProductReviewsResponse>
            {
                Items = mappedReviews,
                TotalItems = totalItems,
                Page = request.PaginationParams.Page,
                PageSize = request.PaginationParams.PageSize
            };

            _logger.LogInformation("Returning {ReviewCount} reviews for ProductId={ProductId}.", pagedResult.Items.Count, request.ProductId);
            return Result<PagedResult<GetAllProductReviewsResponse>>.Success(pagedResult);
        }
    }
}
