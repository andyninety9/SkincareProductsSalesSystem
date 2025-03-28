using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Features.ReportsService.Queries.Response
{
    public class GetUserByAgeGroupResponse
    {
        public UserByAgeGroupDto UserByAgeGroup { get; set; } = new UserByAgeGroupDto();
    }
}