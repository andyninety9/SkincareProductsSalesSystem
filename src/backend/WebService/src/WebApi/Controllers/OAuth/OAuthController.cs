using Application.Auth.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.OAuth
{
    [Route("api/[controller]")]
    public class OAuthController : ApiController
    {
        protected OAuthController(IMediator mediator) : base(mediator)
        {
        }

        // POST: api/OAuth/google
        // {
        //     "idToken": "string"
        // }
        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody] GoogleOAuthCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = "Google OAuth success", data = result.Value });
        }
    }
}