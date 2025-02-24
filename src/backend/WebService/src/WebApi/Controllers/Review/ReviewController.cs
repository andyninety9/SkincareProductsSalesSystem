
using Application.Constant;
using Application.Features.Reviews.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Review
{
    [Route("api/[controller]")]
    public class ReviewController : ApiController
    {
        public ReviewController(IMediator mediator) : base(mediator)
        {
        }

        // PATCH: api/review/delete
        // Header: Authorization: Bearer {token}
        // Role: Manage, Staff
        // Body{long reviewId}

        [HttpDelete("delete")]
        public async Task<IActionResult> ChangeStatus([FromBody] DeleteReviewCommand request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.DELETE_REVIEW_SUCCESS, data = result.Value });
        }
    }
}