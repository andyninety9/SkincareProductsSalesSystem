using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetQuizResultResponse
    {
        public long ResultId { get; set; }

        public long QuizId { get; set; }

        public long UsrId { get; set; }

        public ResultScoreDto ResultScore { get; set; } = new();

        public string SkinTypeCode { get; set; } = string.Empty;

        public string SkinTypeName { get; set; } = string.Empty;

        public string SkinTypeDesc { get; set; } = string.Empty;

        public string TreatmentSolution { get; set; } = string.Empty;
        public List<ProductDTO> RecommendedProducts { get; set; } = new();
        public bool IsDefault { get; set; }

        public DateTime CreateAt { get; set; }


    }
}