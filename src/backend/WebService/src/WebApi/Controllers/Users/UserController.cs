using System.Security.Claims;
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
                // Kiểm tra xem User có null không
                if (User == null)
                {
                    return Unauthorized(new { statusCode = 401, message = "User information not found in token." });
                }

                // Lấy giá trị của claim "sub" từ token
                var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // Kiểm tra xem usrID có null hoặc rỗng không
                if (string.IsNullOrEmpty(usrID))
                {
                    return Unauthorized(new { statusCode = 401, message = "Invalid or missing user ID in token." });
                }

                // Kiểm tra xem usrID có phải là long hợp lệ không
                if (!long.TryParse(usrID, out var userId))
                {
                    return Unauthorized(new { statusCode = 401, message = "Invalid user ID format in token." });
                }

                // In ra usrID để debug (nếu cần)
                System.Console.WriteLine(usrID);

                // Kiểm tra xem _mediator có null không
                if (_mediator == null)
                {
                    return StatusCode(500, new { statusCode = 500, message = "Internal server error: Mediator is not initialized." });
                }

                // Gọi Query Handler để lấy thông tin profile người dùng
                var query = new GetMeQuery(userId);
                var result = await _mediator.Send(query, cancellationToken);

                // Kiểm tra kết quả và trả về response
                if (result == null || !result.IsSuccess)
                {
                    return BadRequest(new { statusCode = 400, message = result?.Error?.Description ?? "Failed to get user profile." });
                }

                return Ok(new { statusCode = 200, message = "Get me successfully", data = result.Value });
            }
            catch (Exception ex)
            {
                // Trả về lỗi 500 nếu có lỗi không mong muốn
                System.Console.WriteLine(ex.Message);
                return StatusCode(500, new { statusCode = 500, message = "An unexpected error occurred." });
            }
        }
    }
}