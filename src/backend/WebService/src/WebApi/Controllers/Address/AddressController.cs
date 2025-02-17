using System.Security.Claims;
using Application.Auth.Commands;
using Application.Constant;
using Application.Features.Address.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;


namespace WebApi.Controllers.Address
{
    [Route("api/[controller]")]
    public class AddressController : ApiController
    {
        public AddressController(IMediator mediator) : base(mediator)
        {
        }

        // POST: api/Address/create
        // {
        //     "address": "string",
        //     "city": "string",
        //     "district": "string",
        //     "ward": "string"
        // }
        // [Authorize]
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


    }
}