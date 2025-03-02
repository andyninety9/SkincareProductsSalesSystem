using Application.Common.Paginations;
using Application.Features.SkinTypes.Queries;
using Application.Features.SkinTypes.Queries.Validator;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Skintypes
{
    /// <summary>
    ///  Skintypes Controller for handling skin types-related operations.
    /// <summary/> 
    [ApiController]
    [Route("api/[controller]")]
    public class SkintypeController : ApiController
    {
        private readonly ILogger<SkintypeController> _logger;
        public SkintypeController(IMediator mediator, ILogger<SkintypeController> logger) : base(mediator)
        {
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all skin types.
        /// </summary>
        /// <returns>Collection of skin types.</returns>
        /// <response code="200">Returns the collection of skin types.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="500">If an error occurs while processing the request.</response>
        /// <remarks>
        /// Sample request:
        ///     GET /api/skintype?keyword=Oily&page=1&pageSize=10
        /// </remarks>
        /// <response code="200">Returns the collection of skin types.</response>
        /// <response code="400">If the request is invalid.</response>
        /// <response code="500">If an error occurs while processing the request.</response>
        /// <returns>Collection of skin types.</returns>
        [HttpGet]
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllSkinTypes(
            [FromQuery] string? keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Received GET /api/skintype request with params: Keyword={Keyword}, Page={Page}, PageSize={PageSize}",
                keyword, page, pageSize);

            if (page <= 0 || pageSize <= 0)
            {
                _logger.LogWarning("BadRequest: Invalid pagination parameters. Page={Page}, PageSize={PageSize}", page, pageSize);
                return BadRequest(new { statusCode = 400, message = "Page and pageSize must be greater than 0." });
            }

            var paginationParams = new PaginationParams { Page = page, PageSize = pageSize };
            var query = new GetAllSkinTypesQuery(keyword, paginationParams);
            var validator = new GetAllSkinTypesQueryValidator();
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
                _logger.LogWarning("BadRequest: Query failed with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Returning {SkinTypeCount} products for page {Page}.", result.Value.Items.Count, page);
            return Ok(new { statusCode = 200, message = "Fetch all Skin types successfully", data = result.Value });
        }
    }
}