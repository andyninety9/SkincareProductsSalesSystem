using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.ProductCategory.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.ProductCategory.Commands
{
    public sealed record UpdateProductCategoryCommand
    (
        short CategoryId,
        string CategoryName
    ) : ICommand<CreateProductResponse>;

    internal sealed class UpdateProductCategoryCommandHandler : ICommandHandler<UpdateProductCategoryCommand, CreateProductResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UpdateProductCategoryCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly ICategoryProductRepository _categoryProductRepository;

        public UpdateProductCategoryCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UpdateProductCategoryCommandHandler> logger,
            IdGeneratorService idGenerator, ICategoryProductRepository categoryProductRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
            _categoryProductRepository = categoryProductRepository;
        }

        public async Task<Result<CreateProductResponse>> Handle(UpdateProductCategoryCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var categoryProduct = await _categoryProductRepository.GetCategoryByIdAsync(command.CategoryId, cancellationToken);
                if (categoryProduct == null)
                {
                    return Result<CreateProductResponse>.Failure<CreateProductResponse>(new Error("ProductCategory.NotFound", "Product category not found"));
                }

                categoryProduct.CateProdName = command.CategoryName;
                _categoryProductRepository.Update(categoryProduct);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateProductResponse>.Success(new CreateProductResponse
                {
                    CategoryId = categoryProduct.CateProdId,
                    CategoryName = categoryProduct.CateProdName,
                    CategoryStatus = categoryProduct.CateProdStatus
                });
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product category");
                return Result<CreateProductResponse>.Failure<CreateProductResponse>(new Error("ProductCategory.CreateError", e.Message));
            }
           
        }

    }
}
