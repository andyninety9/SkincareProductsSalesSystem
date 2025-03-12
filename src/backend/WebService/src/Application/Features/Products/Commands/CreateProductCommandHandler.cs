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
    public sealed record CreateProductCommand
    (
        string ProductName,
        string ProductDesc,
        int Stocks,
        double CostPrice,
        double SellPrice,
        string Ingredient,
        string Instruction,
        short ProdStatusId,
        string ProdUseFor,
        short CateId,
        long BrandId
    ) : ICommand<CreateNewProductResponse>;

    internal sealed class CreateProductCommandHandler : ICommandHandler<CreateProductCommand, CreateNewProductResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateProductCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IProductRepository _productRepository;

        public CreateProductCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateProductCommandHandler> logger,
            IdGeneratorService idGenerator, IProductRepository productRepository)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }

        public async Task<Result<CreateNewProductResponse>> Handle(CreateProductCommand command, CancellationToken cancellationToken)
        {
            try
            {
                Product product = new Product
                {
                    ProductId = _idGenerator.GenerateLongId(),
                    ProductName = command.ProductName,
                    ProductDesc = command.ProductDesc,
                    Stocks = command.Stocks,
                    CostPrice = command.CostPrice,
                    SellPrice = command.SellPrice,
                    Ingredient = command.Ingredient,
                    Instruction = command.Instruction,
                    ProdStatusId = command.ProdStatusId,
                    ProdUseFor = command.ProdUseFor,
                    CateId = command.CateId,
                    BrandId = command.BrandId,
                    CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                    UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
                };

                await _productRepository.AddAsync(product, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var response = _mapper.Map<CreateNewProductResponse>(product);

                return Result<CreateNewProductResponse>.Success(response);
                
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating product");
                return Result<CreateNewProductResponse>.Failure<CreateNewProductResponse>(new Error("CreateNewProductResponse", "Error occurred while creating product"));
            }
           
        }

    }
}
