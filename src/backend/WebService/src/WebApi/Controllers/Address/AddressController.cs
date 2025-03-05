using System.Security.Claims;
using Application.Auth.Commands;
using Application.Common.Paginations;
using Application.Constant;
using Application.Features.Address.Commands;
using Application.Features.Address.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;


namespace WebApi.Controllers.Address
{
    /// <summary>
    /// Address Controller for managing user addresses.
    /// Provides endpoints for creating, deleting, and activating addresses.
    /// </summary>
    [Route("api/[controller]")]
    public class AddressController : ApiController
    {

        public AddressController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Creates a new address for the authenticated user.
        /// </summary>
        /// <param name="request">Address details including street, city, district, and ward.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created address information.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/Address/create
        ///     {
        ///         "address": "string",
        ///         "city": "string",
        ///         "district": "string",
        ///         "ward": "string"
        ///     }
        /// </remarks>
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreateAddressCommand request, CancellationToken cancellationToken)
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
            var command = request with { UsrId = userId };

            var result = await _mediator.Send(command, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.CREATE_ADDRESS_SUCCESS, data = result.Value });

        }

        /// <summary>
        /// Deletes an address.
        /// </summary>
        /// <param name="request">Address deletion request containing address ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns status of the deletion process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /api/Address/delete
        ///     {
        ///         "addressId": 0
        ///     }
        /// </remarks>
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromBody] DeleteAddressCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.DELETE_ADDRESS_SUCCESS, data = result.Error.Description });
        }

        /// <summary>
        /// Activates an address.
        /// </summary>
        /// <param name="request">Address activation request containing address ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns status of the activation process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/Address/active
        ///     {
        ///         "addressId": 0
        ///     }
        /// </remarks>
        [HttpPut("active")]
        [Authorize]
        public async Task<IActionResult> Active([FromBody] ActiveAddressCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.ACTIVE_ADDRESS_SUCCESS, data = result.Error.Description });
        }

        /// <summary>
        /// Gets all addresses of the authenticated user.
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <param page="int">Page.</param>
        /// <param pageSize="int">Pagesize.</param>
        /// <returns>Returns all addresses of the authenticated user.</returns>
        /// <remarks>
        /// Sample request:
        ///    GET /api/Address/getAll
        /// Headers:
        ///    Authorization: Bearer token
        ///    Content-Type: application/json
        ///    Accept: application/json
        ///    Request Body: None
        /// </remarks>
        [HttpGet("get-all-address")]
        [Authorize]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken,
            [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
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

            PaginationParams paginationParams = new()
            {
                Page = page,
                PageSize = pageSize
            };

            var result = await _mediator.Send(new GetAllUserAddressQuery(userId, paginationParams), cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_ADDRESS_SUCCESS, data = result.Value });
        }
    }
}