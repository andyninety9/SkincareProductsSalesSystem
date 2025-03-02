using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Products.Response;
using Application.Features.SkinTypes.Queries.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.SkinTypes.Queries
{
    public sealed record GetAllSkinTypesQuery(
        string? Keyword,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetAllSkinTypesResponse>>;

    internal sealed class GetAllSkinTypesQueryHandler : IQueryHandler<GetAllSkinTypesQuery, PagedResult<GetAllSkinTypesResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllSkinTypesQueryHandler> _logger;
        private readonly ISkinTypeRepository _skinTypeRepository;

        public GetAllSkinTypesQueryHandler(
            ISkinTypeRepository skinTypeRepository,
            IMapper mapper,
            ILogger<GetAllSkinTypesQueryHandler> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _skinTypeRepository = skinTypeRepository;
        }

        public async Task<Result<PagedResult<GetAllSkinTypesResponse>>> Handle(GetAllSkinTypesQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var allSkinTypes = await _skinTypeRepository.GetAllAsync(cancellationToken);
                if (request.Keyword != null)
                {
                    allSkinTypes = allSkinTypes.Where(x => x.SkinTypeName.Contains(request.Keyword) || x.SkinTypeCodes.Contains(request.Keyword.ToUpper()));
                }

                var pagedSkinTypes = allSkinTypes
                    .Skip((request.PaginationParams.Page - 1) * request.PaginationParams.PageSize)
                    .Take(request.PaginationParams.PageSize)
                    .ToList();

                var response = new PagedResult<GetAllSkinTypesResponse>
                {
                    Items = _mapper.Map<List<GetAllSkinTypesResponse>>(pagedSkinTypes),
                };
                response.TotalItems = allSkinTypes.Count();
                response.Page = request.PaginationParams.Page;
                response.PageSize = request.PaginationParams.PageSize;

                return Result<PagedResult<GetAllSkinTypesResponse>>.Success(response);
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching skin types.");
                return Result<PagedResult<GetAllSkinTypesResponse>>.Failure<PagedResult<GetAllSkinTypesResponse>>(
                    new Error("QueryFailure", ex.Message));
            }
        }

    }
}
