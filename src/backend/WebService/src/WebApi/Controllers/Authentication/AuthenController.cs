using Application.Auth.Commands;
using Application.Constant;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Authentication
{
    [Route("api/[controller]")]
    public class AuthenController : ApiController
    {
        public AuthenController(IMediator mediator) : base(mediator)
        {
        }


        // POST: api/Authen/register 
        //{
        //     "username": "string",
        //     "email": "string",
        //     "phone": "string",
        //     "password": "string",
        //     "confirmPassword": "string",
        //     "fullname": "string"
        // }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterAccountCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message =IConstantMessage.REGISTER_SUCCESS, data = result.Value });

        }

        // POST: api/Authen/login
        // {
        //     "username": "string",
        //     "password": "string"
        // }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginAccountCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.LOGIN_SUCCESS,
                data = result.Value
            });
        }

        // POST: api/Authen/refresh-token
        // {
        //     "refreshToken": "string
        // }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.REFRESH_TOKEN_SUCCESS,
                data = result.Value
            });
        }

        // POST: api/Authen/logout
        // {
        //     "refreshToken": "string
        // }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutAccountCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.LOGOUT_SUCCESS,
                data = result.Value
            });
        }

        // GET: api/Authen/verify-email/{emailVerifyToken}
        [AllowAnonymous]
        [HttpGet("verify-email/{emailVerifyToken}")]
        public async Task<IActionResult> VerifyEmail(string emailVerifyToken, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new VerifyEmailCommand(emailVerifyToken), cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.VERIFY_EMAIL_SUCCESS,
                data = result.Value
            });
        }

        // POST: api/Authen/resend-verify-email
        // {
        //     "email": "string"
        // }
        [Authorize]
        [HttpPost("resend-verify-email")]
        public async Task<IActionResult> ResendVerifyEmail([FromBody] ResendEmailVerifyCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.RESEND_VERIFY_EMAIL_SUCCESS,
                data = result.Value
            });
        }

        // POST: api/Authen/forgot-password
        // {
        //     "email": "string"
        // }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }

            return Ok(new
            {
                statusCode = 200,
                message = IConstantMessage.FORGOT_PASSWORD_SUCCESS,
                data = result.Value
            });
        }
    }
       
        
        
}