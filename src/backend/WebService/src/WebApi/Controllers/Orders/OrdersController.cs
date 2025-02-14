using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Features.Orders.Queries.Validator;
using Application.Features.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Orders
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ApiController
    {
        private readonly ILogger<OrdersController> _logger;
        public OrdersController(IMediator mediator, ILogger<OrdersController> logger) : base(mediator)
        {
            _logger = logger;
        }

        //GET: /api/orders?status={status}&customerId={customerId}&eventId={eventId}&fromDate={fromDate}&toDate={toDate}&page={page}&pageSize={pageSize}
        //Header: Authorization: Bearer {token}
        //Role: Admin, Staff
        [HttpGet]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> GetOrders(
    [FromQuery] string? status,
    [FromQuery] long? customerId,
    [FromQuery] long? eventId,
    [FromQuery] string? fromDate,
    [FromQuery] string? toDate,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    CancellationToken cancellationToken = default)
        {
            try
            {
                var paginationParams = new PaginationParams { Page = page, PageSize = pageSize };

                var query = new GetAllOrdersQuery(status, customerId, eventId, fromDate, toDate, paginationParams);

                // Validate request
                var validator = new GetAllOrdersQueryValidator();
                var validationResult = validator.Validate(query);

                if (!validationResult.IsValid)
                {
                    return BadRequest(new
                    {
                        statusCode = 400,
                        errors = validationResult.Errors.Select(e => new
                        {
                            param = e.PropertyName,
                            message = e.ErrorMessage
                        })
                    });
                }

                var result = await _mediator.Send(query, cancellationToken);

                if (!result.IsSuccess)
                {
                    return StatusCode(500, new
                    {
                        statusCode = 500,
                        message = "An error occurred while fetching orders.",
                        details = result.Error
                    });
                }

                return Ok(new
                {
                    statusCode = 200,
                    message = "Orders retrieved successfully.",
                    data = result.Value
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetOrders");
                return StatusCode(500, new
                {
                    statusCode = 500,
                    message = "An unexpected error occurred.",
                    details = ex.Message
                });
            }
        }

        //GET: /api/orders/{id}
        //Header: Authorization: Bearer {token}
        //Role: Admin, Staff
        [HttpGet("{id}")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> GetOrderById(long id, CancellationToken cancellationToken = default)
        {
            try
            {
                
                var query = new GetOrderDetailQuery(id);
             
                var result = await _mediator.Send(query, cancellationToken);

                if (!result.IsSuccess)
                {
                    return StatusCode(500, new
                    {
                        statusCode = 500,
                        message = "An error occurred while fetching order.",
                        details = result.Error
                    });
                }

                return Ok(new
                {
                    statusCode = 200,
                    message = "Order retrieved successfully.",
                    data = result.Value
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetOrderById");
                return StatusCode(500, new
                {
                    statusCode = 500,
                    message = "An unexpected error occurred.",
                    details = ex.Message
                });
            }
        }
    }
}