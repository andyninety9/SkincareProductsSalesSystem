using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.Products.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Products.Commands
{
    public sealed record UploadProductImageUrlCommand
    (
        long ProductId,
        string ImageUrl
    ) : ICommand<UpdateProductImageResponse>;

    internal sealed class UploadProductImageUrlCommandHandler : ICommandHandler<UploadProductImageUrlCommand, UpdateProductImageResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UploadProductImageUrlCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IProductImageRepository _productImageRepository;
        private readonly IProductRepository _productRepository;

        public UploadProductImageUrlCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UploadProductImageUrlCommandHandler> logger,
            IdGeneratorService idGenerator, IProductImageRepository productImageRepository, IProductRepository productRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
            _productImageRepository = productImageRepository;
            _productRepository = productRepository;
        }

        public async Task<Result<UpdateProductImageResponse>> Handle(UploadProductImageUrlCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(command.ProductId, cancellationToken);
                if (product == null)
                {
                    return Result<UpdateProductImageResponse>.Failure<UpdateProductImageResponse>(new Error("ProductNotFound", "Product not found"));
                }
                var listImageProducts = await _productImageRepository.GetAllAsync(cancellationToken);
                List<ProductImage> productImagesByProductId = listImageProducts.Where(x => x.ProdId == command.ProductId).ToList();
                if (productImagesByProductId.Count() > 5)
                {
                    return Result<UpdateProductImageResponse>.Failure<UpdateProductImageResponse>(new Error("ProductImageLimit", "You can only upload 5 images for a product"));
                }
                else
                {
                    var productImage = new ProductImage
                    {
                        ProdImageId = _idGenerator.GenerateLongId(),
                        ProdId = command.ProductId,
                        ProdImageUrl = command.ImageUrl
                    };
                    await _productImageRepository.AddAsync(productImage, cancellationToken);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                    return Result<UpdateProductImageResponse>.Success(new UpdateProductImageResponse
                    {
                        ProductId = productImage.ProdId,
                        ImageUrl = productImage.ProdImageUrl
                    });
                }


            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while uploading product image");
                return Result<UpdateProductImageResponse>.Failure<UpdateProductImageResponse>(new Error("UploadProductImageError", "Error occurred while uploading product image"));
            }
        }

    }
}
