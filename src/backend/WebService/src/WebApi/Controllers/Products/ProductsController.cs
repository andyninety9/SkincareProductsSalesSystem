using Application.Attributes;
using Application.Common.Enum;
using Application.Common.Paginations;
using Application.Features.Brands.Commands;
using Application.Features.Brands.Queries;
using Application.Features.Brands.Commands.Validators;
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
using Application.Constant;
using System.Security.Claims;
using Application.Features.Reviews.Commands.Validator;
using Application.Features.Reviews.Commands;
using Application.Features.RecommendForFeature.Commands;
using Application.Features.RecommendForFeature.Commands.Validators;

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
        /// <param name="skinTypeId">Optional Skintype filter.</param>
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
            [FromQuery] long? cateId,
            [FromQuery] long? brandId,
            [FromQuery] long? skinTypeId,
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
            var query = new GetAllProductsQuery(keyword, paginationParams, cateId, brandId, skinTypeId, fromDate, toDate);
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
        public async Task<IActionResult> GetProductById(long id, CancellationToken cancellationToken = default)
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
            long id,
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

        /// <summary>
        /// Creates a new product.
        /// </summary>
        /// <param name="command">Product creation request containing product details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created product details.</returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "cateId": 1,
        ///     "brandId": 1,
        ///     "productName": "Product Name",
        ///     "productDesc": "Product Description",
        ///     "stocks": 10,
        ///     "costPrice": 100.00,
        ///     "sellPrice": 150.00,
        ///     "totalRating": 0,
        ///     "ingredient": "Product Ingredient",
        ///     "instruction": "Product Instruction",
        ///     "prodUseFor": "Product Use For",
        ///     "prodStatusId": 1
        /// }
        /// Headers:
        /// - Authorization: Bearer {token}
        /// -Role: Manager, Staff
        /// </remarks>
        /// <returns></returns>
        [HttpPost("create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new CreateProductCommandValidator();
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

            return Ok(new { statusCode = 200, message = "Create product successfully", data = result.Value });
        }

        /// <summary>
        /// Updates an existing product.
        /// </summary>
        /// <param name="command">Product update request containing product details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the updated product details.</returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///    "productId": 1,
        ///    "cateId": 1,
        ///    "brandId": 1,
        ///    "productName": "Product Name",
        ///    "productDesc": "Product Description",
        ///    "stocks": 10,
        ///    "costPrice": 100.00,
        ///    "sellPrice": 150.00,
        ///    "totalRating": 0,
        ///    "ingredient": "Product Ingredient",
        ///    "instruction": "Product Instruction",
        ///    "prodUseFor": "Product Use For",
        ///    "prodStatusId": 1
        /// }
        /// Headers:
        /// - Authorization: Bearer {token}
        /// -Role: Manager, Staff
        /// </remarks>
        /// <returns></returns>
        [HttpPatch("update")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new UpdateProductCommandValidator();
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

            return Ok(new { statusCode = 200, message = "Update product successfully", data = result.Value });
        }

        /// <summary>
        /// Deletes a product.
        /// </summary>
        /// <param name="command">Product deletion request containing product ID.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the deletion process.</returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///     "productId": 1
        /// }
        /// Headers:
        /// - Authorization: Bearer {token}
        /// -Role: Manager, Staff
        /// </remarks>
        [HttpDelete("delete")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> DeleteProduct([FromBody] DeleteProductCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new DeleteProductCommandValidator();
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

            return Ok(new { statusCode = 200, message = "Delete product successfully", data = result.Value });
        }

        /// <summary>
        /// Get all product brands.
        /// </summary>
        /// <param name="command">Brand creation request containing brand name.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created brand details.</returns>
        /// <remarks>
        /// Sample request:
        ///   GET /api/products/brands?keyword=electronics&page=1&pageSize=10
        ///   
        /// </remarks>
        /// 
        [HttpGet("brands")]
        public async Task<IActionResult> GetBrands([FromQuery] string? keyword, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {

            PaginationParams paginationParams = new() { Page = page, PageSize = pageSize };
            var query = new GetAllProductBrandQuery(keyword, paginationParams);
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            return Ok(new { statusCode = 200, message = "Fetch all brands successfully", data = result.Value });
        }

        /// <summary>
        /// Creates a new product brand.
        /// </summary>
        /// <param name="command">Brand creation request containing brand name.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created brand details.</returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///    "brandName": "Brand Name"
        ///    "brandDesc": "Brand Description"
        ///    "brandOrigin": "Brand Origin"
        ///    "brandStatus": "true"
        /// }
        /// Headers:
        /// - Authorization: Bearer {token}
        /// -Role: Manager, Staff
        /// </remarks>
        /// <returns></returns>
        [HttpPost("brand/create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> CreateBrand([FromBody] CreateProductBrandCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new CreateProductBrandCommandValidator();
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

            return Ok(new { statusCode = 200, message = "Create brand successfully", data = result.Value });
        }

        /// <summary>
        ///  Updates an existing product brand. 
        ///  </summary>
        ///  <param name="command">Brand update request containing brand details.</param>
        ///  <param name="cancellationToken">Cancellation token.</param>
        ///  <returns>Returns the updated brand details.</returns>
        ///  <remarks>
        ///  Sample request:
        ///  {
        ///    "brandId": 1,
        ///    "brandName": "Brand Name"
        ///    "brandDesc": "Brand Description"
        ///    "brandOrigin": "Brand Origin"
        ///    "brandStatusId": "true"
        ///  }
        ///  Headers:
        ///  - Authorization: Bearer {token}
        ///  -Role: Manager, Staff
        ///  </remarks>
        ///  <returns></returns>
        [HttpPatch("brand/update")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> UpdateBrand([FromBody] UpdateProductBrandCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new UpdateProductBrandCommandValidator();
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

            return Ok(new { statusCode = 200, message = "Update brand successfully", data = result.Value });
        }

        /// <summary>
        /// Deletes a product brand.
        /// </summary>
        /// <param name="command">Brand deletion request containing brand ID.</param> 
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the status of the deletion process.</returns> 
        /// <remarks>
        /// Sample request:
        /// {
        ///    "brandId": 1
        /// }
        /// Headers:
        /// - Authorization: Bearer {token}
        /// -Role: Manager, Staff
        /// </remarks>
        [HttpDelete("brand/delete")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> DeleteBrand([FromBody] DeleteProductBrandCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new DeleteProductBrandValidator();
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

            return Ok(new { statusCode = 200, message = "Delete brand successfully", data = result.Value });
        }

        /// <summary>
        ///  Create user review
        ///  </summary>
        ///  <param name="command">Review creation request containing review details.</param>
        ///  <param name="cancellationToken">Cancellation token.</param>
        ///  <returns>Returns the created review details.</returns>
        ///  Headers:
        ///  - Authorization: Bearer {token}
        ///  -Role: Customer
        ///      <remarks>
        ///  Sample request:
        ///  {
        ///    "reviewContent": "Review Content",
        ///    "userId": "1" ,
        ///    "prodID": "1",
        ///    "rating": 5,
        ///   }   
        ///   
        ///  </remarks>
        ///  
        [HttpPost("review/create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Customer)]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewCommand command, CancellationToken cancellationToken = default)
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

            if (_mediator == null)
            {
                return StatusCode(500, new { statusCode = 500, message = IConstantMessage.INTERNAL_SERVER_MEDIATOR_ERROR });
            }
            var newCommand = command with { UserId = userId };


            var validator = new CreateProductReviewCommandValidator();

            var validationResult = validator.Validate(newCommand);

            if (!validationResult.IsValid)
            {
                return BadRequest(new
                {
                    statusCode = 400,
                    errors = validationResult.Errors.Select(e => new { param = e.PropertyName, message = e.ErrorMessage })
                });
            }

            var result = await _mediator.Send(newCommand, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            return Ok(new { statusCode = 200, message = "Create review successfully", data = result.Value });

        }

        /// <summary>
        /// Get Product Recommendation
        /// </summary>
        /// <param name="productId">The product id.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the recommended product details.</returns>
        /// <remarks>
        /// Sample request:
        ///   GET /api/products/recommendation/{productId}

        /// </remarks>
        ///     
        [HttpGet("recommendation/{productId}")]

        public async Task<IActionResult> GetProductRecommendation(long productId, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
        {
            PaginationParams paginationParams = new() { Page = page, PageSize = pageSize };

            var query = new GetProductRecommendationQuery(productId, paginationParams);
            var result = await _mediator.Send(query, cancellationToken);

            if (!result.IsSuccess)
            {
                return BadRequest(new { statusCode = 400, message = result.Error?.Description ?? "Unknown error occurred." });
            }

            return Ok(new { statusCode = 200, message = "Fetch product recommendation successfully", data = result.Value });
        }

        /// <summary>
        /// Add product recommendFor
        /// </summary>
        /// <param name="command">RecommendFor creation request containing recommendFor details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>Returns the created recommendFor details.</returns>
        /// <remarks>
        /// Sample request:
        /// {
        ///    "prodId": "string",
        ///    "skinTypeId": "string"
        /// }
        /// Headers:
        /// - Authorization: Bearer {token}
        /// -Role: Manager, Staff
        /// </remarks>
        /// <returns></returns>
        [HttpPost("recommendation/create")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> CreateRecommendFor([FromBody] CreateRecommendForCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new CreateRecommendForCommandValidator();
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

            return Ok(new { statusCode = 200, message = "Create recommendFor successfully", data = result.Value });
        }

        /// <summary>
        /// Deletes a product recommendFor.
        ///    </summary>
        ///    <param name="command">RecommendFor deletion request containing recommendFor ID.</param>
        ///    <param name="cancellationToken">Cancellation token.</param>
        ///    <returns>Returns the status of the deletion process.</returns>
        ///    <remarks>
        ///    Sample request:
        ///    {
        ///    "recForId": "string"
        ///    }
        ///    Headers:
        ///    - Authorization: Bearer {token}
        ///    -Role: Manager, Staff
        ///    </remarks>
        ///    <returns></returns>
        ///    
        [HttpDelete("recommendation/delete")]
        [Authorize]
        [AuthorizeRole(RoleAccountEnum.Manager, RoleAccountEnum.Staff)]
        public async Task<IActionResult> DeleteRecommendFor([FromBody] DeleteRecommendForCommand command, CancellationToken cancellationToken = default)
        {
            var validator = new DeleteRecommendForCommandValidator();
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

            return Ok(new { statusCode = 200, message = "Delete recommendFor successfully", data = result.Value });
        }

    }
}
