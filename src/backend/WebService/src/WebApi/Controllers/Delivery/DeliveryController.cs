using Application.Abstractions.Delivery;
using Domain.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;
namespace WebApi.Controllers.Delivery
{
    /// <summary>
    /// Delivery Controller for managing delivery-related operations.
    /// Provides endpoints for fetching provinces, districts, wards, and creating delivery orders.
    /// </summary>
    [Route("api/[controller]")]
    public class DeliveryController : ApiController
    {
        private readonly IDelivery _delivery;

        public DeliveryController(IMediator mediator, IDelivery delivery) : base(mediator)
        {
            _delivery = delivery;
        }

        /// <summary>
        /// Retrieves a list of districts for a given province.
        /// </summary>
        /// <param name="provinceId">The ID of the province.</param>
        /// <returns>Returns a list of districts in the specified province.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/delivery/districts?provinceId=1
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Retrieves a list of all provinces.
        /// </summary>
        /// <returns>Returns a list of all available provinces.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/delivery/provinces
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Retrieves a list of wards for a given district.
        /// </summary>
        /// <param name="districtId">The ID of the district.</param>
        /// <returns>Returns a list of wards in the specified district.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/delivery/wards?districtId=1
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Creates a new delivery order.
        /// </summary>
        /// <param name="request">The request payload containing order details.</param>
        /// <returns>Returns the details of the created delivery order.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/delivery/create-order
        ///     {
        ///         "recipientName": "John Doe",
        ///         "recipientPhone": "123456789",
        ///         "deliveryAddress": "123 Main St, District 1, City",
        ///         "orderItems": [
        ///             {
        ///                 "itemName": "Product A",
        ///                 "quantity": 2
        ///             },
        ///             {
        ///                 "itemName": "Product B",
        ///                 "quantity": 1
        ///             }
        ///         ]
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>

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