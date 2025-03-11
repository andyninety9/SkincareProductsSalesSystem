using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using Application.Features.Products.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.ProductCategory.Commands
{
    public sealed record UpdateProductCommand
    (
        long ProductId,
        string? ProductName,
        string? ProductDesc,
        int? Stocks,
        double? CostPrice,
        double? SellPrice,
        string? Ingredient,
        string? Instruction,
        short? ProdStatusId,
        string? ProdUseFor,
        short? CateId,
        long? BrandId
    ) : ICommand<CreateNewProductResponse>;

    internal sealed class UpdateProductCommandHandler : ICommandHandler<UpdateProductCommand, CreateNewProductResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UpdateProductCommandHandler> _logger;
        private readonly IProductRepository _productRepository;

        public UpdateProductCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UpdateProductCommandHandler> logger,
            IProductRepository productRepository)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<CreateNewProductResponse>> Handle(UpdateProductCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(command.ProductId, cancellationToken);
                if (product == null)
                {
                    return Result<CreateNewProductResponse>.Failure<CreateNewProductResponse>(new Error("Product not found", "The product with the specified ID could not be found."));
                }

                if (command.ProductName != null)
                {
                    product.ProductName = command.ProductName;
                }

                if (command.ProductDesc != null)
                {
                    product.ProductDesc = command.ProductDesc;
                }

                if (command.Stocks != null)
                {
                    product.Stocks = command.Stocks.Value;
                }

                if (command.CostPrice != null)
                {
                    product.CostPrice = command.CostPrice.Value;
                }

                if (command.SellPrice != null)
                {
                    product.SellPrice = command.SellPrice.Value;
                }

                if (command.Ingredient != null)
                {
                    product.Ingredient = command.Ingredient;
                }

                if (command.Instruction != null)
                {
                    product.Instruction = command.Instruction;
                }

                if (command.ProdStatusId != null)
                {
                    product.ProdStatusId = command.ProdStatusId.Value;
                }

                if (command.ProdUseFor != null)
                {
                    product.ProdUseFor = command.ProdUseFor;
                }

                if (command.CateId != null)
                {
                    product.CateId = command.CateId.Value;
                }

                if (command.BrandId != null)
                {
                    product.BrandId = command.BrandId.Value;
                }

                product.UpdatedAt = DateTime.Now;

                _productRepository.Update(product);
                await _unitOfWork.CommitAsync(cancellationToken);

                return Result<CreateNewProductResponse>.Success<CreateNewProductResponse>(_mapper.Map<CreateNewProductResponse>(product));
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occured while updating product");
                return Result<CreateNewProductResponse>.Failure<CreateNewProductResponse>(new Error("Error occured while updating product", e.Message));
            }
            
           
        }

    }
}
