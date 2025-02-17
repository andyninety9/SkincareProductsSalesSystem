using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Constant
{
    public interface IConstantAPIUrl
    {
        public static string API_GET_DISTRICTS_GHN = "master-data/district";
        public static string API_GET_WARDS_GHN = "master-data/ward";
        public static string API_GET_PROVINCES_GHN = "master-data/province";
        public static string API_CREATE_ORDER_GHN = "v2/shipping-order/create";
    }
}