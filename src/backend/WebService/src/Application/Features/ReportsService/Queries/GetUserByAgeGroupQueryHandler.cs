using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.Repositories;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetUserByAgeGroupQuery() : IQuery<GetUserByAgeGroupResponse>;
    internal sealed class GetUserByAgeGroupQueryHandler : IQueryHandler<GetUserByAgeGroupQuery, GetUserByAgeGroupResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public GetUserByAgeGroupQueryHandler(IMapper mapper, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetUserByAgeGroupResponse>> Handle(GetUserByAgeGroupQuery request, CancellationToken cancellationToken)
        {
            try
            {
                GetUserByAgeGroupResponse getUserByAgeGroupResponse = new GetUserByAgeGroupResponse();
                getUserByAgeGroupResponse.UserByAgeGroup = await _userRepository.GetUserByAgeGroupAsync(cancellationToken);
                return Result<GetUserByAgeGroupResponse>.Success(getUserByAgeGroupResponse);
                
            }
            catch (Exception e)
            {
                return Result<GetUserByAgeGroupResponse>.Failure<GetUserByAgeGroupResponse>(new Error("GetUserByAgeGroupResponse", e.Message));
            }

        }
    }
}