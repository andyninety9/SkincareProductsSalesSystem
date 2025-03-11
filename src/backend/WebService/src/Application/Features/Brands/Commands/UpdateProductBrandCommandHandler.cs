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
    public sealed record UpdateProductBrandCommand
    (
        long BrandId,
        string? BrandName,
        string? BrandDesc,
        string? BrandOrigin,
        string? BrandStatus
    ) : ICommand<CreateProductBrandResponse>;

    internal sealed class UpdateProductBrandCommandHandler : ICommandHandler<UpdateProductBrandCommand, CreateProductBrandResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UpdateProductBrandCommandHandler> _logger;
        private readonly IBrandRepository _brandRepository;

        public UpdateProductBrandCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<UpdateProductBrandCommandHandler> logger,
            IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<Result<CreateProductBrandResponse>> Handle(UpdateProductBrandCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var brand = await _brandRepository.GetByIdAsync(command.BrandId, cancellationToken);
                if (brand == null)
                {
                    return Result<CreateProductBrandResponse>.Failure<CreateProductBrandResponse>(new Error("UpdateBrand.NotFound", "Brand not found"));
                }

                brand.BrandName = command.BrandName ?? brand.BrandName;
                brand.BrandDesc = command.BrandDesc ?? brand.BrandDesc;
                brand.BrandOrigin = command.BrandOrigin ?? brand.BrandOrigin;
                brand.BrandStatus = !string.IsNullOrEmpty(command.BrandStatus) ? bool.Parse(command.BrandStatus) : brand.BrandStatus;

                _brandRepository.Update(brand);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                var response = _mapper.Map<CreateProductBrandResponse>(brand);
                return Result<CreateProductBrandResponse>.Success(response);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product category");
                return Result<CreateProductBrandResponse>.Failure<CreateProductBrandResponse>(new Error("UpdateBrand.Update", e.Message));
            }
           
        }

    }
}
