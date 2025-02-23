using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.ResponseModel;
using Application.Constant;
using Application.Features.Address.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Address.Commands
{
    public sealed record CreateAddressCommand(long UsrId, string AddDetail, string Ward, string District, string City) : ICommand<CreateAddressResponse>;

    internal sealed class CreateAddressCommandHandler : ICommandHandler<CreateAddressCommand, CreateAddressResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CreateAddressCommandHandler> _logger;
        private readonly IAddressRepository _addressRepository;

        public CreateAddressCommandHandler(
            IAddressRepository addressRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CreateAddressCommandHandler> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _addressRepository = addressRepository;
        }

        public async Task<Result<CreateAddressResponse>> Handle(CreateAddressCommand command, CancellationToken cancellationToken)
        {
            try
            {
                var address = new Domain.Entities.Address
                {
                    UsrId = command.UsrId,
                    AddDetail = command.AddDetail,
                    Ward = command.Ward,
                    District = command.District,
                    City = command.City,
                    Country = "Việt Nam",
                    IsDefault = false,
                    Status = true
                };

                // await _addressRepository.SwitchStatusDefaultAddress(command.UsrId);
                await _addressRepository.AddAsync(address, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);

                return Result<CreateAddressResponse>.Success(new CreateAddressResponse
                {
                    UsrId = command.UsrId,
                    AddressId = address.AddressId,
                    AddDetail = address.AddDetail,
                    Ward = address.Ward,
                    District = address.District,
                    City = address.City,
                    Country = address.Country
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating address");
                return Result<CreateAddressResponse>.Failure<CreateAddressResponse>(new Error("CreateAddressError", IConstantMessage.CREATE_ADDRESS_FAILED));

            }
        }
    }
}