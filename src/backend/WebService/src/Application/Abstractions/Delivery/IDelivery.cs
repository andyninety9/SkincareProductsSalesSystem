using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.DTOs;

namespace Application.Abstractions.Delivery
{
    public interface IDelivery
    {
        Task<GetProvinceResponse> GetProvinces();
        Task<GetDistrictResponse> GetDistricts(int provinceId);
        Task<GetWardResponse> GetWards(int districtId);

        Task<CreateOrderResponseDto> CreateOrder(CreateOrderDeliRequestDto request);
    }
}