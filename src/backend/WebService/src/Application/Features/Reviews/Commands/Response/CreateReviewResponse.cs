using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Reviews.Commands.Response
{
    public class CreateReviewResponse
    {
        public long ReviewId { get; set; }

        public string ReviewContent { get; set; } = null!;

        public long UsrId { get; set; }

        public long ProdId { get; set; }

        public double Rating { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

    }
}