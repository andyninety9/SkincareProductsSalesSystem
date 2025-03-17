using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.RecommendForFeature.Commands.Response
{
    public class CreateRecommendForResponse
    {
        public long RecForId { get; set; }

        public long ProdId { get; set; }

        public short SkinTypeId { get; set; }
    }
}