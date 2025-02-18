using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class CreateOrderDeliRequestDto
    {
        [JsonPropertyName("payment_type_id")]
        public int PaymentTypeId { get; set; }

        [JsonPropertyName("note")]
        public string Note { get; set; } = string.Empty;

        [JsonPropertyName("required_note")]
        public string RequiredNote { get; set; } = string.Empty;

        [JsonPropertyName("from_name")]
        public string FromName { get; set; } = string.Empty;

        [JsonPropertyName("from_phone")]
        public string FromPhone { get; set; } = string.Empty;

        [JsonPropertyName("from_address")]
        public string FromAddress { get; set; } = string.Empty;

        [JsonPropertyName("from_ward_name")]
        public string FromWardName { get; set; } = string.Empty;

        [JsonPropertyName("from_district_name")]
        public string FromDistrictName { get; set; } = string.Empty;

        [JsonPropertyName("from_province_name")]
        public string FromProvinceName { get; set; } = string.Empty;

        [JsonPropertyName("return_phone")]
        public string ReturnPhone { get; set; } = string.Empty;

        [JsonPropertyName("return_address")]
        public string ReturnAddress { get; set; } = string.Empty;

        [JsonPropertyName("return_district_id")]
        public int? ReturnDistrictId { get; set; } 

        [JsonPropertyName("return_ward_code")]
        public string ReturnWardCode { get; set; } = string.Empty;

        [JsonPropertyName("client_order_code")]
        public string ClientOrderCode { get; set; } = string.Empty;

        [JsonPropertyName("to_name")]
        public string ToName { get; set; } = string.Empty;

        [JsonPropertyName("to_phone")]
        public string ToPhone { get; set; } = string.Empty;

        [JsonPropertyName("to_address")]
        public string ToAddress { get; set; } = string.Empty;

        [JsonPropertyName("to_ward_name")]
        public string ToWardName{ get; set; } = string.Empty;

        [JsonPropertyName("to_district_name")]
        public string ToDistrictName { get; set; }= string.Empty;

        [JsonPropertyName("to_province_name")]
        public string ToProvinceName { get; set; }= string.Empty;

        [JsonPropertyName("cod_amount")]
        public int CodAmount { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; } = string.Empty;

        [JsonPropertyName("weight")]
        public int Weight { get; set; }

        [JsonPropertyName("length")]
        public int Length { get; set; }

        [JsonPropertyName("width")]
        public int Width { get; set; }

        [JsonPropertyName("height")]
        public int Height { get; set; }

        [JsonPropertyName("pick_station_id")]
        public int? PickStationId { get; set; }

        [JsonPropertyName("deliver_station_id")]
        public int? DeliverStationId { get; set; }

        [JsonPropertyName("insurance_value")]
        public int InsuranceValue { get; set; }

        [JsonPropertyName("service_id")]
        public int ServiceId { get; set; }

        [JsonPropertyName("service_type_id")]
        public int ServiceTypeId { get; set; }

        [JsonPropertyName("coupon")]
        public string Coupon { get; set; } = string.Empty;

        [JsonPropertyName("pick_shift")]
        public List<int> PickShift { get; set; } = new List<int>();

        [JsonPropertyName("items")]
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }
    public class OrderItemDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("code")]
        public string Code { get; set; } = string.Empty;

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("price")]
        public int Price { get; set; }

        [JsonPropertyName("length")]
        public int Length { get; set; }

        [JsonPropertyName("width")]
        public int Width { get; set; }

        [JsonPropertyName("height")]
        public int Height { get; set; }

        [JsonPropertyName("weight")]
        public int Weight { get; set; }

        [JsonPropertyName("category")]
        public Dictionary<string, string> Category { get; set; } = new Dictionary<string, string>();
    }
}