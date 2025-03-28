using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetUserOverviewQuery(string? FromDate, string? ToDate) : IQuery<GetUserSummaryResponse>;
    internal sealed class GetUserSummaryQueryHandler : IQueryHandler<GetUserOverviewQuery, GetUserSummaryResponse>
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public GetUserSummaryQueryHandler(IMapper mapper, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetUserSummaryResponse>> Handle(GetUserOverviewQuery request, CancellationToken cancellationToken)
        {
            DateTime? fromDate = null;
            DateTime? toDate = null;

            // Parse fromDate
            if (!string.IsNullOrEmpty(request.FromDate))
            {
                if (!DateTime.TryParseExact(request.FromDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedFromDate))
                {
                    return Result<GetUserSummaryResponse>.Failure<GetUserSummaryResponse>(new Error("GetUserSummaryResponse", "Invalid fromDate format. Please use yyyy-MM-dd."));
                }
                fromDate = parsedFromDate;
            }

            // Parse toDate
            if (!string.IsNullOrEmpty(request.ToDate))
            {
                if (!DateTime.TryParseExact(request.ToDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedToDate))
                {
                    return Result<GetUserSummaryResponse>.Failure<GetUserSummaryResponse>(new Error("GetUserSummaryResponse", "Invalid toDate format. Please use yyyy-MM-dd."));
                }
                toDate = parsedToDate;
            }
            if (fromDate == null || toDate == null)
            {
                return Result<GetUserSummaryResponse>.Failure<GetUserSummaryResponse>(new Error("GetUserSummaryResponse", "Please provide both fromDate and toDate."));
            }
            GetUserSummaryResponse getUserSummaryResponse = new GetUserSummaryResponse();
            var totalUser = await _userRepository.GetTotalUserAsync(fromDate.Value, toDate.Value, cancellationToken);
            var newUserCount = await _userRepository.GetNewUserCountAsync(fromDate.Value, toDate.Value, cancellationToken);
            var activeUserCount = await _userRepository.GetActiveUserCountAsync(fromDate.Value, toDate.Value, cancellationToken);
            var userGrowthRate = await _userRepository.GetUserGrowthRateAsync(fromDate.Value, toDate.Value, cancellationToken);

            getUserSummaryResponse.TotalUser = totalUser.TotalUser;
            getUserSummaryResponse.NewUsers = newUserCount.NewUserCount;
            getUserSummaryResponse.ActiveUsers = activeUserCount.ActiveUserCount;
            getUserSummaryResponse.UserGrowthRate = userGrowthRate.UserGrowthRate;

            return Result<GetUserSummaryResponse>.Success(getUserSummaryResponse);

        }


    }
}