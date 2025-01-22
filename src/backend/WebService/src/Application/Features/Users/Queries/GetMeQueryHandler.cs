using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.Users.Response;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Users.Queries
{
    public sealed record GetMeQuery(long usrID) : IQuery<GetMeResponse>;
    internal sealed class GetMeQueryHandler : IQueryHandler<GetMeQuery, GetMeResponse>
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public GetMeQueryHandler(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetMeResponse>> Handle(GetMeQuery request, CancellationToken cancellationToken)
        {
            GetMeResponse response = new GetMeResponse();
            var user = await _userRepository.GetUserByAccountId(request.usrID);
            return Result<GetMeResponse>.Success(_mapper.Map(user, response));
        }
    }
}