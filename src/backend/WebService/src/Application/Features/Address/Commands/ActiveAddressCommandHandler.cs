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
    public sealed record DeleteAddressCommand(long AddressId) : ICommand<CreateAddressResponse>;

    internal sealed class DeleteAddressCommandHandler : ICommandHandler<DeleteAddressCommand, CreateAddressResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<DeleteAddressCommandHandler> _logger;
        private readonly IAddressRepository _addressRepository;

        public DeleteAddressCommandHandler(
            IAddressRepository addressRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<DeleteAddressCommandHandler> logger)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _addressRepository = addressRepository;
        }

        public async Task<Result<CreateAddressResponse>> Handle(DeleteAddressCommand command, CancellationToken cancellationToken)
        {
            await _addressRepository.DeleteByIdAsync(command.AddressId, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Result<CreateAddressResponse>.Success(new CreateAddressResponse());
        }
    }
}