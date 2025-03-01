using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.Enum;
using Application.Common.ResponseModel;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using MediatR;

namespace Application.Users.Queries
{
    public sealed record GetMeQuery(long usrID) : IQuery<GetMeResponse>;
    internal sealed class GetMeQueryHandler : IQueryHandler<GetMeQuery, GetMeResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IAccountRepository _accountRepository;
        private readonly IAccountStatusRepository _accountStatusRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IResultQuizRepository _resultQuizRepository;

        public GetMeQueryHandler(IUserRepository userRepository, IMapper mapper, IAccountRepository accountRepository, IAccountStatusRepository accountStatusRepository, IRoleRepository roleRepository, IResultQuizRepository resultQuizRepository)
        {
            _userRepository = userRepository;
            _accountRepository = accountRepository;
            _accountStatusRepository = accountStatusRepository;
            _roleRepository = roleRepository;
            _resultQuizRepository = resultQuizRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetMeResponse>> Handle(GetMeQuery request, CancellationToken cancellationToken)
        {
            // var user = await _userRepository.GetUserByAccountId(request.usrID);
            // var account = await _accountRepository.GetByIdAsync(request.usrID, cancellationToken);
            // var accountStatus = await _accountStatusRepository.GetAccountStatusById(account.AccStatusId);
            // var role = await _roleRepository.GetRoleById(account.RoleId);
            // var resultQuiz = await _resultQuizRepository.GetResultQuizByUserId(request.usrID);

            // GetMeResponse response = _mapper.Map<GetMeResponse>(user);
            // response.AccountStatus = accountStatus.StatusName;
            // response.Role = role.RoleName;
            // response.SkinType = resultQuiz.SkinType.SkinTypeCodes;
            GetMeResponse response = new GetMeResponse();
            var user = await _userRepository.GetByIdAsync(request.usrID, cancellationToken);
            var account = await _accountRepository.GetByIdAsync(request.usrID, cancellationToken);
            if (user == null || account == null)
            {
                return Result<GetMeResponse>.Success(response);
            }
            var accountStatus = await _accountStatusRepository.GetAccountStatusById(account.AccStatusId);
            var role = await _roleRepository.GetRoleById(account.RoleId);
            var resultQuizs = await _resultQuizRepository.GetAllAsync(cancellationToken);
            var resultQuiz = resultQuizs.FirstOrDefault(x => x.UsrId == request.usrID && x.IsDefault == true);
            response = new()
            {
                Fullname = user.Fullname ?? string.Empty,
                Gender = user.Gender != null ? GetGenderNameById(user.Gender) : string.Empty,
                Phone = user.Phone ?? string.Empty,
                Email = user.Email,
                Dob = user.Dob,
                AvatarUrl = user.AvatarUrl,
                CoverUrl = user.CoverUrl,
                AccountStatus = accountStatus.StatusName,
                Role = role.RoleName,
                SkinType = resultQuiz?.SkinType.SkinTypeCodes,
                RewardPoint = user.RewardPoint,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };


            return Result<GetMeResponse>.Success(response);
        }

        private string GetGenderNameById(short? genderId)
        {
            if (genderId == (short)GenderUserEnum.Male)
            {
                return "Male";
            }
            else if (genderId == (short)GenderUserEnum.Female)
            {
                return "Female";
            }
            else
            {
                return "Other";
            }
        }
    }
}