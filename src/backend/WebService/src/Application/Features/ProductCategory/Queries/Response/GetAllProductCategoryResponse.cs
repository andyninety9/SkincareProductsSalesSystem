using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.ProductCategory.Queries.Response
{
    public class GetAllProductCategoryResponse
    {
        public short CateProdId { get; set; }

        public string CateProdName { get; set; } = null!;

        public bool CateProdStatus { get; set; }

    }
}