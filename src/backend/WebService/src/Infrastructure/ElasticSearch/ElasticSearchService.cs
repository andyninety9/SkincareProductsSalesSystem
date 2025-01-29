using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstractions.ElasticSearch;
using Application.Features.Users.Response;
using Domain.Entities;
using Nest;

namespace Infrastructure.ElasticSearch
{
    public class ElasticSearchService : IElasticSearchService
    {
        private readonly IElasticClient _elasticClient;

        public ElasticSearchService(IElasticClient elasticClient)
        {
            _elasticClient = elasticClient;
        }

        public async Task<List<SearchUserResponse>> SearchUsersAsync(string keyword, int page, int pageSize)
        {
            var response = await _elasticClient.SearchAsync<SearchUserResponse>(s => s
                .Query(q => q
                    .MultiMatch(m => m
                        .Fields(f => f
                            .Field(p => p.Fullname)
                            .Field(p => p.Username)
                            .Field(p => p.Email)
                            .Field(p => p.UsrId)
                            .Field(p => p.Phone))
                        .Query(keyword)
                        .Fuzziness(Fuzziness.Auto)
                    )
                )
                .From((page - 1) * pageSize)
                .Size(pageSize)
            );

            return response.Documents.ToList();
        }
    }
}