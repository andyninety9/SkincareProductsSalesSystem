using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Brands.Queries.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Brands.Queries
{
    public sealed record GetAllProductBrandQuery(
        string? Keyword,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetAllProductBrandResponse>>;

    internal sealed class GetAllBrandQueryHandler : IQueryHandler<GetAllProductBrandQuery, PagedResult<GetAllProductBrandResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllBrandQueryHandler> _logger;
        private readonly IBrandRepository _brandRepository;

        public GetAllBrandQueryHandler(
            IBrandRepository brandRepository,
            IMapper mapper,
            ILogger<GetAllBrandQueryHandler> logger)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetAllProductBrandResponse>>> Handle(GetAllProductBrandQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = await _brandRepository.GetAllAsync(cancellationToken);

                if (!string.IsNullOrWhiteSpace(request.Keyword))
                {
                    query = query.Where(x => x.BrandName.Contains(request.Keyword));
                }

                var totalItems = query.Count();

                var items = query
                    .Skip((request.PaginationParams.Page - 1) * request.PaginationParams.PageSize)
                    .Take(request.PaginationParams.PageSize)
                    .ToList();
                

                List<GetAllProductBrandResponse> listBrand = new List<GetAllProductBrandResponse>();
                foreach (var item in items)
                {
                    GetAllProductBrandResponse brand = _mapper.Map<GetAllProductBrandResponse>(item);
                    listBrand.Add(brand);
                }
                var result = new PagedResult<GetAllProductBrandResponse>
                {
                    Items = listBrand,
                    TotalItems = totalItems,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                };

                return Result<PagedResult<GetAllProductBrandResponse>>.Success(result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while fetching all brands");
                return Result.Failure<PagedResult<GetAllProductBrandResponse>>(new Error("Error", e.Message));
            }
           
        }

    }
}
