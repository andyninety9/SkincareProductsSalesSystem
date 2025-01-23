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
                Result<GetMeResponse>.Failure<GetMeResponse>(
                   new Error("UpdateMe", IConstantMessage.USER_NOT_FOUND)
               );
            }
            user.Fullname = command.Fullname ?? user.Fullname;
            user.Phone = command.PhoneNumber ?? user.Phone;
            //Gender: 1 -> Male, 2 -> Female, 3 -> Other
            if (command.Gender != null)
            {
                short inputGender = short.TryParse(command.Gender, out inputGender) ? inputGender : (short)0;
                if (inputGender > 0 && inputGender < 4)
                {
                    user.Gender = inputGender;
                }
                else
                {
                    Result<GetMeResponse>.Failure<GetMeResponse>(
                        new Error("UpdateMe", IConstantMessage.INVALID_GENDER_FORMAT));
                }
            }
            if (command.Dob != null && DateOnly.TryParse(command.Dob, out DateOnly date))
            {
                user.Dob = date;
            }
            user.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
            bool isSuccess = await _userRepository.UpdateUserAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            if (isSuccess)
            {
                return Result<GetMeResponse>.Success();
            }
            else
            {
                return Result.Failure(new Error("UpdateMe", IConstantMessage.UPDATE_ME_FALSE));
            }
        }
    }
}