using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.RecommendForFeature.Queries.Responses
{
    public class GetProductRecommendationResponse
    {
        public long RecForId { get; set; }

        public long ProdId { get; set; }

        public short SkinTypeId { get; set; }
        public string SkinTypeName { get; set; } = null!;
        public string SkinTypeCodes { get; set; } = null!;

    }
}