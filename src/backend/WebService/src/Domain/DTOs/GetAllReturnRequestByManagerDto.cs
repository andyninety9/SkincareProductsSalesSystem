using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetAllReturnRequestByManagerDto
    {
        public long ReturnId { get; set; }

        public long OrdIdd { get; set; }

        public UserDto User { get; set; } = new UserDto();

        public DateOnly ReturnDate { get; set; }

        public double RefundAmount { get; set; }

        public List<ReturnProductDetailDto> ReturnProducts { get; set; } = new List<ReturnProductDetailDto>();

        public bool ReturnStatus { get; set; }
    }
}