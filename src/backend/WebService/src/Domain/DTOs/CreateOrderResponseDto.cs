using System;
using System.Text.Json.Serialization;

namespace Domain.DTOs
{
    public class CreateOrderResponseDto
    {
        [JsonPropertyName("data")]
        public OrderData Data { get; set; } = new OrderData();
    }

    public class OrderData
    {
        [JsonPropertyName("district_encode")]
        public string DistrictEncode { get; set; } = string.Empty;

        [JsonPropertyName("expected_delivery_time")]
        public string ExpectedDeliveryTime { get; set; } = string.Empty;

        [JsonPropertyName("fee")]
        public FeeDetails Fee { get; set; } = new FeeDetails();

        [JsonPropertyName("order_code")]
        public string OrderCode { get; set; } = string.Empty;

        [JsonPropertyName("sort_code")]
        public string SortCode { get; set; } = string.Empty;

        [JsonPropertyName("total_fee")]
        public int TotalFee { get; set; } // ✅ Sửa từ `string` → `int`

        [JsonPropertyName("trans_type")]
        public string TransType { get; set; } = string.Empty;

        [JsonPropertyName("ward_encode")]
        public string WardEncode { get; set; } = string.Empty;
    }

    public class FeeDetails
    {
        [JsonPropertyName("coupon")]
        public int Coupon { get; set; }

        [JsonPropertyName("insurance")]
        public int Insurance { get; set; }

        [JsonPropertyName("main_service")]
        public int MainService { get; set; }

        [JsonPropertyName("r2s")]
        public int R2s { get; set; }

        [JsonPropertyName("return")]
        public int Return { get; set; }

        [JsonPropertyName("station_do")]
        public int StationDo { get; set; }

        [JsonPropertyName("station_pu")]
        public int StationPu { get; set; }
    }
}
