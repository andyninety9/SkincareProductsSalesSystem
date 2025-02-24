using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Features.ProductCategory.Commands;
using Application.Features.ProductCategory.Commands.Validator;
using Application.Features.Products.Queries;
using Application.Features.Products.Queries.Validator;

// using Application.Features.Products.Queries.Validator;
using Application.Features.Reviews.Queries;
using Application.Features.Reviews.Queries.Validator;

// using Application.Features.Reviews.Queries.Validator;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Products
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ApiController
    {
        // private readonly IMediator _mediator;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IMediator mediator, ILogger<ProductsController> logger) : base(mediator)
        {
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
            // _logger.LogInformation("Received GET /api/products/{Id} request with Id={Id}", id);

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

        // ==========Reviews Management==========
        // GET: /api/products/{id}/reviews?keyword=string&fromDate=string&toDate=string&page=int&pageSize=int
        [HttpGet("{id}/reviews")]
        public async Task<IActionResult> GetProductReviews(
            int id,
            [FromQuery] string? keyword = null,
            [FromQuery] string? fromDate = null,
            [FromQuery] string? toDate = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            CancellationToken cancellationToken = default)
        {
            // _logger.LogInformation("Received GET /api/products/{ProductId}/reviews request with Id={ProductId}, Keyword={Keyword}, FromDate={FromDate}, ToDate={ToDate}, Page={Page}, PageSize={PageSize}",
            //     id, keyword, fromDate, toDate, page, pageSize);

            var paginationParams = new PaginationParams { Page = page, PageSize = pageSize };
            var query = new GetAllProductReviewQuery(keyword, paginationParams, id, fromDate, toDate);

            var validator = new GetProductReviewsQueryValidator();
            var validationResult = validator.Validate(query);

            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for GET /api/products/{ProductId}/reviews. Errors: {Errors}", id, validationResult.Errors);
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Query failed for GET /api/products/{ProductId}/reviews with error: {Error}", id, result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Returning {ReviewCount} reviews for product with Id={ProductId}.", result.Value.Items.Count, id);
            return Ok(new { statusCode = 200, message = "Fetch product reviews successfully", data = result.Value });
        }

        // POST: /api/products/category/create
        // Header: Authorization: Bearer {token}
        // Body: {cateName: string}
        // Role: Manager, Staff 
        [HttpPost("category/create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> CreateCategory([FromBody] CreateProductCategoryCommand command, CancellationToken cancellationToken = default)
        {
            // _logger.LogInformation("Received POST /api/products/category/create request with CategoryName={CategoryName}", command.CategoryName);

            var validator = new CreateProductCategoryCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for POST /api/products/category/create. Errors: {Errors}", validationResult.Errors);
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Command failed for POST /api/products/category/create with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Category created successfully with Id={CategoryId}.", result.Value);
            return Ok(new { statusCode = 200, message = "Create category successfully", data = result.Value });
        }

        // POST: /api/products/category/update
        // Header: Authorization: Bearer {token}
        // Body: {short: int, cateName: string}
        // Role: Manager, Staff
        [HttpPost("category/update")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> UpdateCategory([FromBody] UpdateProductCategoryCommand command, CancellationToken cancellationToken = default)
        {
            // _logger.LogInformation("Received POST /api/products/category/update request with Id={Id}, CategoryName={CategoryName}", command.Id, command.CategoryName);

            var validator = new UpdateProductCategoryCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for POST /api/products/category/update. Errors: {Errors}", validationResult.Errors);
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }


            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Command failed for POST /api/products/category/update with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Category updated successfully with Id={CategoryId}.", result.Value);
            return Ok(new { statusCode = 200, message = "Update category successfully", data = result.Value });
        }

        // DELETE: /api/products/category/delete
        // Header: Authorization: Bearer {token}
        // Body: {id: int}
        // Role: Manager, Staff
        [HttpDelete("category/delete")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> DeleteCategory([FromBody] DeleteProductCategoryCommand command, CancellationToken cancellationToken = default)
        {
            // _logger.LogInformation("Received DELETE /api/products/category/delete request with Id={Id}", command.Id);

            var validator = new DeleteProductCategoryCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                _logger.LogWarning("Validation failed for DELETE /api/products/category/delete. Errors: {Errors}", validationResult.Errors);
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("BadRequest: Command failed for DELETE /api/products/category/delete with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Category deleted successfully with Id={CategoryId}.", result.Value);
            return Ok(new { statusCode = 200, message = "Delete category successfully", data = result.Value });

        }
    }
}
