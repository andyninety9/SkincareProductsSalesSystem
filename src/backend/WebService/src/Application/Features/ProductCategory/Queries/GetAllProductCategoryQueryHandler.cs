using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Queries.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.ProductCategory.Queries
{
    public sealed record GetAllProductCategoryQuery(
        string? Keyword,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetAllProductCategoryResponse>>;

    internal sealed class GetAllProductCategoryQueryHandler : IQueryHandler<GetAllProductCategoryQuery, PagedResult<GetAllProductCategoryResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllProductCategoryQueryHandler> _logger;
        private readonly ICategoryProductRepository _categoryProductRepository;

        public GetAllProductCategoryQueryHandler(
            ICategoryProductRepository categoryProductRepository,
            IMapper mapper,
            ILogger<GetAllProductCategoryQueryHandler> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _categoryProductRepository = categoryProductRepository;
        }

        public async Task<Result<PagedResult<GetAllProductCategoryResponse>>> Handle(GetAllProductCategoryQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = await _categoryProductRepository.GetAllAsync(cancellationToken);

                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    query = query.Where(x => x.CateProdName.Contains(request.Keyword));
                }

                var totalItems = query.Count();

                var items = query
                    .Skip((request.PaginationParams.Page - 1) * request.PaginationParams.PageSize)
                    .Take(request.PaginationParams.PageSize)
                    .ToList();

                var result = new PagedResult<GetAllProductCategoryResponse>
                {
                    Items = _mapper.Map<List<GetAllProductCategoryResponse>>(items),
                    TotalItems = totalItems,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                };

                return Result.Success(result);
                
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return Result.Failure<PagedResult<GetAllProductCategoryResponse>>(new Error("Error", e.Message));
            }
        }

    }
}
