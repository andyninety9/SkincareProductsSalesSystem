using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class GetShippingFeeResponse
    {
        public int Code { get; set; }
        public string Message { get; set; } = string.Empty;
        public ShippingFeeData Data { get; set; }

        public class ShippingFeeData
        {
            public decimal Total { get; set; }
            public decimal ServiceFee { get; set; }
            public decimal InsuranceFee { get; set; }
            public decimal PickStationFee { get; set; }
            public decimal CouponValue { get; set; }
            public decimal R2sFee { get; set; }
            public decimal DocumentReturn { get; set; }
            public decimal DoubleCheck { get; set; }
            public decimal CodFee { get; set; }
            public decimal PickRemoteAreasFee { get; set; }
            public decimal DeliverRemoteAreasFee { get; set; }
            public decimal CodFailedFee { get; set; }
        }
    }
}