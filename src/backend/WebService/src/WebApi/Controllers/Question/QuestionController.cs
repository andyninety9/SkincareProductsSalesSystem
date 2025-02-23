using Application.Attributes;
using Application.Auth.Commands;
using Application.Common.Enum;
using Application.Constant;
using Application.Features.Question.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Question
{
    [Route("api/[controller]")]
    public class QuestionController : ApiController
    {
        private readonly ILogger<QuestionController> _logger;
        public QuestionController(IMediator mediator, ILogger<QuestionController> logger) : base(mediator)
        {
            _logger = logger;
        }

        // POST: api/Question/create
        // {
        //    "cateQuestionId": 0,
        //     "questionContent": "string"
        // }
        // header: Authorization: Bearer token
        // Role: Admin
        [HttpPost("create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> Create([FromBody] CreateQuestionCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.CREATE_QUESTION_SUCCESS, data = result.Value });
        }

        // DELETE: api/Question/delete
        // {
        //     "questionId": 0
        // }
        // header: Authorization: Bearer token
        // Role: Admin

        [HttpDelete("delete")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> Delete([FromBody] DeleteQuestionCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.DELETE_QUESTION_SUCCESS, data = result.Value });
        }

        // POST: api/Question/update
        // {
        //     "questionId": 0,
        //     "cateQuestionId": 0,
        //     "questionContent": "string"
        // }
        // header: Authorization: Bearer token
        // Role: Admin
        [HttpPost("update")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> Update([FromBody] UpdateQuestionCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.UPDATE_QUESTION_SUCCESS, data = result.Value });
            
        }
    }   
}