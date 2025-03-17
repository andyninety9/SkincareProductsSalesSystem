using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetShippingFeeRequest
    {
        public int From_District_Id { get; set; }
        public string From_Ward_Code { get; set; } = string.Empty;
        public int Service_Id { get; set; }
        public int? Service_Type_Id { get; set; }
        public int To_District_Id { get; set; }
        public string To_Ward_Code { get; set; } = string.Empty;
        public int Height { get; set; }
        public int Length { get; set; }
        public int Weight { get; set; }
        public int Width { get; set; }
        public int Insurance_Value { get; set; }
        public int Cod_Failed_Amount { get; set; }
        public string Coupon { get; set; } = string.Empty;
        public List<ShippingItem> Items { get; set; } = new List<ShippingItem>();

        public class ShippingItem
        {
            public string Name { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public int Height { get; set; }
            public int Weight { get; set; }
            public int Length { get; set; }
            public int Width { get; set; }
        }
    }
}