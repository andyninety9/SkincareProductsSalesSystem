using Application.Common.Paginations;
using Application.Features.Events.Queries;
using Application.Features.Events.Queries.Validator;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Events
{
    [Route("api/[controller]")]
    public class EventsController : ApiController
    {
        private readonly ILogger<EventsController> _logger;
        public EventsController(IMediator mediator, ILogger<EventsController> logger) : base(mediator)
        {
            _logger = logger;
        }

        // GET: api/Events?keyword=string&fromDate=2021-01-01&toDate=2021-01-31&status=1&page=1&pageSize=10
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
            // ✅ Logging request params
            _logger.LogInformation("Received GET /api/events request with params: Keyword={Keyword}, Status={Status}, FromDate={FromDate}, ToDate={ToDate}, Page={Page}, PageSize={PageSize}",
                keyword, status, fromDate, toDate, page, pageSize);

            // ✅ Kiểm tra giá trị phân trang hợp lệ
            if (page <= 0 || pageSize <= 0)
            {
                _logger.LogWarning("BadRequest: Invalid pagination parameters. Page={Page}, PageSize={PageSize}", page, pageSize);
                return BadRequest(new { statusCode = 400, message = "Page and pageSize must be greater than 0." });
            }

            // ✅ Chuyển đổi `fromDate` và `toDate` từ `string` sang `DateTime?`
            DateTime? parsedFromDate = string.IsNullOrWhiteSpace(fromDate) ? null : DateTime.Parse(fromDate);
            DateTime? parsedToDate = string.IsNullOrWhiteSpace(toDate) ? null : DateTime.Parse(toDate);

            // ✅ Tạo `PaginationParams` để truyền vào query
            var paginationParams = new PaginationParams { Page = page, PageSize = pageSize };

            // ✅ Khởi tạo Query
            var query = new GetAllEventsQuery(keyword, status, parsedFromDate, parsedToDate, paginationParams);

            // ✅ Validate Query Parameters
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

            // ✅ Gọi MediatR để xử lý query
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Query failed with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            // ✅ Logging response
            _logger.LogInformation("Returning {EventCount} events for page {Page}.", result.Value.Items.Count, page);

            return Ok(new { statusCode = 200, message = "Fetch all events successfully", data = result.Value });
        }

        // GET: api/events/{eventId}
        [HttpGet("{eventId}")]
        public async Task<IActionResult> GetEventDetailById([FromRoute] int eventId, CancellationToken cancellationToken = default)
        {
            // ✅ Logging request params
            _logger.LogInformation("Received GET /api/events/{eventId} request with params: EventId={EventId}", eventId);

            // ✅ Khởi tạo Query
            var query = new GetEventDetailByIdQuery(eventId);

            // ✅ Gọi MediatR để xử lý query
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Query failed with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            // ✅ Logging response
            _logger.LogInformation("Returning event with ID {EventId}.", eventId);

            return Ok(new { statusCode = 200, message = "Fetch event by ID successfully", data = result.Value });
        }

        
    }
}