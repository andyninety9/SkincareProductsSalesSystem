using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.ResponseModel;
using Application.Constant;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;

namespace Application.Users.Commands
{
    public sealed record UpdateMeCommand(
        long UsrId,
        string? Fullname,
        string? PhoneNumber,
        string? Gender,
        string? Dob
    ) : ICommand;
    internal sealed class UpdateMeCommandHandler : ICommandHandler<UpdateMeCommand>
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UpdateMeCommandHandler(IUserRepository userRepository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        public async Task<Result> Handle(UpdateMeCommand command, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByIdAsync(command.UsrId, cancellationToken);
            if (user == null)
            {
                return Result.Failure(new Error("UpdateMe", IConstantMessage.USER_NOT_FOUND));
            }

            UpdateUserFields(user, command);

            user.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

            bool isSuccess = await _userRepository.UpdateUserAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return isSuccess
                ? Result.Success()
                : Result.Failure(new Error("UpdateMe", IConstantMessage.UPDATE_ME_FALSE));
        }

        private void UpdateUserFields(User user, UpdateMeCommand command)
        {
            if (!string.IsNullOrEmpty(command.Fullname))
            {
                user.Fullname = command.Fullname;
            }

            if (!string.IsNullOrEmpty(command.PhoneNumber))
            {
                user.Phone = command.PhoneNumber;
            }

            if (!string.IsNullOrEmpty(command.Gender) && short.TryParse(command.Gender, out short inputGender))
            {
                user.Gender = inputGender;
            }

            if (!string.IsNullOrEmpty(command.Dob) && DateOnly.TryParse(command.Dob, out DateOnly date))
            {
                user.Dob = date;
            }
        }
    }
}