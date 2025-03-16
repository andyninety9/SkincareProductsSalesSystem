using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Features.Events.Commands;
using Application.Features.Events.Queries;
using Application.Features.Events.Queries.Validator;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Events
{
    /// <summary>
    /// Events Controller for managing event-related operations.
    /// Provides endpoints for retrieving event lists and fetching event details.
    /// </summary>
    [Route("api/[controller]")]
    public class EventsController : ApiController
    {

        private readonly ILogger<EventsController> _logger;
        public EventsController(IMediator mediator, ILogger<EventsController> logger) : base(mediator)
        {
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a paginated list of events based on filters.
        /// </summary>
        /// <param name="keyword">Optional keyword to filter events.</param>
        /// <param name="status">Optional status filter (true for active, false for inactive).</param>
        /// <param name="fromDate">Optional start date filter (format: yyyy-MM-dd).</param>
        /// <param name="toDate">Optional end date filter (format: yyyy-MM-dd).</param>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="pageSize">Number of records per page (default: 10).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of events matching the filters.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/Events?keyword=string&fromDate=2021-01-01&toDate=2021-01-31&status=true&page=1&pageSize=10
        ///
        /// </remarks>
        [HttpGet]
        public async Task<IActionResult> GetEvents(
            [FromQuery] string? keyword,
            [FromQuery] bool? status,
            [FromQuery] string? fromDate,
            [FromQuery] string? toDate,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Received GET /api/events request with params: Keyword={Keyword}, Status={Status}, FromDate={FromDate}, ToDate={ToDate}, Page={Page}, PageSize={PageSize}",
                keyword, status, fromDate, toDate, page, pageSize);

            if (page <= 0 || pageSize <= 0)
            {
                _logger.LogWarning("BadRequest: Invalid pagination parameters. Page={Page}, PageSize={PageSize}", page, pageSize);
                return BadRequest(new { statusCode = 400, message = "Page and pageSize must be greater than 0." });
            }

            DateTime? parsedFromDate = string.IsNullOrWhiteSpace(fromDate) ? null : DateTime.Parse(fromDate);
            DateTime? parsedToDate = string.IsNullOrWhiteSpace(toDate) ? null : DateTime.Parse(toDate);

            var paginationParams = new PaginationParams { Page = page, PageSize = pageSize };

            var query = new GetAllEventsQuery(keyword, status, parsedFromDate, parsedToDate, paginationParams);

            var validator = new GetAllEventsQueryValidator();
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

            _logger.LogInformation("Returning {EventCount} events for page {Page}.", result.Value.Items.Count, page);

            return Ok(new { statusCode = 200, message = "Fetch all events successfully", data = result.Value });
        }

        /// <summary>
        /// Retrieves details of a specific event by its ID.
        /// </summary>
        /// <param name="eventId">The ID of the event.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the details of the requested event.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/events/{eventId}
        ///
        /// </remarks>
        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetEventDetailById([FromRoute] int eventId, CancellationToken cancellationToken = default)
        {
            var query = new GetEventDetailByIdQuery(eventId);

            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Query failed with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Returning event with ID {EventId}.", eventId);

            return Ok(new { statusCode = 200, message = "Fetch event by ID successfully", data = result.Value });
        }

        /// <summary>
        /// Creates a new event.
        /// </summary>
        /// <param name="command">The command to create a new event.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the ID of the newly created event.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/events
        ///     {
        ///     "eventName": "string",
        ///     "startTime": "2021-01-01T00:00:00",
        ///     "endTime": "2021-01-01T00:00:00",
        ///     "eventDesc": "string",
        ///     "discountPercent": 35.5,
        ///     "statusEvent": true
        ///     }
        ///     
        /// </remarks>
        [HttpPost]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventCommand command, CancellationToken cancellationToken = default)
        {
            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Command failed with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Created new event with ID {EventId}.", result.Value);

            return Ok(new { statusCode = 200, message = "Create event successfully", data = result.Value });
        }


    }
}