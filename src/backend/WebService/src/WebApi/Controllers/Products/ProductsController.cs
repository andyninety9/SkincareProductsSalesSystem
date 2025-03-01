using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Features.ProductCategory.Commands;
using Application.Features.ProductCategory.Commands.Validator;
using Application.Features.ProductCategory.Queries;
using Application.Features.ProductCategory.Queries.Validator;
using Application.Features.Products.Commands;
using Application.Features.Products.Commands.Validator;
using Application.Features.Products.Queries;
using Application.Features.Products.Queries.Validator;
using Application.Features.Reviews.Queries;
using Application.Features.Reviews.Queries.Validator;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Common;

namespace WebApi.Controllers.Products
{
    /// <summary>
    ///  Products Controller for handling product-related operations.
    /// <summary/> 
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



        /// <summary>
        /// Retrieves a paginated list of products based on filters.
        /// </summary>
        /// <param name="keyword">Optional search keyword for product name.</param>
        /// <param name="cateId">Optional category ID filter.</param>
        /// <param name="brandId">Optional brand ID filter.</param>
        /// <param name="fromDate">Optional start date filter (yyyy-MM-dd).</param>
        /// <param name="toDate">Optional end date filter (yyyy-MM-dd).</param>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="pageSize">Number of records per page (default: 10).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of products matching the filters.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/products?keyword=laptop&cateId=1&brandId=2&fromDate=2023-01-01&toDate=2023-12-31&page=1&pageSize=10
        ///
        /// </remarks>
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

        /// <summary>
        /// Retrieves details of a specific product by its ID.
        /// </summary>
        /// <param name="id">The ID of the product.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the details of the requested product.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/products/{id}
        ///
        /// </remarks>
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

        /// <summary>
        /// Retrieves product reviews based on filters.
        /// </summary>
        /// <param name="id">The ID of the product.</param>
        /// <param name="keyword">Optional search keyword for reviews.</param>
        /// <param name="fromDate">Optional start date filter (yyyy-MM-dd).</param>
        /// <param name="toDate">Optional end date filter (yyyy-MM-dd).</param>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="pageSize">Number of records per page (default: 10).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of reviews for the specified product.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/products/{id}/reviews?keyword=good&fromDate=2023-01-01&toDate=2023-12-31&page=1&pageSize=10
        ///
        /// </remarks>
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

        /// <summary>
        /// Creates a new product category.
        /// </summary>
        /// <param name="command">Category creation request containing category name.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created category details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/products/category/create
        ///     {
        ///         "cateName": "Electronics"
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Updates an existing product category.
        /// </summary>
        /// <param name="command">Category update request containing category ID and new name.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated category details.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     POST /api/products/category/update
        ///     {
        ///         "id": 1,
        ///         "cateName": "Updated Category"
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
        [HttpPost("category/update")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> UpdateCategory([FromBody] UpdateProductCategoryCommand command, CancellationToken cancellationToken = default)
        {

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

        /// <summary>
        /// Deletes a product category.
        /// </summary>
        /// <param name="command">Category deletion request containing category ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the deletion process.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /api/products/category/delete
        ///     {
        ///         "id": 1
        ///     }
        ///
        /// Headers:
        /// - Authorization: Bearer {token}
        /// </remarks>
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

        /// <summary>
        /// Retrieves a paginated list of product categories.
        /// </summary>
        /// <param name="keyword">Optional search keyword for category name.</param>
        /// <param name="page">Page number for pagination (default: 1).</param>
        /// <param name="pageSize">Number of records per page (default: 10).</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns a paginated list of product categories.</returns>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/products/categories?keyword=electronics&page=1&pageSize=10
        ///
        /// </remarks>
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories([FromQuery] string? keyword, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {

            PaginationParams paginationParams = new() { Page = page, PageSize = pageSize };
            var query = new GetAllProductCategoryQuery(keyword, paginationParams);

            var validator = new GetAllProductCategoryQueryValidator();
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
                _logger.LogWarning("BadRequest: Query failed for GET /api/products/categories with error: {Error}", result.Error?.Description);
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            _logger.LogInformation("Returning {CategoryCount} categories.", result.Value.Items.Count);
            return Ok(new { statusCode = 200, message = "Fetch all categories successfully", data = result.Value });
        }

        /// <summary>
        /// uploads a product image.
        /// </summary>
        /// <param productId=long>The product id.</param>
        /// <param imageUrl="string">The image url file.</param>
        /// <param cancellationToken="CancellationToken">Cancellation token.</param>
        /// <returns>Returns the uploaded image url.</returns>
        /// <remarks>
        /// Sample request:
        ///    POST /api/products/upload-image
        ///    {
        ///    "imageUrl": "https://www.example.com/image.jpg"
        ///    }
        ///    Headers:
        ///    - Authorization: Bearer {token}
        ///    </remarks>
        [HttpPost("upload-image")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> UploadImage([FromBody] UploadProductImageUrlCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new UpdateProductImageCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            return Ok(new { statusCode = 200, message = "Upload image successfully", data = result.Value });
        }

        /// <summary>
        /// Deletes a product image.
        /// </summary>
        /// <param productId="long">Image deletion request containing product ID and imageId.</param>
        /// <param imageId="long">Image deletion request containing product ID and imageId.</param>
        /// <param cancellationToken="CancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the deletion process.</returns>
        /// <remarks>
        /// Sample request:
        ///   DELETE /api/products/delete-image
        ///   {
        ///   "productId": 1,
        ///   "imageId": 1
        ///   }
        ///   Headers:
        ///   - Authorization: Bearer {token}
        ///   </remarks>
        [HttpDelete("delete-image")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> DeleteImage([FromBody] DeleteProductImageUrlCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new DeleteProductImageCommandValidator();
            var validationResult = validator.Validate(command);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var result = await _mediator.Send(command, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            return Ok(new { statusCode = 200, message = "Delete image successfully", data = result.Value });
        }
        
    }
}
