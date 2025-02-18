using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetWardResponse
    {
        [JsonPropertyName("data")]
        public List<WardDto> Value { get; set; } = new List<WardDto>();
    }
    public class WardDto
    {
        [JsonPropertyName("WardCode")]
        public string WardCode { get; set; } = string.Empty;

        [JsonPropertyName("DistrictID")]
        public int DistrictID { get; set; }

        [JsonPropertyName("WardName")]
        public string WardName { get; set; }=string.Empty;
    }
}