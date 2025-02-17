using Application.Abstractions.Delivery;
using Domain.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;
namespace WebApi.Controllers.Delivery
{
    [Route("api/[controller]")]
    public class DeliveryController : ApiController
    {
        private readonly IDelivery _delivery;

        public DeliveryController(IMediator mediator, IDelivery delivery) : base(mediator)
        {
            _delivery = delivery;
        }

        // GET: api/delivery/districts?provinceId=1
        // Request params: provinceId
        // Headers Bearer Token
        [HttpGet("districts")]
        [Authorize]
        public async Task<IActionResult> GetProvinces(
            [FromQuery] int provinceId)
        {
            try
            {
                var result = await _delivery.GetDistricts(provinceId);

                return Ok(new { statusCode = 200, message = "Fetch all districts successfully", data = result.Value });
            }
            catch (Exception ex)
            {
                return BadRequest(new { statusCode = 400, message = ex.Message });
            }
        }

        // GET: api/delivery/provinces
        // Headers Bearer Token
        [HttpGet("provinces")]
        [Authorize]
        public async Task<IActionResult> GetProvinces()
        {
            try
            {
                var result = await _delivery.GetProvinces();

                return Ok(new { statusCode = 200, message = "Fetch all provinces successfully", data = result.Value });
            }
            catch (Exception ex)
            {
                return BadRequest(new { statusCode = 400, message = ex.Message });
            }
        }

        // GET: api/delivery/wards?districtId=1
        // Request params: districtId
        // Headers Bearer Token
        [HttpGet("wards")]
        [Authorize]
        public async Task<IActionResult> GetWards(
            [FromQuery] int districtId)
        {
            try
            {
                var result = await _delivery.GetWards(districtId);

                return Ok(new { statusCode = 200, message = "Fetch all wards successfully", data = result.Value });
            }
            catch (Exception ex)
            {
                return BadRequest(new { statusCode = 400, message = ex.Message });
            }
        }

        // POST: api/delivery/create-order
        // Request body: CreateOrderDeliRequestDto
        // Headers Bearer Token

        [HttpPost("create-order")]
        [Authorize]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDeliRequestDto request)
        {
            try
            {
                var result = await _delivery.CreateOrder(request);

                return Ok(new { statusCode = 200, message = "Create order successfully", data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { statusCode = 400, message = ex.Message });
            }

        }
    }
}