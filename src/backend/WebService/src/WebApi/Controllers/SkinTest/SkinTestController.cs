using System.Security.Claims;
using Application.Constant;
using Application.Features.SkinTest.Queries;
using Application.Features.SkinTest.Queries.Validators;
using Application.SkinTest.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.SkinTest
{
    /// <summary>
    /// Skin Test Controller for handling skin type assessment tests.
    /// Provides endpoints for starting a test, retrieving the next question, and getting the final result.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SkinTestController : ApiController
    {
        public SkinTestController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Starts a new skin test.
        /// </summary>
        /// <param name="quizname">Optional quiz name. Defaults to "Baumann Skin Type Test".</param>
        /// <param name="quizdesc">Optional quiz description. Defaults to "Determine skin type using Baumann method".</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the first question of the test.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/skin-test/start?quizname=Baumann&quizdesc=Skin%20Type%20Test
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Retrieves the next question in the skin test based on the previous answer.
        /// </summary>
        /// <param name="questionId">ID of the previous question.</param>
        /// <param name="answerKeyId">ID of the selected answer.</param>
        /// <param name="quizId">ID of the current quiz session.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the next question in the quiz.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/skin-test/next?questionId=2&answerKeyId=3&quizId=101
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Retrieves the result of the completed skin test.
        /// </summary>
        /// <param name="quizId">ID of the quiz session.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the final assessment result of the skin test.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/skin-test/result?quizId=101
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpGet("result")]
        [Authorize]
        public async Task<IActionResult> GetResult(
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

            if (string.IsNullOrEmpty(quizId))
            {
                return BadRequest(new { statusCode = 400, message = "Quiz ID is required" });
            }

            if (!long.TryParse(quizId, out var parsedQuizId))
            {
                return BadRequest(new { statusCode = 400, message = "Invalid Quiz ID format" });
            }

            var query = new GetQuizResultQuery(userId, parsedQuizId);
            var validator = new GetQuizResultQueryValidator();
            var validationResult = await validator.ValidateAsync(query, cancellationToken);

            if (!validationResult.IsValid)
            {
                return BadRequest(new { statusCode = 400, message = validationResult.Errors.First().ErrorMessage });
            }

            var result = await _mediator.Send(query, cancellationToken);
            return Ok(new { statusCode = 200, message = "Get result successfully", data = result.Value });
        }

    }
    
    
}