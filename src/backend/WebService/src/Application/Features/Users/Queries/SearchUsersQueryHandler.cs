using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.ElasticSearch;
using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Users.Response;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace Application.Users.Queries
{
    public sealed record SearchUsersQuery(string Keyword, PaginationParams PaginationParams)
        : IQuery<PagedResult<SearchUserResponse>>;

    internal sealed class SearchUsersQueryHandler : IQueryHandler<SearchUsersQuery, PagedResult<SearchUserResponse>>
    {
        private readonly IElasticSearchService _elasticSearchService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SearchUsersQueryHandler(IElasticSearchService elasticSearchService, IHttpContextAccessor httpContextAccessor)
        {
            _elasticSearchService = elasticSearchService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Result<PagedResult<SearchUserResponse>>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
        {
            var currentUserRoleId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("roleId")?.Value ?? "0");

            // Gọi Elasticsearch để tìm kiếm user
            var users = await _elasticSearchService.SearchUsersAsync(request.Keyword, request.PaginationParams.Page, request.PaginationParams.PageSize);

            // Trả về kết quả phân trang
            var pagedResult = new PagedResult<SearchUserResponse>
            {
                Items = users,
                TotalItems = users.Count,
                Page = request.PaginationParams.Page,
                PageSize = request.PaginationParams.PageSize
            };

            return Result<PagedResult<SearchUserResponse>>.Success(pagedResult);
        }
    }
}
