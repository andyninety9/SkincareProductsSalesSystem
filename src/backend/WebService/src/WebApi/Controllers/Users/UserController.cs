using System.Security.Claims;
using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Constant;
using Application.Features.Orders.Queries;
using Application.Features.Orders.Queries.Validator;
using Application.Features.Users.Commands;
using Application.Features.Users.Commands.Validations;
using Application.Features.Users.Queries;
using Application.Users.Commands;
using Application.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;
using WebApi.DTOs;

namespace WebApi.Controllers.Users
{
    /// <summary>
    /// User Controller for managing user-related operations.
    /// Provides endpoints for retrieving user details, updating profile, managing authentication, and handling user accounts.
    /// </summary>
    [Route("api/[controller]")]
    public class UserController : ApiController
    {
        public UserController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Retrieves the authenticated user's details.
        /// </summary>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns user details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/User/get-me
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Updates the authenticated user's profile.
        /// </summary>
        /// <param name="command">Update request containing user information.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated user details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/User/update-me
        ///     {
        ///         "fullname": "John Doe",
        ///         "gender": "Male",
        ///         "email": "johndoe@example.com",
        ///         "phoneNumber": "123456789",
        ///         "dob": "2000-01-01"
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

                var updatedCommand = command with { UsrId = userId };
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

        /// <summary>
        /// Changes the user's avatar.
        /// </summary>
        /// <param name="request">Request containing the avatar file.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated avatar details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/User/change-avatar
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// Body:
        /// - `AvatarFile`: File upload
        /// </remarks>
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

        /// <summary>
        /// Changes the user's cover photo.
        /// </summary>
        /// <param name="request">Request containing the cover photo file.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated cover photo details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/User/change-cover
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// Body:
        /// - `CoverFile`: File upload
        /// </remarks>
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

