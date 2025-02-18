using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetDistrictResponse
    {
        [JsonPropertyName("data")]
        public List<DistrictDto> Value { get; set; } = new List<DistrictDto>();
    }
    public class DistrictDto
    {
        [JsonPropertyName("DistrictID")]
        public int DistrictId { get; set; }

        [JsonPropertyName("ProvinceID")]
        public int ProvinceId { get; set; }

        [JsonPropertyName("DistrictName")]
        public string DistrictName { get; set; } = string.Empty;

        [JsonPropertyName("Code")]
        public string Code { get; set; } = string.Empty;

        [JsonPropertyName("Type")]
        public int Type { get; set; }

        [JsonPropertyName("SupportType")]
        public int SupportType { get; set; }
    }
}