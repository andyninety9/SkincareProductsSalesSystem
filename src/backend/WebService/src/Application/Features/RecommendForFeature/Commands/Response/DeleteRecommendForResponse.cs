using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.RecommendForFeature.Commands.Response
{
    public class DeleteRecommendForResponse
    {
        public long RecForId { get; set; }
        public string Message { get; set; } = null!;
        
    }
}