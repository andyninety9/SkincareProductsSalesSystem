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
        public QuestionController(IMediator mediator) : base(mediator)
        {
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
    }   
}