using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetSpendingUserQuery(string FromDate, string ToDate) : IQuery<GetTopSpendingUserResponse>;
    internal sealed class GetTopSpendingUserQueryHandler : IQueryHandler<GetSpendingUserQuery, GetTopSpendingUserResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public GetTopSpendingUserQueryHandler(IMapper mapper, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetTopSpendingUserResponse>> Handle(GetSpendingUserQuery request, CancellationToken cancellationToken)
        {
            try
            {
               var fromDate = DateTime.Parse(request.FromDate);
                var toDate = DateTime.Parse(request.ToDate);

                var topSpendingUsers = await _userRepository.GetTopSpendingUsersAsync(fromDate, toDate, cancellationToken);
                GetTopSpendingUserResponse response = new GetTopSpendingUserResponse();
                response.TopSpendingUsers = topSpendingUsers;

                return Result<GetTopSpendingUserResponse>.Success(response);
                
            }
            catch (Exception e)
            {
                return Result<GetTopSpendingUserResponse>.Failure<GetTopSpendingUserResponse>(new Error("GetTopSpendingUserResponse", e.Message));
            }

        }
    }
}