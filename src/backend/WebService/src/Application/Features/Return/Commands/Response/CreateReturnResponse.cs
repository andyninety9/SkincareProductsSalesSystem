using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Features.Return.Commands.Response
{
    public class CreateReturnResponse
    {
        public long ReturnId { get; set; }
        public long OrdId { get; set; }
        public long UserId { get; set; }
        public List<ReturnProductDto> ReturnProducts { get; set; } = new List<ReturnProductDto>();
        public double TotalRefund { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}