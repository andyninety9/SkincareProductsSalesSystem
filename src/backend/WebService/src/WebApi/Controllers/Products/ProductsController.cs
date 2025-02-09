using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Paginations;
using Application.Features.Products.Queries.Validator;
using Application.Features.Products.Validator;
using Application.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers.Products
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IMediator mediator, ILogger<ProductsController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: /api/products?keyword=string&cateId=int&brandId=int&fromDate=string&toDate=string&page=int&pageSize=int
        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? keyword,
            [FromQuery] int? cateId,
            [FromQuery] int? brandId,
            [FromQuery] string? fromDate,
            [FromQuery] string? toDate,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Received GET /api/products request with params: Keyword={Keyword}, CateId={CateId}, BrandId={BrandId}, FromDate={FromDate}, ToDate={ToDate}, Page={Page}, PageSize={PageSize}",
                keyword, cateId, brandId, fromDate, toDate, page, pageSize);

            if (page <= 0 || pageSize <= 0)
            {
                _logger.LogWarning("BadRequest: Invalid pagination parameters. Page={Page}, PageSize={PageSize}", page, pageSize);
                return BadRequest(new { statusCode = 400, message = "Page and pageSize must be greater than 0." });
            }

            var paginationParams = new PaginationParams { Page = page, PageSize = pageSize };
            var query = new GetAllProductsQuery(keyword, paginationParams, cateId, brandId, fromDate, toDate);
            var validator = new GetAllProductsQueryValidator();
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

            _logger.LogInformation("Returning {ProductCount} products for page {Page}.", result.Value.Items.Count, page);
            return Ok(new { statusCode = 200, message = "Fetch all products successfully", data = result.Value });
        }

        // GET: /api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id, CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Received GET /api/products/{Id} request with Id={Id}", id);

            var query = new GetProductByIdQuery(id);
            var validator = new GetProductQueryValidator();
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

            if (result.Value == null)
            {
                _logger.LogWarning("NotFound: Product with Id={Id} not found.", id);
                return NotFound(new { statusCode = 404, message = $"Product with Id={id} not found." });
            }

            _logger.LogInformation("Returning product with Id={Id}.", id);
            return Ok(new { statusCode = 200, message = "Fetch product by Id successfully", data = result.Value });
        }
    }
}
