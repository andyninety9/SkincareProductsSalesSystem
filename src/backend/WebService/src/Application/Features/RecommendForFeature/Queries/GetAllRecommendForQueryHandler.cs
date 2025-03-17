using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Queries.Response;
using Application.Features.RecommendForFeature.Queries.Responses;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.ProductCategory.Queries
{
    public sealed record GetProductRecommendationQuery(
        long ProductId,
        PaginationParams PaginationParams
        ) : IQuery<PagedResult<GetProductRecommendationResponse>>;

    internal sealed class GetAllRecommendForQueryHandler : IQueryHandler<GetProductRecommendationQuery, PagedResult<GetProductRecommendationResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILogger<GetAllRecommendForQueryHandler> _logger;
        private readonly IRecommendForRepository _recommendForRepository;
        private readonly ISkinTypeRepository _skinTypeRepository;

        public GetAllRecommendForQueryHandler(
            IRecommendForRepository recommendForRepository,
            ISkinTypeRepository skinTypeRepository,
            IMapper mapper,
            ILogger<GetAllRecommendForQueryHandler> logger)
        {
            _skinTypeRepository = skinTypeRepository;
            _recommendForRepository = recommendForRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<PagedResult<GetProductRecommendationResponse>>> Handle(GetProductRecommendationQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var recommendFors = await _recommendForRepository.GetRecommendForByProductIdAsync(request.ProductId, cancellationToken);
                var skinTypes = await _skinTypeRepository.GetAllAsync(cancellationToken);

                List<GetProductRecommendationResponse> response = new();
                foreach (var recommendFor in recommendFors)
                {
                    var skinType = skinTypes.FirstOrDefault(x => x.SkinTypeId == recommendFor.SkinTypeId);
                    if (skinType == null)
                    {
                        continue;
                    }

                    response.Add(new GetProductRecommendationResponse
                    {
                        RecForId = recommendFor.RecForId,
                        ProdId = recommendFor.ProdId,
                        SkinTypeId = recommendFor.SkinTypeId,
                        SkinTypeName = skinType.SkinTypeName,
                        SkinTypeCodes = skinType.SkinTypeCodes

                    });
                }

                var result = new PagedResult<GetProductRecommendationResponse>
                {
                    Items = response,
                    TotalItems = response.Count,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                };
                
                return Result.Success(result);

            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return Result.Failure<PagedResult<GetProductRecommendationResponse>>(new Error("Error", e.Message));
            }
        }

    }
}
