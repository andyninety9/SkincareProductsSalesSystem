using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Delivery
{
    public class GHNDeliveryConfig
    {
        public string BaseUrl { get; set; }
        public string TokenId { get; set; }
        public string ShopId { get; set; }
        public string ClientId { get; set; }


        public GHNDeliveryConfig()
        {
            BaseUrl = GetEnvironmentVariable("GHN_BASE_URL");
            TokenId = GetEnvironmentVariable("GHN_TOKEN");
            ShopId = GetEnvironmentVariable("GHN_SHOP_ID");
            ClientId = GetEnvironmentVariable("GHN_CLIENT_ID");
        }

        private string GetEnvironmentVariable(string variableName)
        {
            var value = Environment.GetEnvironmentVariable(variableName);
            if (string.IsNullOrEmpty(value))
            {
                throw new InvalidOperationException($"Environment variable '{variableName}' is not set.");
            }
            return value;
        }


    }
}