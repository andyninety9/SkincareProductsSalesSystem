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
    public sealed record GetAllUsersQuery(PaginationParams PaginationParams)
        : IQuery<PagedResult<GetAllUsersResponse>>;

    internal sealed class GetAllUsersQueryHandler : IQueryHandler<GetAllUsersQuery, PagedResult<GetAllUsersResponse>>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetAllUsersQueryHandler(IUserRepository userRepository, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {

            _userRepository = userRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Result<PagedResult<GetAllUsersResponse>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var currentUserRoleId = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("roleId")?.Value ?? "0");

            var query = _userRepository.GetAllUsers();

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
