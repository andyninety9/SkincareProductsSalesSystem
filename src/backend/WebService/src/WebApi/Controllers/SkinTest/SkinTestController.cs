using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Constant;
using Application.Products.Queries;
using Application.SkinTest.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.SkinTest
{
    [ApiController]
    [Route("api/[controller]")]
    public class SkinTestController : ApiController
    {
        public SkinTestController(IMediator mediator) : base(mediator)
        {
        }

        // GET /api/skin-test/start?quizname=string&quizdesc=string 
        // Header: Authorization: Bearer token
        [HttpGet("start")]
        [Authorize]
        public async Task<IActionResult> StartSkinTest(
            [FromQuery] string quizname,
            [FromQuery] string quizdesc,
            CancellationToken cancellationToken = default)
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
            if (string.IsNullOrEmpty(quizname))
            {
                quizname = "Baumann Skin Type Test";
            }
            if (string.IsNullOrEmpty(quizdesc))
            {
                quizdesc = "Determine skin type using Baumann method.";
            }

            var query = new GetStartQuestionQuery(UserId: userId, QuizName: quizname, QuizDesc: quizdesc);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(new { statusCode = 200, message = "Get start question successfully", data = result.Value });
        }

        // GET /api/skin-test/next?questionId=int&answerKeyId=int?quizId=int
        [HttpGet("next")]
        [Authorize]
        public async Task<IActionResult> NextQuestion(
            [FromQuery] string questionId,
            [FromQuery] string answerKeyId,
            [FromQuery] string quizId,
            CancellationToken cancellationToken = default)
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
            var query = new GetNextQuestionQuery(userId, int.Parse(questionId), int.Parse(answerKeyId), int.Parse(quizId));
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(new { statusCode = 200, message = "Get next question successfully", data = result.Value });
        }

    }
}