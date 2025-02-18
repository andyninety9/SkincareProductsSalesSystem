using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetProvinceResponse
    {
        [JsonPropertyName("data")]
        public List<ProvinceDto> Value { get; set; } = new List<ProvinceDto>();
    }
    public class ProvinceDto
    {
        [JsonPropertyName("ProvinceID")]
        public int ProvinceID { get; set; }

        [JsonPropertyName("ProvinceName")]
        public string ProvinceName { get; set; } = string.Empty;

        [JsonPropertyName("Code")] 
        public string Code { get; set; } = string.Empty;
    }
}