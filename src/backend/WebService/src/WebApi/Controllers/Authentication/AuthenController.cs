using Application.Auth.Commands;
using Application.Constant;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Authentication
{
    /// <summary>
    /// Authentication Controller for user account management.
    /// Provides endpoints for user registration, login, token management, and account verification.
    /// </summary>
    [Route("api/[controller]")]
    public class AuthenController : ApiController
    {
        public AuthenController(IMediator mediator) : base(mediator)
        {
        }


        /// <summary>
        /// Registers a new user account.
        /// </summary>
        /// <param name="request">User registration details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Registration status and user data.</returns>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/Authen/register
        ///     {
        ///         "username": "string",
        ///         "email": "string",
        ///         "phone": "string",
        ///         "password": "string",
        ///         "confirmPassword": "string",
        ///         "fullname": "string"
        ///     }
        /// </remarks>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterAccountCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.REGISTER_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Logs in a user and generates an authentication token.
        /// </summary>
        /// <param name="request">User login details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns authentication token upon successful login.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/Authen/login
        ///     {
        ///         "username": "string",
        ///         "password": "string"
        ///     }
        /// </remarks>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginAccountCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.LOGIN_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Refreshes an expired authentication token.
        /// </summary>
        /// <param name="request">Refresh token request.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a new access token.</returns>
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.REFRESH_TOKEN_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Logs out a user and invalidates the refresh token.
        /// </summary>
        /// <param name="request">Logout request containing refresh token.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Logout status.</returns>
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutAccountCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.LOGOUT_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Verifies a user's email using a verification token.
        /// </summary>
        /// <param name="emailVerifyToken">The verification token sent to the user's email.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Verification status.</returns>
        [AllowAnonymous]
        [HttpGet("verify-email/{emailVerifyToken}")]
        public async Task<IActionResult> VerifyEmail(string emailVerifyToken, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new VerifyEmailCommand(emailVerifyToken), cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.VERIFY_EMAIL_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Resends the email verification link.
        /// </summary>
        /// <param name="request">Resend verification email request.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Status of email resend.</returns>
        [Authorize]
        [HttpPost("resend-verify-email")]
        public async Task<IActionResult> ResendVerifyEmail([FromBody] ResendEmailVerifyCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.RESEND_VERIFY_EMAIL_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Initiates the password reset process.
        /// </summary>
        /// <param name="request">Forgot password request.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Status of password reset request.</returns>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.FORGOT_PASSWORD_SUCCESS, data = result.Value });
        }
    }
       
        
        
}