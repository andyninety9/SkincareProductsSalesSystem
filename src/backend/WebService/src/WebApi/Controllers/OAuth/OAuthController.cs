using Application.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.Controllers.OAuth
{
    /// <summary>
    /// OAuth Controller for handling authentication via third-party providers.
    /// Provides endpoints for authenticating users using Google OAuth.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class OAuthController : ApiController
    {
        public OAuthController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Authenticates a user via Google OAuth using an ID Token.
        /// </summary>
        /// <param name="request">Google OAuth ID Token.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns user information and JWT token upon successful authentication.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/OAuth/google
        ///     {
        ///         "idToken": "string"
        ///     }
        ///
        /// Headers:
        /// - Content-Type: application/json
        /// </remarks>
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
