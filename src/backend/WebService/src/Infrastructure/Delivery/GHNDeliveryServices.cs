using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Abstractions.Delivery;
using Application.Common.ResponseModel;
using Application.Constant;
using Domain.DTOs;

namespace Infrastructure.Delivery
{
    public class GHNDeliveryServices : IDelivery
    {
        private readonly GHNDeliveryConfig _config;

        private readonly HttpClient _httpClient;
        public GHNDeliveryServices(HttpClient httpClient, GHNDeliveryConfig config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<CreateOrderResponseDto> CreateOrder(CreateOrderDeliRequestDto request)
        {
            var url = $"{_config.BaseUrl}{IConstantAPIUrl.API_CREATE_ORDER_GHN}";

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, url);
            httpRequest.Headers.Add("Token", _config.TokenId);
            httpRequest.Headers.Add("ShopId", _config.ShopId);

            // Chuyển request thành JSON
            var jsonContent = JsonSerializer.Serialize(request);
            httpRequest.Content = new StringContent(jsonContent, Encoding.UTF8, "application/json"); // ✅ Đúng cách thiết lập Content-Type

            try
            {
                // Gửi request đến GHN API
                var response = await _httpClient.SendAsync(httpRequest);

                // Nếu API GHN trả về lỗi
                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadAsStringAsync();

                    try
                    {
                        // Parse lỗi thành object để hiển thị dễ đọc hơn
                        var ghnError = JsonSerializer.Deserialize<GhnErrorResponse>(errorResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                        throw new Exception($"GHN API Error: {ghnError.CodeMessageValue}\nChi tiết lỗi:\n{string.Join("\n", ghnError.GetErrorDetails())}");
                    }
                    catch
                    {
                        // Nếu không parse được, trả về lỗi thô
                        throw new Exception($"GHN API Error: {response.StatusCode} - {errorResponse}");
                    }
                }

                // Đọc dữ liệu phản hồi từ GHN
                var responseString = await response.Content.ReadAsStringAsync();

                // Deserialize dữ liệu JSON
                return JsonSerializer.Deserialize<CreateOrderResponseDto>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                       ?? new CreateOrderResponseDto();
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                Console.WriteLine($"Error in CreateOrder: {ex.Message}");
                throw new Exception($"Lỗi khi gọi GHN API: {ex.Message}");
            }
        }


        public async Task<GetDistrictResponse> GetDistricts(int provinceId)
        {
            var url = $"{_config.BaseUrl}" + IConstantAPIUrl.API_GET_DISTRICTS_GHN + $"?province_id={provinceId}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Token", _config.TokenId);

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();


            var responseObject = JsonSerializer.Deserialize<GetDistrictResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });


            return new GetDistrictResponse { Value = responseObject?.Value ?? new List<DistrictDto>() };
        }

        public async Task<GetProvinceResponse> GetProvinces()
        {
            var url = $"{_config.BaseUrl}" + IConstantAPIUrl.API_GET_PROVINCES_GHN;

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Token", _config.TokenId);

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();


            var responseObject = JsonSerializer.Deserialize<GetProvinceResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });


            return new GetProvinceResponse { Value = responseObject?.Value ?? new List<ProvinceDto>() };

        }

        public async Task<GetWardResponse> GetWards(int districtId)
        {
            var url = $"{_config.BaseUrl}" + IConstantAPIUrl.API_GET_WARDS_GHN + $"?district_id={districtId}";

            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Token", _config.TokenId);

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            var responseObject = JsonSerializer.Deserialize<GetWardResponse>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });


            return new GetWardResponse { Value = responseObject?.Value ?? new List<WardDto>() };

        }

        public async Task<GetShippingFeeResponse> GetShippingFee(GetShippingFeeRequest request)
        {
            var url = $"{_config.BaseUrl}" + IConstantAPIUrl.API_GET_SHIPPING_FEE_GHN;

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, url);
            httpRequest.Headers.Add("Token", _config.TokenId);
            httpRequest.Headers.Add("ShopId", _config.ShopId);

            // Chuyển request thành JSON
            var jsonContent = JsonSerializer.Serialize(request);
            httpRequest.Content = new StringContent(jsonContent, Encoding.UTF8, "application/json"); // ✅ Đúng cách thiết lập Content-Type

            try
            {
                // Gửi request đến GHN API
                var response = await _httpClient.SendAsync(httpRequest);

                // Nếu API GHN trả về lỗi
                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadAsStringAsync();

                    try
                    {
                        // Parse lỗi thành object để hiển thị dễ đọc hơn
                        var ghnError = JsonSerializer.Deserialize<GhnErrorResponse>(errorResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                        throw new Exception($"GHN API Error: {ghnError.CodeMessageValue}\nChi tiết lỗi:\n{string.Join("\n", ghnError.GetErrorDetails())}");
                    }
                    catch
                    {
                        // Nếu không parse được, trả về lỗi thô
                        throw new Exception($"GHN API Error: {response.StatusCode} - {errorResponse}");
                    }
                }

                // Đọc dữ liệu phản hồi từ GHN
                var responseString = await response.Content.ReadAsStringAsync();

                // Deserialize dữ liệu JSON
                return JsonSerializer.Deserialize<GetShippingFeeResponse>(responseString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                       ?? new GetShippingFeeResponse();
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần
                Console.WriteLine($"Error in GetShippingFee: {ex.Message}");
                throw new Exception($"Lỗi khi gọi GHN API: {ex.Message}");
            }
        }
    }
}