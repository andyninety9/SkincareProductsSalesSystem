using Application.Abstractions.Messaging;
using Application.Abstractions.Redis;
using Application.Abstractions.UnitOfWork;
using Application.Accounts.Response;
using Application.Common.Enum;
using Application.Common.Jwt;
using Application.Common.ResponseModel;
using Application.Constant;
using Application.Features.Address.Commands.Response;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Address.Commands
{
    public sealed record ActiveAddressCommand(long AddressId) : ICommand<CreateAddressResponse>;

    internal sealed class ActiveAddressCommandHandler : ICommandHandler<ActiveAddressCommand, CreateAddressResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ActiveAddressCommandHandler> _logger;
        private readonly IAddressRepository _addressRepository;

        public ActiveAddressCommandHandler(
            IAddressRepository addressRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<ActiveAddressCommandHandler> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _addressRepository = addressRepository;
        }

        public async Task<Result<CreateAddressResponse>> Handle(ActiveAddressCommand command, CancellationToken cancellationToken)
        {
            await _addressRepository.SwitchStatusDefaultAddress(command.AddressId);
            await _addressRepository.ActiveByIdAsync(command.AddressId);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<CreateAddressResponse>.Success(new CreateAddressResponse());
        }
    }
}