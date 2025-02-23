using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.Products.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Products.Queries
{
    public sealed record GetProductByIdQuery(long ProductId) : IQuery<GetProductResponse>;

    internal sealed class GetProductByIdQueryHandler : IQueryHandler<GetProductByIdQuery, GetProductResponse>
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<GetProductByIdQueryHandler> _logger;

        public GetProductByIdQueryHandler(
            IProductRepository productRepository,
            IMapper mapper,
            ILogger<GetProductByIdQueryHandler> logger)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<GetProductResponse>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
        {
            _logger.LogInformation("Fetching product with ID: {ProductId}", request.ProductId);

            var product = await _productRepository.GetProductByIdAsync(request.ProductId, cancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product not found for ID: {ProductId}", request.ProductId);
                return Result<GetProductResponse>.Failure<GetProductResponse>(new Error("NotFound", "Product not found."));
            }

            var productResponse = _mapper.Map<GetProductResponse>(product);
            return Result<GetProductResponse>.Success(productResponse);
        }
    }
}
