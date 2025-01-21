using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Users.Commands
{
    public sealed record CreateUserCommand(
        string Name,
        string Email
    ) : ICommand;
    internal sealed class CreateUserCommandHandler : ICommandHandler<CreateUserCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CreateUserCommandHandler(IUserRepository userRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(CreateUserCommand command, CancellationToken cancellationToken)
        {
            await _userRepository.AddAsync(_mapper.Map<User>(command), cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }
    }
}