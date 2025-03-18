using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Features.Orders.Queries.Validator;
using Application.Features.Orders.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;
using Application.Features.Orders.Commands;
using Application.Constant;
using System.Security.Claims;
using Domain.DTOs;
using Application.Features.Orders.Commands.Validator;
using Application.Features.Orders.Commands.Response;
using Application.Common.ResponseModel;

namespace WebApi.Controllers.Orders
{
    /// <summary>
    /// Orders Controller for managing order-related operations.
    /// Provides endpoints for retrieving, updating, and canceling orders.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ApiController
    {
        private readonly ILogger<OrdersController> _logger;
        public OrdersController(IMediator mediator, ILogger<OrdersController> logger) : base(mediator)
        {
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of orders based on filters.
        /// </summary>
        /// <param name="status">Optional order status filter.</param>
        /// <param name="customerId">Optional customer ID filter.</param>
        /// <param name="eventId">Optional event ID filter.</param>
        /// <param name="fromDate">Optional start date filter (yyyy-MM-dd).</param>
        /// <param name="toDate">Optional end date filter (yyyy-MM-dd).</param>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="pageSize">Number of records per page (default: 10).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of orders matching the filters.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/orders?status=Pending&customerId=123&eventId=456&fromDate=2023-01-01&toDate=2023-12-31&page=1&pageSize=10
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Retrieves details of a specific order by its ID.
        /// </summary>
        /// <param name="id">The ID of the order.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the details of the requested order.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/orders/{id}
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Updates the order status to the next stage.
        /// </summary>
        /// <param name="orderId">The ID of the order to be updated.</param>
        /// <param name="request">Update request containing a note.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated order details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     PATCH /api/orders/{orderId}/next-status
        ///     {
        ///         "note": "Proceeding to next status."
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpPatch("{orderId}/next-status")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> NextStatus(long orderId, [FromBody] ChangeStatusOrderRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                if (User == null)
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.USER_INFORMATION_NOT_FOUND });
                }

                var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(usrID))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
                }

                if (!long.TryParse(usrID, out var userId))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.INTERNAL_SERVER_ERROR });
                }
                var command = new NextStatusOrderCommand(userId, orderId, request.Note);

                var result = await _mediator.Send(command, cancellationToken);

                if (!result.IsSuccess)
                {
                    return StatusCode(500, new
                    {
                        statusCode = 500,
                        message = "An error occurred while updating order status.",
                        details = result.Error
                    });
                }

                return Ok(new
                {
                    statusCode = 200,
                    message = "Order status updated successfully.",
                    data = result.Value
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in NextStatus");
                return StatusCode(500, new
                {
                    statusCode = 500,
                    message = "An unexpected error occurred.",
                    details = ex.Message
                });
            }
        }

        /// <summary>
        /// Reverses the status of an order.
        /// </summary>
        /// <param name="orderId">The ID of the order to be reversed.</param>
        /// <param name="request">Reversal request containing a note.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated order details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     PATCH /api/orders/{orderId}/reverse-status
        ///     {
        ///         "note": "Reversing the status."
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpPatch("{orderId}/reverse-status")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]

        public async Task<IActionResult> ReverseStatus(long orderId, [FromBody] ChangeStatusOrderRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                if (User == null)
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.USER_INFORMATION_NOT_FOUND });
                }

                var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(usrID))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
                }

                if (!long.TryParse(usrID, out var userId))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.INTERNAL_SERVER_ERROR });
                }
                var command = new ReverseStatusOrderCommand(userId, orderId, request.Note);

                var result = await _mediator.Send(command, cancellationToken);

                if (!result.IsSuccess)
                {
                    return StatusCode(500, new
                    {
                        statusCode = 500,
                        message = "An error occurred while updating order status.",
                        details = result.Error
                    });
                }

                return Ok(new
                {
                    statusCode = 200,
                    message = "Order status updated successfully.",
                    data = result.Value
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in ReverseStatus");
                return StatusCode(500, new
                {
                    statusCode = 500,
                    message = "An unexpected error occurred.",
                    details = ex.Message
                });
            }
        }

        /// <summary>
        /// Creates a new order.
        /// </summary>
        /// <param name="command">Order creation request containing order items.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the details of the created order.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/orders/create
        ///     {
        ///        "userId": 1,
        ///         "eventId": 1,
        ///         "voucherCodeApplied": "ABC123", 
        ///         "orderItems": [
        ///             {
        ///                 "productId": 1,
        ///                 "quantity": 2
        ///             }
        ///         ]
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpPost("create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command, CancellationToken cancellationToken)
        {
            if (User == null)
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.USER_INFORMATION_NOT_FOUND });
            }

            var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(usrID))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
            }

            if (!long.TryParse(usrID, out var userId))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.INTERNAL_SERVER_ERROR });
            }

            // **🔹 Chạy Validator trước khi gửi tới Mediator**
            var validator = new CreateOrderCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                var errors = new List<Error> { new Error("ValidationFailed", "Validation errors occurred") };
                errors.AddRange(validationResult.Errors.Select(e => new Error(e.PropertyName, e.ErrorMessage)));

                var validationFailure = Result.Failure<CreateOrderResponse>(errors.First());

                return HandleFailure(validationFailure);
            }

            // Gán UserId từ token vào command
            var orderCommand = command with { UserId = userId };
            var result = await _mediator.Send(orderCommand, cancellationToken);

            return result.IsFailure ? HandleFailure(result) : Ok(new
            {
                statusCode = 201,
                message = "Order created successfully",
                data = result.Value
            });
        }

        /// <summary>
        /// Cancels an order.
        /// </summary>
        /// <param name="command">Cancellation request containing the order ID and note.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the cancellation process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/orders/cancel
        ///     {
        ///         "orderId": 123,
        ///         "note": "Customer request."
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpPost("cancel")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> CancelOrder([FromBody] CancelOrderCommand command, CancellationToken cancellationToken)
        {
            if (User == null)
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.USER_INFORMATION_NOT_FOUND });
            }

            var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(usrID))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
            }

            if (!long.TryParse(usrID, out var userId))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.INTERNAL_SERVER_ERROR });
            }

            // **🔹 Chạy Validator trước khi gửi tới Mediator**
            var validator = new CancelOrderCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                var errors = new List<Error> { new Error("ValidationFailed", "Validation errors occurred") };
                errors.AddRange(validationResult.Errors.Select(e => new Error(e.PropertyName, e.ErrorMessage)));

                var validationFailure = Result.Failure<CancelOrderResponse>(errors.First());

                return HandleFailure(validationFailure);
            }

            // Gán UserId từ token vào command
            var cancelCommand = command with { UserId = userId };
            var result = await _mediator.Send(cancelCommand, cancellationToken);

            return result.IsFailure ? HandleFailure(result) : Ok(new
            {
                statusCode = 200,
                message = "Order canceled successfully",
                data = result.Value
            });

        }

        /// <summary>
        /// Get user orders detail
        /// </summary>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the details of the user orders.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/orders/user/{orderId}
        ///     
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpGet("user/{orderId}")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> GetUserOrders(CancellationToken cancellationToken = default)
        {
            if (User == null)
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.USER_INFORMATION_NOT_FOUND });
            }

            var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(usrID))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
            }

            if (!long.TryParse(usrID, out var userId))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.INTERNAL_SERVER_ERROR });
            }

            var query = new GetUserOrdersQuery(userId);

            var result = await _mediator.Send(query, cancellationToken);

            return result.IsFailure ? HandleFailure(result) : Ok(new
            {
                statusCode = 200,
                message = "User orders retrieved successfully",
                data = result.Value
            });
    }
}