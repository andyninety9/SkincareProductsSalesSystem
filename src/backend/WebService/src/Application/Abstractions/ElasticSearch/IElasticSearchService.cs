using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Features.Users.Response;
using Domain.Entities;

namespace Application.Abstractions.ElasticSearch
{
    public interface IElasticSearchService
    {
        Task<List<SearchUserResponse>> SearchUsersAsync(string keyword, int page, int pageSize);
    }
}