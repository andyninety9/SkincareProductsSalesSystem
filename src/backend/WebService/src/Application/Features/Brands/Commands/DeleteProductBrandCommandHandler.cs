using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Brands.Commands.Response;
using Application.Features.ProductCategory.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Brands.Commands
{
    public sealed record DeleteProductBrandCommand
    (
        long BrandId
    ) : ICommand<CreateProductBrandResponse>;

    internal sealed class DeleteProductBrandCommandHandler : ICommandHandler<DeleteProductBrandCommand, CreateProductBrandResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteProductBrandCommandHandler> _logger;
        private readonly IBrandRepository _brandRepository;
        public DeleteProductBrandCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteProductBrandCommandHandler> logger,
            IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<CreateProductBrandResponse>> Handle(DeleteProductBrandCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var brand = await _brandRepository.GetByIdAsync(command.BrandId, cancellationToken);
                if (brand == null)
                {
                    return Result<CreateProductBrandResponse>.Failure<CreateProductBrandResponse>(new Error("DeleteBrand.NotFound", "Brand not found"));
                }

                brand.IsDeleted = true;
                _brandRepository.Update(brand);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateProductBrandResponse>.Success(_mapper.Map<CreateProductBrandResponse>(brand));
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while deleting product category");
                return Result<CreateProductBrandResponse>.Failure<CreateProductBrandResponse>(new Error("ProductCategory.DeleteError", e.Message));
              
            }
        }
        

    }
}
