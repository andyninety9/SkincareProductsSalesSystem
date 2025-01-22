using System.Security.Claims;
using Application.Constant;
using Application.Users.Commands;
using Application.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Users
{
    
    [Route("api/[controller]")]
    public class UserController : ApiController
    {
        public UserController(IMediator mediator) : base(mediator)
        {
        }

        // GET: api/User/get-me
        // Authorization: Bearer token
        [HttpGet("get-me")]
        [Authorize]
        public async Task<IActionResult> GetMe(CancellationToken cancellationToken)
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

                System.Console.WriteLine(usrID);

                if (_mediator == null)
                {
                    return StatusCode(500, new { statusCode = 500, message = IConstantMessage.INTERNAL_SERVER_MEDIATOR_ERROR });
                }

                var query = new GetMeQuery(userId);
                var result = await _mediator.Send(query, cancellationToken);

                if (result == null || !result.IsSuccess)
                {
                    return BadRequest(new { statusCode = 400, message = result?.Error?.Description ?? IConstantMessage.GET_ME_FALSE });
                }

                return Ok(new { statusCode = 200, message = IConstantMessage.GET_ME_SUCCESS, data = result.Value });
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return StatusCode(500, new { statusCode = 500, message = "An unexpected error occurred." });
            }
        }
    }
}