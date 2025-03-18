using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Products.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Products.Queries
{
    public sealed record GetTopSellingProductsQuery(
        string? Keyword,
        PaginationParams PaginationParams,
        long? CateId,
        long? BrandId,
        long? SkinTypeId,
        string? FromDate,
        string? ToDate) : IQuery<PagedResult<GetAllProductsResponse>>;

    internal sealed class GetTopSellingProductQueryHandler : IQueryHandler<GetAllProductsQuery, PagedResult<GetAllProductsResponse>>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<GetTopSellingProductQueryHandler> _logger;

        public GetTopSellingProductQueryHandler(
            IProductRepository productRepository,
            IMapper mapper,
            ILogger<GetTopSellingProductQueryHandler> logger)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetAllProductsResponse>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Fetching products with filters: Keyword={Keyword}, CateId={CateId}, BrandId={BrandId}, FromDate={FromDate}, ToDate={ToDate}",
                    request.Keyword, request.CateId, request.BrandId, request.FromDate, request.ToDate);

                DateTime? fromDateTime = null;
                DateTime? toDateTime = null;

                if (!string.IsNullOrEmpty(request.FromDate) && DateTime.TryParse(request.FromDate, out var parsedFromDate))
                {
                    fromDateTime = parsedFromDate;
                    _logger.LogInformation("Parsed FromDate: {FromDate}", fromDateTime);
                }

                if (!string.IsNullOrEmpty(request.ToDate) && DateTime.TryParse(request.ToDate, out var parsedToDate))
                {
                    toDateTime = parsedToDate;
                    _logger.LogInformation("Parsed ToDate: {ToDate}", toDateTime);
                }

                var (products, totalItems) = await _productRepository.GetAllProductByQueryAsync(
                    request.Keyword, request.CateId, request.BrandId, request.SkinTypeId, fromDateTime, toDateTime,
                    request.PaginationParams.Page, request.PaginationParams.PageSize, cancellationToken);

                // Sort products by total sold in descending order
                products = products.OrderByDescending(p => p.Totalsold).ToList();

                _logger.LogInformation("Products sorted by total sold in descending order");

                if (!products.Any())
                {
                    _logger.LogWarning("No products found for given filters.");
                    return Result<PagedResult<GetAllProductsResponse>>.Failure<PagedResult<GetAllProductsResponse>>(
                        new Error("NotFound", "No products found for the given criteria."));
                }

                var mappedProducts = _mapper.Map<List<GetAllProductsResponse>>(products);

                var pagedResult = new PagedResult<GetAllProductsResponse>
                {
                    Items = mappedProducts,
                    TotalItems = totalItems,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                };

                _logger.LogInformation("Returning {ProductCount} products for page {Page}.", pagedResult.Items.Count, request.PaginationParams.Page);
                return Result<PagedResult<GetAllProductsResponse>>.Success(pagedResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching products.");
                return Result<PagedResult<GetAllProductsResponse>>.Failure<PagedResult<GetAllProductsResponse>>(
                    new Error("QueryFailure", ex.Message));
            }
        }

    }
}
