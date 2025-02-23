using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.ResponseModel;
using AutoMapper;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Address.Commands
{
    public sealed record ActiveAddressCommand(long AddressId) : ICommand;

    internal sealed class ActiveAddressCommandHandler : ICommandHandler<ActiveAddressCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<ActiveAddressCommandHandler> _logger;
        private readonly IAddressRepository _addressRepository;

        public ActiveAddressCommandHandler(
            IAddressRepository addressRepository,
            IUnitOfWork unitOfWork,
            ILogger<ActiveAddressCommandHandler> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _addressRepository = addressRepository;
        }

        public async Task<Result> Handle(ActiveAddressCommand command, CancellationToken cancellationToken)
        {
            // await _addressRepository.SwitchStatusDefaultAddress(command.AddressId);
            await _addressRepository.ActiveByIdAsync(command.AddressId);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}