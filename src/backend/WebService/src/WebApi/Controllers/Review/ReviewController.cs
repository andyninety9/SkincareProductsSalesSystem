
using Application.Constant;
using Application.Features.Reviews.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Review
{
    /// <summary>
    /// Review Controller for managing product reviews.
    /// Provides endpoints for deleting reviews.
    /// </summary>
    [Route("api/[controller]")]
    public class ReviewController : ApiController
    {
        public ReviewController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Deletes a review by changing its status.
        /// </summary>
        /// <param name="request">Request containing the review ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the deletion process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /api/review/delete
        ///     {
        ///         "reviewId": 12345
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        ///
        /// Role:
        /// - Manager
        /// - Staff
        /// </remarks>
        [HttpDelete("delete")]
        public async Task<IActionResult> ChangeStatus([FromBody] DeleteReviewCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.DELETE_REVIEW_SUCCESS, data = result.Value });
        }
    }
}