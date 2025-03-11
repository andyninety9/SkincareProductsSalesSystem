using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.Enum;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.Products.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.ProductCategory.Commands
{
    public sealed record DeleteProductCommand
    (
        long ProdId
    ) : ICommand<DeleteProductResponse>;

    internal sealed class DeleteProductCommandHandler : ICommandHandler<DeleteProductCommand, DeleteProductResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteProductCommandHandler> _logger;
        private readonly IProductRepository _productRepository;

        public DeleteProductCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteProductCommandHandler> logger,
            IProductRepository productRepository)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<DeleteProductResponse>> Handle(DeleteProductCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(command.ProdId, cancellationToken);
                if (product == null)
                {
                    return Result<DeleteProductResponse>.Failure<DeleteProductResponse>(new Error("ProductNotFound", "Product not found"));
                }

                product.ProdStatusId = (short)ProductStatusEnum.Discontinued;
                product.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
                _productRepository.Update(product);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<DeleteProductResponse>.Success(_mapper.Map<DeleteProductResponse>(product));
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occured while deleting product");
                return Result<DeleteProductResponse>.Failure<DeleteProductResponse>(new Error("ProductCategory.CreateError", ex.Message));
            }
           
        }
        

    }
}
