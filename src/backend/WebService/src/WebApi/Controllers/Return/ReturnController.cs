
using System.Security.Claims;
using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Constant;
using Application.Features.Return.Commands;
using Application.Features.Return.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Return
{
    /// <summary>
    /// Return Controller for handling product return requests.
    /// Provides endpoints for customers to request returns.
    /// </summary>
    [Route("api/[controller]")]
    public class ReturnController : ApiController
    {
        public ReturnController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Creates a return request for a specific order.
        /// </summary>
        /// <param name="request">Return request containing order ID and a list of return products.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the return request creation.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/return/create
        ///     {
        ///         "ordId": 68167683437861276,
        ///         "returnProducts": [
        ///             {
        ///                 "productId": 6,
        ///                 "quantity": 1
        ///             },
        ///             {
        ///                 "productId": 7,
        ///                 "quantity": 1
        ///             }
        ///         ]
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Customer
        /// </remarks>
        [HttpPost("create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> CreateReturn([FromBody] CreateReturnCommand request, CancellationToken cancellationToken)
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

            CreateReturnCommand createReturnCommandReq = request with { UserId = userId };
            var result = await _mediator.Send(createReturnCommandReq, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.CREATE_RETURN_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Retrieves the list of return requests for a specific user.
        /// </summary>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the list of return requests.</returns>
        /// <remarks>
        /// Sample request:
        ///     GET /api/return/list?<paramref name="keyword"/>=<paramref name="page"/>=<paramref name="pageSize"/>
        ///         Headers:
        ///         - Authorization: Bearer {token}
        ///         Role:
        ///         - Customer
        /// </remarks>
        [HttpGet("list")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> GetReturnList([FromQuery] string? orderId, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
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
            long orderIdLong = 0;
            if (!string.IsNullOrEmpty(orderId))
            {
                long.TryParse(orderId, out orderIdLong);
            }

            var result = await _mediator.Send(new GetAllReturnByCustomerCommand(userId, orderIdLong, new PaginationParams { Page = page, PageSize = pageSize }), cancellationToken);


            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_RETURN_LIST_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Get All Return Request For Manager
        /// </summary>
        /// <param name="keyword">Keyword to search</param>
        /// <param name="page">Page number</param>
        /// <param name="pageSize">Number of items per page</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Returns the list of return requests</returns>
        /// <remarks>
        /// Sample request:
        ///     GET /api/return/manager/list?<paramref name="keyword"/>=<paramref name="page"/>=<paramref name="pageSize"/>
        ///         Headers:
        ///         - Authorization: Bearer {token}
        ///         Role:
        ///         - Manager
        ///         - Staff
        /// </remarks>
        [HttpGet("all")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> GetAllReturnRequest([FromQuery] string? keyword, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var result = await _mediator.Send(new GetAllReturnRequestQueryManager(keyword, new PaginationParams { Page = page, PageSize = pageSize }), cancellationToken);

            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_RETURN_LIST_SUCCESS, data = result.Value });
        }
    }
}