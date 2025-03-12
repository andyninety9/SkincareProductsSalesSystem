using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Brands.Queries.Response
{
    public class GetAllProductBrandResponse
    {
        public long BrandId { get; set; }

        public string BrandName { get; set; } = null!;

        public string? BrandDesc { get; set; }

        public string BrandOrigin { get; set; } = null!;

        public bool BrandStatus { get; set; }

    }
}