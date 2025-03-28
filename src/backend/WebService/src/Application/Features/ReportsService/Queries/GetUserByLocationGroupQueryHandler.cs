using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.Repositories;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetUserByLocationQuery(string FromDate, string ToDate) : IQuery<GetUserByLocationGroupResponse>;
    internal sealed class GetUserByLocationGroupQueryHandler : IQueryHandler<GetUserByLocationQuery, GetUserByLocationGroupResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public GetUserByLocationGroupQueryHandler(IMapper mapper, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetUserByLocationGroupResponse>> Handle(GetUserByLocationQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _userRepository.GetUserByLocationAsync(DateTime.Parse(request.FromDate), DateTime.Parse(request.ToDate), cancellationToken);
                
                GetUserByLocationGroupResponse getUserByLocationGroupResponse = new GetUserByLocationGroupResponse();
                getUserByLocationGroupResponse.UserByLocationGroup = result;
                return Result<GetUserByLocationGroupResponse>.Success<GetUserByLocationGroupResponse>(getUserByLocationGroupResponse);
                
            }
            catch (Exception e)
            {
                return Result<GetUserByLocationGroupResponse>.Failure<GetUserByLocationGroupResponse>(new Error("GetUserByLocationGroupResponse", e.Message));
            }

        }
    }
}