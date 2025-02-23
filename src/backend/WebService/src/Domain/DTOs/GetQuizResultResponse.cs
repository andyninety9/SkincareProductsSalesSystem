using System;
using System.Collections.Generic;

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

        /// <summary>
        /// List of Cleansers (Step 1)
        /// </summary>
        public List<ProductDTO> Cleansers { get; set; } = new();

        /// <summary>
        /// List of Toners (Step 2)
        /// </summary>
        public List<ProductDTO> Toners { get; set; } = new();

        /// <summary>
        /// List of Moisturizers (Step 3)
        /// </summary>
        public List<ProductDTO> Moisturizers { get; set; } = new();

        public bool IsDefault { get; set; }

        public DateTime CreateAt { get; set; }

        // ✅ Trả về danh sách trống nếu dữ liệu bị null
        public GetQuizResultResponse()
        {
            Cleansers ??= new List<ProductDTO>();
            Toners ??= new List<ProductDTO>();
            Moisturizers ??= new List<ProductDTO>();
        }
    }
}
