using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Address.Queries.Response
{
    public class GetAllUserAddressResponse
    {
        public long AddressId { get; set; }

        public long UsrId { get; set; }

        public string AddDetail { get; set; } = null!;

        public string Ward { get; set; } = null!;

        public string District { get; set; } = null!;

        public string City { get; set; } = null!;

        public string Country { get; set; } = null!;

        public bool IsDefault { get; set; }

        public bool Status { get; set; }
    }
}