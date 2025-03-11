using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Features.Brands.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Brands.Commands
{
    public sealed record CreateProductBrandCommand
    (
        string BrandName,
        string BrandDesc,
        string BrandOrigin,
        int BrandStatus
    ) : ICommand<CreateProductBrandResponse>;

    internal sealed class CreateProductBrandCommandHandler : ICommandHandler<CreateProductBrandCommand, CreateProductBrandResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateProductBrandCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IBrandRepository _brandRepository;

        public CreateProductBrandCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateProductBrandCommandHandler> logger,
            IdGeneratorService idGenerator, IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
        }

        public async Task<Result<CreateProductBrandResponse>> Handle(CreateProductBrandCommand command, CancellationToken cancellationToken)
        {
            try
            {
                bool brandStatus = command.BrandStatus == 1 ? true : false;
                Domain.Entities.Brand newBrand = new()
                {
                    BrandId = _idGenerator.GenerateLongId(),
                    BrandName = command.BrandName,
                    BrandDesc = command.BrandDesc,
                    BrandOrigin = command.BrandOrigin,
                    BrandStatus = brandStatus
                };

                await _brandRepository.AddAsync(newBrand, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateProductBrandResponse>.Success(new CreateProductBrandResponse
                {
                    BrandId = newBrand.BrandId,
                    BrandName = newBrand.BrandName,
                    BrandDesc = newBrand.BrandDesc,
                    BrandOrigin = newBrand.BrandOrigin,
                    BrandStatus = newBrand.BrandStatus
                });
                
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error occurred while creating product brand");
                return Result<CreateProductBrandResponse>.Failure<CreateProductBrandResponse>(new Error("ProductBrand.CreateError", e.Message));
            }

            
           
        }

    }
}
