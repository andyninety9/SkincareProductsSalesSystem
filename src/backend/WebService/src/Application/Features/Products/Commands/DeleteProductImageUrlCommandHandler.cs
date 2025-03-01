using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Products.Commands.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Products.Commands
{
    public sealed record DeleteProductImageUrlCommand
    (
        long ProductId,
        long ImageId
    ) : ICommand<DeleteProductImageResponse>;

    internal sealed class DeleteProductImageUrlCommandHandler : ICommandHandler<DeleteProductImageUrlCommand, DeleteProductImageResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteProductImageUrlCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IProductImageRepository _productImageRepository;
        private readonly IProductRepository _productRepository;

        public DeleteProductImageUrlCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteProductImageUrlCommandHandler> logger,
            IdGeneratorService idGenerator, IProductImageRepository productImageRepository, IProductRepository productRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
            _productImageRepository = productImageRepository;
            _productRepository = productRepository;
        }

        public async Task<Result<DeleteProductImageResponse>> Handle(DeleteProductImageUrlCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(command.ProductId, cancellationToken);
                if (product == null)
                {
                    return Result<DeleteProductImageResponse>.Failure<DeleteProductImageResponse>(new Error("ProductNotFound", "Product not found"));
                }

                var listProductImages = await _productImageRepository.GetAllAsync(cancellationToken);
                var productImagesByProductId = listProductImages.Where(x => x.ProdId == command.ProductId).ToList();
                var productImage = productImagesByProductId.FirstOrDefault(x => x.ProdImageId == command.ImageId);
                if (productImage == null)
                {
                    return Result<DeleteProductImageResponse>.Failure<DeleteProductImageResponse>(new Error("ProductImageNotFound", "Product image not found"));
                }

                await _productImageRepository.DeleteByIdAsync(command.ImageId, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                
                productImagesByProductId.Remove(productImage);
                List<ProductImageDto> productImages = new List<ProductImageDto>();
                foreach (var item in productImagesByProductId)
                {
                    productImages.Add(new ProductImageDto
                    {
                        ProdImageId = item.ProdImageId,
                        ProdImageUrl = item.ProdImageUrl
                    });
                    
                }
                return Result<DeleteProductImageResponse>.Success(new DeleteProductImageResponse
                {
                    ProductId = command.ProductId,
                    ProductImages = productImages
                });
            }
            catch (Exception e)
            {

                _logger.LogError(e, "❌ Error occurred while deleting product image: ImageId={ImageId}, ProductId={ProductId}", command.ImageId, command.ProductId);
                return Result<DeleteProductImageResponse>.Failure<DeleteProductImageResponse>(new Error("DeleteProductImageError", "Error occurred while deleting product image"));
            }
        }



    }
}
