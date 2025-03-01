using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Features.Return.Queries.Response
{
    public class GetAllReturnByCustomerResponse
    {
        public long ReturnId { get; set; }
        public long OrderId { get; set; }
        public DateOnly ReturnDate { get; set; }
        public string ReturnReason { get; set; } = string.Empty;
        public int TotalItems { get; set; }
        public double RefundAmount { get; set; }
        public bool ReturnStatus { get; set; }
        public List<ReturnProductDetailDto> ReturnProductDetails { get; set; } = new List<ReturnProductDetailDto>();



    }
}