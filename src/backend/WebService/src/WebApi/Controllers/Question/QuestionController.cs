using Application.Attributes;
using Application.Auth.Commands;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Constant;
using Application.Features.Question.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Question
{
    /// <summary>
    /// Question Controller for managing questions.
    /// Provides endpoints for creating, updating, and deleting questions.
    /// </summary>
    [Route("api/[controller]")]
    public class QuestionController : ApiController
    {
        private readonly ILogger<QuestionController> _logger;
        public QuestionController(IMediator mediator, ILogger<QuestionController> logger) : base(mediator)
        {
            _logger = logger;
        }

        /// <summary>
        /// Creates a new question.
        /// </summary>
        /// <param name="request">Question creation request containing category ID and question content.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created question details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/Question/create
        ///     {
        ///         "cateQuestionId": 1,
        ///         "questionContent": "What is AI?"
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Admin
        /// </remarks>
        [HttpPost("create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> Create([FromBody] CreateQuestionCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.CREATE_QUESTION_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Deletes a question.
        /// </summary>
        /// <param name="request">Deletion request containing the question ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the deletion process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /api/Question/delete
        ///     {
        ///         "questionId": 1
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Admin
        /// </remarks>
        [HttpDelete("delete")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> Delete([FromBody] DeleteQuestionCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.DELETE_QUESTION_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Updates an existing question.
        /// </summary>
        /// <param name="request">Update request containing question ID, category ID, and updated content.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated question details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/Question/update
        ///     {
        ///         "questionId": 1,
        ///         "cateQuestionId": 2,
        ///         "questionContent": "What is Machine Learning?"
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Admin
        /// </remarks>
        [HttpPost("update")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> Update([FromBody] UpdateQuestionCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.UPDATE_QUESTION_SUCCESS, data = result.Value });

        }

        /// <summary>
        /// Gets a list of questions.
        /// </summary>
        /// API: /api/Question/get-all?keyword=&cateQuestionId=&page=&pageSize=
        /// <param name="keyword">Keyword to search for.</param>
        /// <param name="cateQuestionId">Category ID to filter by.</param>
        /// <param name="page">Page number.</param>
        /// <param name="pageSize">Number of items per page.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a list of questions.</returns>
        /// <remarks>
        /// Sample request:
        ///     GET /api/Question/get-all?keyword=&cateQuestionId=&page=&pageSize=
        ///     Headers:
        ///     - Authorization: Bearer {token}
        ///     Role:
        ///     - Manager
        ///     - Staff

        /// </remarks>
        [HttpGet("get-all")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> GetAll([FromQuery] string? keyword, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            PaginationParams paginationParams = new() { Page = page, PageSize = pageSize };

            // var query = new GetAllProductCategoryQuery(keyword, paginationParams);
            // var result = await _mediator.Send(request, cancellationToken);
            // return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_QUESTION_SUCCESS, data = result.Value });
            return Ok();
        }
        

    }   
}