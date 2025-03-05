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
    public sealed record CreateProductCategoryCommand
    (
        string CategoryName
    ) : ICommand<CreateProductResponse>;

    internal sealed class CreateProductCategoryCommandHandler : ICommandHandler<CreateProductCategoryCommand, CreateProductResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateProductCategoryCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly ICategoryProductRepository _categoryProductRepository;

        public CreateProductCategoryCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateProductCategoryCommandHandler> logger,
            IdGeneratorService idGenerator, ICategoryProductRepository categoryProductRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
            _categoryProductRepository = categoryProductRepository;
        }

        public async Task<Result<CreateProductResponse>> Handle(CreateProductCategoryCommand command, CancellationToken cancellationToken)
        {
            try
            {
                CategoryProduct newCategoryProduct = new()
                {
                    CateProdId = _idGenerator.GenerateShortId(),
                    CateProdName = command.CategoryName,
                    CateProdStatus = true
                };

                await _categoryProductRepository.AddAsync(newCategoryProduct, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateProductResponse>.Success(new CreateProductResponse
                {
                    CategoryId = newCategoryProduct.CateProdId,
                    CategoryName = newCategoryProduct.CateProdName,
                    CategoryStatus = newCategoryProduct.CateProdStatus
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
