using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Features.Return.Queries.Response
{
    public class GetAllReturnByManagerResonse
    {
       public List<GetAllReturnRequestByManagerDto> ReturnRequests { get; set; } = new List<GetAllReturnRequestByManagerDto>();

    }
}