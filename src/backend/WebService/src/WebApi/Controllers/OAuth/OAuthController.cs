using Application.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.Controllers.OAuth
{
    [Route("api/[controller]")]
    [ApiController]
    public class OAuthController : ApiController
    {
        public OAuthController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Xác thực Google OAuth bằng ID Token
        /// </summary>
        /// <param name="request">Google OAuth ID Token</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Thông tin người dùng & JWT Token</returns>
        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody] GoogleOAuthCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrEmpty(request.IdToken))
            {
                return BadRequest(new { statusCode = 400, message = "ID Token is required." });
            }

            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure
                ? HandleFailure(result)
                : Ok(new { statusCode = 200, message = "Google OAuth success", data = result.Value });
        }
    }
}
