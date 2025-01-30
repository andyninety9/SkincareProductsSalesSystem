using System.Security.Claims;
using Application.Attributes;
using Application.Common.Paginations;
using Application.Constant;
using Application.Users.Commands;
using Application.Users.Queries;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;
using WebApi.DTOs;

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

        // POST: api/User/update-me
        // Authorization: Bearer token
        // Body: { "fullname": "string", "gender": "string", "email": "string", "phoneNumber": "string", "dob": "string:ISO8601"}
        [HttpPost("update-me")]
        [Authorize]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateMeCommand command, CancellationToken cancellationToken)
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

                if (_mediator == null)
                {
                    return StatusCode(500, new { statusCode = 500, message = IConstantMessage.INTERNAL_SERVER_MEDIATOR_ERROR });
                }
                System.Console.WriteLine("user id: " + userId);
                
                var updatedCommand = command with { UsrId = userId};
                var result = await _mediator.Send(updatedCommand, cancellationToken);

                if (result.IsFailure)
                {
                    return HandleFailure(result);
                }
                
                var response = await _mediator.Send(new GetMeQuery(userId), cancellationToken);
                return Ok(new { statusCode = 200, message = IConstantMessage.UPDATE_ME_SUCCESS, data = response.Value });
                
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return StatusCode(500, new { statusCode = 500, message = "An unexpected error occurred." });
            }
        }

        //POST: api/User/change-avatar
        //Authorization: Bearer token
        //Body: { AvatarFile: "file" }
        [HttpPost("change-avatar")]
        [Authorize]
        public async Task<IActionResult> ChangeAvatar([FromForm] ChangeAvatarRequest request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.AvatarFile == null || request.AvatarFile.Length == 0)
                {
                    return BadRequest(new { statusCode = 400, message = "No file uploaded." });
                }

                var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(usrID))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
                }

                var userId = long.Parse(usrID);

                byte[] fileData;
                try
                {
                    using var memoryStream = new MemoryStream();
                    await request.AvatarFile.CopyToAsync(memoryStream, cancellationToken);
                    fileData = memoryStream.ToArray();
                }
                catch (Exception ex)
                {
                    System.Console.WriteLine($"Error processing file: {ex.Message}");
                    return StatusCode(500, new { statusCode = 500, message = IConstantMessage.UPLOAD_FILE_FALSE });
                }

                var command = new ChangeAvatarCommand(
                    UsrId: userId,
                    AvatarFileData: fileData,
                    FileName: request.AvatarFile.FileName
                );

                var result = await _mediator.Send(command, cancellationToken);

                if (result.IsFailure)
                {
                    return HandleFailure(result);
                }

                var response = await _mediator.Send(new GetMeQuery(userId), cancellationToken);
                return Ok(new { statusCode = 200, message = IConstantMessage.CHANGE_AVATAR_SUCCESS, data = response.Value });
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return StatusCode(500, new { statusCode = 500, message = "An unexpected error occurred." });
            }
        }
        //POST: api/User/change-cover
        //Authorization: Bearer token
        //Body: { CoverFile: "file" }
        [HttpPost("change-cover")]
        [Authorize]
        public async Task<IActionResult> ChangeCover([FromForm] ChangeCoverRequest request, CancellationToken cancellationToken)
        {
            try
            {
                if (request.CoverFile == null || request.CoverFile.Length == 0)
                {
                    return BadRequest(new { statusCode = 400, message = "No file uploaded." });
                }

                var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(usrID))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
                }

                var userId = long.Parse(usrID);

                byte[] fileData;
                try
                {
                    using var memoryStream = new MemoryStream();
                    await request.CoverFile.CopyToAsync(memoryStream, cancellationToken);
                    fileData = memoryStream.ToArray();
                }
                catch (Exception ex)
                {
                    System.Console.WriteLine($"Error processing file: {ex.Message}");
                    return StatusCode(500, new { statusCode = 500, message = IConstantMessage.UPLOAD_FILE_FALSE });
                }

                var command = new ChangeCoverCommand(
                    UsrId: userId,
                    CoverFileData: fileData,
                    FileName: request.CoverFile.FileName
                );

                var result = await _mediator.Send(command, cancellationToken);

                if (result.IsFailure)
                {
                    return HandleFailure(result);
                }

                var response = await _mediator.Send(new GetMeQuery(userId), cancellationToken);
                return Ok(new { statusCode = 200, message = IConstantMessage.CHANGE_AVATAR_SUCCESS, data = response.Value });
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return StatusCode(500, new { statusCode = 500, message = "An unexpected error occurred." });
            }
        }

        //POST: api/User/change-password
        //Authorization: Bearer token
        //Body: { "oldPassword": "string", "newPassword": "string", "confirmPassword": "string" }
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand request, CancellationToken cancellationToken)
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

                if (_mediator == null)
                {
                    return StatusCode(500, new { statusCode = 500, message = IConstantMessage.INTERNAL_SERVER_MEDIATOR_ERROR });
                }

                var command = request with { UsrId = userId };

                var result = await _mediator.Send(command, cancellationToken);

                if (result.IsFailure)
                {
                    return HandleFailure(result);
                }

                return Ok(new { statusCode = 200, message = IConstantMessage.CHANGE_PASSWORD_SUCCESS });
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return StatusCode(500, new { statusCode = 500, message = "An unexpected error occurred." });
            }
        }

        // GET: api/User/all-users?page={int}&limit={int}
        // Authorization: Bearer token
        // Role: Manager, Staff
        // Query String: ?page={int}&limit={int}
        [HttpGet("all-users")]
        [Authorize]
        [AuthorizeRole(RoleType.Manager, RoleType.Staff)]
        public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken, [FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            if (page <= 0 || limit <= 0)
            {
                return BadRequest(new { statusCode = 400, message = "Page and limit must be greater than 0." });
            }

            var query = new GetAllUsersQuery(new PaginationParams { Page = page, PageSize = limit });
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Get all users successfully", data = result.Value });
        }

        //GET: api/User/search-users?keyword={string}&page={int}&limit={int}
        //Authorization: Bearer token
        //Role: Manager, Staff
        //Query String: ?keyword={string}&page={int}&limit={int}
        [HttpGet("search-users")]
        [Authorize]
        [AuthorizeRole(RoleType.Manager, RoleType.Staff)]
        public async Task<IActionResult> SearchUsers(CancellationToken cancellationToken, [FromQuery] string keyword, [FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            if (page <= 0 || limit <= 0)
            {
                return BadRequest(new { statusCode = 400, message = "Page and limit must be greater than 0." });
            }

            var query = new SearchUsersQuery(keyword, new PaginationParams { Page = page, PageSize = limit });
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Search users successfully", data = result.Value });
        }

        //POST: api/User/create-user
        //Authorization: Bearer token
        //Role: Manager
        //Body: { "fullname": "string", "username": "string", "email": "string", "phone": "string", roleId: "short"}
        [HttpPost("create-user")]
        [Authorize]
        [AuthorizeRole(RoleType.Manager)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Create user successfully", data = result.Value });
        }

    }
}