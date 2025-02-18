using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common.ResponseModel;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Address.Commands
{
    public sealed record DeleteAddressCommand(long AddressId) : ICommand;

    internal sealed class DeleteAddressCommandHandler : ICommandHandler<DeleteAddressCommand>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteAddressCommandHandler> _logger;
        private readonly IAddressRepository _addressRepository;

        public DeleteAddressCommandHandler(
            IAddressRepository addressRepository,
            IUnitOfWork unitOfWork,
            ILogger<DeleteAddressCommandHandler> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _addressRepository = addressRepository;
        }

        public async Task<Result> Handle(DeleteAddressCommand command, CancellationToken cancellationToken)
        {
            var address = await _addressRepository.GetByIdAsync(command.AddressId, cancellationToken);
            if (address == null)
            {
                return Result.Failure(new Error("DeleteAddressCommand", "Address not found."));
            }

            bool newStatus = false;
            await _addressRepository.ChangeStatusAddressAsync(command.AddressId, newStatus,cancellationToken);
            
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result.Success();
        }
    }
}