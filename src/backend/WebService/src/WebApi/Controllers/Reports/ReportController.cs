using Application.Attributes;
using Application.Auth.Commands;
using Application.Common.Enum;
using Application.Constant;
using Application.Features.Products.Queries;
using Application.Features.ReportsService.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Reports
{
    [Route("api/[controller]")]
    public class ReportController : ApiController
    {
        public ReportController(IMediator mediator) : base(mediator)
        {
        }

        /// <summary>
        /// Get sales summary report
        /// </summary>
        /// <param name="request">Sales summary report details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Sales summary report data.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/Report/sales-summary?startDate=2021-01-01&endDate=2021-12-31
        /// </remarks>
        [HttpGet("sales-summary")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> GetSalesSummary([FromQuery] GetSalesSummaryQuery request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_SALES_SUMMARY_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Get DailySales report
        /// </summary>
        /// <param name="request">DailySales report details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>DailySales report data.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/Report/daily-sales?startDate=2021-01-01&endDate=2021-12-31
        /// </remarks>
        [HttpGet("daily-sales")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> GetDailySales([FromQuery] GetDailySalesQuery request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_SALES_SUMMARY_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Get Top Saling Products report
        /// </summary>
        /// <param name="request">MonthlySales report details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>MonthlySales report data.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/Report/top-saling-products?startDate=2021-01-01&endDate=2021-12-31
        /// </remarks>
        [HttpGet("top-saling-products")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> GetTopSalingProducts([FromQuery] GetTopSellingProductQuery request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_SALES_SUMMARY_SUCCESS, data = result.Value });
        }

        /// <summary>
        /// Get user overview report
        /// </summary>
        /// <param name="request">User overview report details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>User overview report data.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/Report/user-overview?fromtDate=2021-01-01&toDate=2021-12-31
        ///     
        /// </remarks>
        [HttpGet("user-overview")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager)]
        public async Task<IActionResult> GetUserOverview([FromQuery] GetUserOverviewQuery request, CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(request, cancellationToken);
            return result.IsFailure ? HandleFailure(result) : Ok(new { statusCode = 200, message = IConstantMessage.GET_USER_SUMMARY_SUCCESS, data = result.Value });
        }
    }
}