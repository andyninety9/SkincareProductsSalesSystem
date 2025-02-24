
using System.Security.Claims;
using Application.Attributes;
using Application.Common.Enum;
using Application.Constant;
using Application.Features.Return.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Return
{
    [Route("api/[controller]")]
    public class ReturnController : ApiController
    {
        public ReturnController(IMediator mediator) : base(mediator)
        {
        }

        // POST: api/return/create
        // Header: Authorization: Bearer {token}
        // Role: Customer
        // Body{List<ReturnProduct> listReturnProduct, long orderId, string reason}
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
    }
}