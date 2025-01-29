using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using Application.Features.Users.Response;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Users.Queries
{
    public sealed record SearchUsersQuery(
        string Keyword,
        PaginationParams PaginationParams,
        string Gender,
        int? Status,
        int? Role,
        string FromDate,
        string ToDate) : IQuery<PagedResult<GetAllUsersResponse>>;

    internal sealed class SearchUsersQueryHandler : IQueryHandler<SearchUsersQuery, PagedResult<GetAllUsersResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SearchUsersQueryHandler(IUserRepository userRepository, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {

            _userRepository = userRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Result<PagedResult<GetAllUsersResponse>>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
        {
            var currentUserRoleId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("roleId")?.Value ?? "0");

            var query = _userRepository.SearchUsers(request.Keyword);

            if (!string.IsNullOrEmpty(request.Gender))
            {
                query = query.Where(u => u.Gender == short.Parse(request.Gender));
            }

            if (request.Status.HasValue)
            {
                query = query.Where(u => u.Usr.AccStatusId == request.Status.Value);
            }

            if (request.Role.HasValue)
            {
                query = query.Where(u => u.Usr.Role.RoleId == request.Role.Value);
            }

            if (!string.IsNullOrEmpty(request.FromDate))
            {
                var fromDate = DateOnly.Parse(request.FromDate);
                query = query.Where(u => u.Dob >= fromDate);
            }

            if (!string.IsNullOrEmpty(request.ToDate))
            {
                var toDate = DateOnly.Parse(request.ToDate);
                query = query.Where(u => u.Dob <= toDate);
            }

            if (currentUserRoleId == 2)
            {
                query = query.Where(user => user.Usr.Role.RoleId == 3);
            }

            var totalItems = await query.CountAsync(cancellationToken);

            var items = await query
            .Skip(request.PaginationParams.GetSkipCount())
            .Take(request.PaginationParams.PageSize)
            .ProjectTo<GetAllUsersResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

            var pagedResult = new PagedResult<GetAllUsersResponse>
            {
                Items = items,
                TotalItems = totalItems,
                Page = request.PaginationParams.Page,
                PageSize = request.PaginationParams.PageSize
            };

            return Result<PagedResult<GetAllUsersResponse>>.Success(pagedResult);
        }
    }
}