        /// <summary>
        /// Changes the user's password.
        /// </summary>
        /// <param name="request">Request containing the old and new passwords.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a success message if the password change is successful.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/User/change-password
        ///     {
        ///         "oldPassword": "oldPass123",
        ///         "newPassword": "newPass456",
        ///         "confirmPassword": "newPass456"
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Retrieves a paginated list of all users.
        /// </summary>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="limit">Number of records per page (default: 10).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of users.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/User/all-users?page=1&limit=10
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Manager
        /// - Staff
        /// </remarks>
        [HttpGet("all-users")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
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

        /// <summary>
        /// Searches for users based on filters.
        /// </summary>
        /// <param name="keyword">Search keyword.</param>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="limit">Number of records per page (default: 10).</param>
        /// <param name="gender">Optional gender filter.</param>
        /// <param name="status">Optional account status filter.</param>
        /// <param name="role">Optional role filter.</param>
        /// <param name="fromDate">Optional start date filter.</param>
        /// <param name="toDate">Optional end date filter.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of users matching the filters.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/User/search-users?keyword=John&page=1&limit=10&gender=Male&status=1&role=2&fromDate=2023-01-01&toDate=2023-12-31
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Manager
        /// - Staff
        /// </remarks>
        [HttpGet("search-users")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> SearchUsers(
            CancellationToken cancellationToken,
            [FromQuery] string keyword,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? gender = null,
            [FromQuery] int? status = null,
            [FromQuery] int? role = null,
            [FromQuery] string? fromDate = null,
            [FromQuery] string? toDate = null)
        {
            if (page <= 0 || limit <= 0)
            {
                return BadRequest(new { statusCode = 400, message = "Page and limit must be greater than 0." });
            }

            var query = new SearchUsersQuery(
                keyword,
                new PaginationParams { Page = page, PageSize = limit },
                gender ?? string.Empty,
                status,
                role,
                fromDate ?? string.Empty,
                toDate ?? string.Empty
            );
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Search users successfully", data = result.Value });
        }

        /// <summary>
        /// Creates a new user.
        /// </summary>
        /// <param name="command">User creation request containing user details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created user details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/User/create-user
        ///     {
        ///         "fullname": "John Doe",
        ///         "username": "johndoe",
        ///         "email": "johndoe@example.com",
        ///         "phone": "123456789",
        ///         "roleId": 2
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Manager
        /// </remarks>
        [HttpPost("create-user")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserCommand command, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Create user successfully", data = result.Value });
        }

        /// <summary>
        /// Deactivates a user account.
        /// </summary>
        /// <param name="id">The ID of the user to be deactivated.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the deactivation process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /api/User/deactive-user/123
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Manager
        /// - Staff
        /// </remarks>
        [HttpDelete("deactive-user/{id}")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> DeleteUser(long id, CancellationToken cancellationToken)
        {
            var command = new DeleteUserCommand(id);
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Delete user successfully" });
        }

        /// <summary>
        /// Activates a user account.
        /// </summary>
        /// <param name="id">The ID of the user to be activated.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the activation process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     PATCH /api/User/active-user/123
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Manager
        /// - Staff
        /// </remarks>
        [HttpPatch("active-user/{id}")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> ActiveUser(long id, CancellationToken cancellationToken)
        {
            var command = new ActiveUserCommand(id);
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Active user successfully" });
        }


        /// <summary>
        /// Retrieves the order history of the authenticated user.
        /// </summary>
        /// <param name="keyword">Optional search keyword.</param>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="limit">Number of records per page (default: 10).</param>
        /// <param name="fromDate">Optional start date filter (ISO8601 format).</param>
        /// <param name="toDate">Optional end date filter (ISO8601 format).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of the user's order history.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/User/orders-history?keyword=shoes&page=1&limit=10&fromDate=2023-01-01&toDate=2023-12-31
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Customer
        /// </remarks>
        [HttpGet("orders-history")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> GetOrdersHistory(
            CancellationToken cancellationToken,
            [FromQuery] string keyword,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string? fromDate = null,
            [FromQuery] string? toDate = null)
        {
            if (page <= 0 || limit <= 0)
            {
                return BadRequest(new { statusCode = 400, message = "Page and limit must be greater than 0." });
            }

            var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usrID))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
            }

            var userId = long.Parse(usrID);

            var paginationParams = new PaginationParams { Page = page, PageSize = limit };

            var query = new GetAllUserOrdersHistoryQuery(
                userId,
                paginationParams,
                fromDate ?? string.Empty,
                toDate ?? string.Empty
            );
            var validator = new GetAllUserOrdersHistoryQueryValidator();
            var validationResult = validator.Validate(query);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Get orders history successfully", data = result.Value });
        }

        /// <summary>
        /// Retrieves user vouchers.
        /// </summary>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="pageSize">Number of records per page (default: 10).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a list of user vouchers.</returns>
        /// <remarks>
        /// Sample request:
        ///   GET /api/User/vouchers?page=1&pageSize=10
        ///   Headers:
        ///   Authorization: Bearer {token}
        ///   Role:
        ///   Customer
        /// </remarks>
        /// <response code="200">Returns a list of user vouchers.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="401">If the user is not authenticated.</response>
        /// <response code="500">If an unexpected error occurs.</response>
        [HttpGet("vouchers")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> GetUserVouchers([FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(usrID))
            {
                return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
            }

            var userId = long.Parse(usrID);
            PaginationParams paginationParams = new() { Page = page, PageSize = pageSize };

            var query = new GetUserVouchersQuery(userId, paginationParams);
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Get user vouchers successfully", data = result.Value });
        }

        /// <summary>
        /// Assigns a voucher to the user.
        /// </summary>
        /// <param name="command">Request containing the voucher ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a success message if the voucher is assigned successfully.</returns>
        /// <remarks>
        /// Sample request:
        ///   POST /api/User/assign-voucher
        ///   {
        ///   "voucherDiscount": 20,
        ///   "usrId": "string",
        ///   "voucherDesc": "string",
        ///  "statusVoucher": "string",
        ///   }
        ///   Headers:
        ///   Authorization: Bearer {token}
        ///   Role:
        ///   Manager
        /// </remarks>
        /// <response code="200">Returns a success message if the voucher is assigned successfully.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="401">If the user is not authenticated.</response>
        /// <response code="500">If an unexpected error occurs.</response>
        [HttpPost("assign-voucher")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> AssignVoucher([FromBody] AssignVoucherCommand command, CancellationToken cancellationToken)
        {
            var validator = new AssignVoucherCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Assign voucher successfully" });
        }

        /// <summary>
        /// Apply voucher to the user.
        /// </summary>
        /// <param name="command">Request containing the voucher ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a success message if the voucher is applied successfully.</returns>
        /// <remarks>
        /// Sample request:
        ///   POST /api/User/apply-voucher
        ///   {
        ///   "voucherCode": "string",
        ///   }
        ///   Headers:
        ///   Authorization: Bearer {token}
        ///   Role:
        ///   Customer
        /// </remarks>
        /// <response code="200">Returns a success message if the voucher is applied successfully.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="401">If the user is not authenticated.</response>
        /// <response code="500">If an unexpected error occurs.</response>
        [HttpPost("apply-voucher")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> ApplyVoucher([FromBody] ApplyVoucherCommand command, CancellationToken cancellationToken)
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

            command = command with { UsrId = userId };

            var validator = new ApplyVoucherCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Apply voucher successfully", data = result.Value });
        }

        /// <summary>
        /// Change password by forgot password.
        /// </summary>
        /// <param name="command">Request containing the new password.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a success message if the password is changed successfully.</returns>
        /// <remarks>
        /// Sample request:
        ///   POST /api/User/change-password-forgot
        ///   {
        ///   "forgotPasswordToken": "string",
        ///   "newPassword": "string",
        ///   "confirmPassword": "string",
        ///   }
        ///   
        /// </remarks>
        /// <response code="200">Returns a success message if the password is changed successfully.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="401">If the user is not authenticated.</response>
        /// <response code="500">If an unexpected error occurs.</response>
        [HttpPost("change-password-forgot")]
        public async Task<IActionResult> ChangePasswordForgot([FromBody] ChangePasswordForgotCommand command, CancellationToken cancellationToken)
        {
            var validator = new ChangePasswordForgotCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Change password by forgot password successfully" });
        }

        /// <summary>
        /// Use voucher to order.
        /// </summary>
        /// <param name="command">Request containing the order ID and voucher ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a success message if the voucher is used successfully.</returns>
        /// <remarks>
        /// Sample request:
        ///   POST /api/User/use-voucher
        ///   {
        ///   "orderId": "string",
        ///   "voucherCode": "string",
        ///   }
        ///   Headers:
        ///   Authorization: Bearer {token}
        ///   Role:
        ///   Customer
        /// </remarks>
        /// <response code="200">Returns a success message if the voucher is used successfully.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="401">If the user is not authenticated.</response>
        /// <response code="500">If an unexpected error occurs.</response>
        [HttpPost("use-voucher")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> UseVoucher([FromBody] UseVoucherCommand command, CancellationToken cancellationToken)
        {
            var validator = new UseVoucherCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error.Description });
            }

            return Ok(new { statusCode = 200, message = "Use voucher successfully" });
        }

        /// <summary>
        /// Get User Quiz History.
        /// </summary>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a list of user quiz history.</returns>
        /// <remarks>
        /// Sample request:
        ///   GET /api/User/quiz-history
        ///   Headers:
        ///   Authorization: Bearer {token}
        ///   Role:
        ///   Customer
        /// </remarks>
        /// <response code="200">Returns a list of user quiz history.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="401">If the user is not authenticated.</response>
        /// <response code="500">If an unexpected error occurs.</response>
        [HttpGet("quiz-history")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> GetUserQuizHistory([FromQuery] string? keyword, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            try
            {
                var usrID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(usrID))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.MISSING_USER_ID });
                }

                if (!long.TryParse(usrID, out var userId))
                {
                    return Unauthorized(new { statusCode = 401, message = IConstantMessage.INTERNAL_SERVER_ERROR });
                }

                if (page <= 0 || pageSize <= 0)
                {
                    return BadRequest(new { statusCode = 400, message = "Page and limit must be greater than 0." });
                }

                PaginationParams paginationParams = new() { Page = page, PageSize = pageSize };

                var query = new GetUserQuizHistoryQuery(userId, keyword, paginationParams);
                var result = await _mediator.Send(query, cancellationToken);

                if (!result.IsSuccess)
                {
                    return BadRequest(new { statusCode = 400, message = result.Error.Description });
                }

                return Ok(new { statusCode = 200, message = "Get user quiz history successfully", data = result.Value });

            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.Message);
                return StatusCode(500, new { statusCode = 500, message = "An unexpected error occurred." });
            }
        }
        
    }
}