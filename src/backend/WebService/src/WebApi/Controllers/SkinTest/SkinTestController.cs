using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        // GET /api/skin-test/start 
        // Header: Authorization: Bearer token
        [HttpGet("start")]
        [Authorize]
        public async Task<IActionResult> StartSkinTest(CancellationToken cancellationToken = default)
        {
            var query = new GetStartQuestionQuery();
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(new { statusCode = 200, message = "Get start question successfully", data = result.Value });
        }

        // GET /api/skin-test/next?questionId=int&answerId=int
        [HttpGet("next")]
        public async Task<IActionResult> NextQuestion(
            [FromQuery] long userId,
            [FromQuery] int questionId,
            [FromQuery] int answerId,
            CancellationToken cancellationToken = default)
        {
            var query = new GetNextQuestionQuery(userId, questionId, answerId);
            var result = await _mediator.Send(query, cancellationToken);
            return Ok(new { statusCode = 200, message = "Get next question successfully", data = result.Value });
        }

    }
}