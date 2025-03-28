using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetUserRetentionRateQuery() : IQuery<GetUserRetentionRateDto>;
    internal sealed class GetUserRetentionQueryHandler : IQueryHandler<GetUserRetentionRateQuery, GetUserRetentionRateDto>
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public GetUserRetentionQueryHandler(IMapper mapper, IUserRepository userRepository)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetUserRetentionRateDto>> Handle(GetUserRetentionRateQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var userRetentionRate = await _userRepository.GetUserRetentionAsync(cancellationToken);
                GetUserRetentionRateDto response = new GetUserRetentionRateDto();
                response = userRetentionRate;

                return Result<GetUserRetentionRateDto>.Success(response);

            }
            catch (Exception e)
            {
                return Result<GetUserRetentionRateDto>.Failure<GetUserRetentionRateDto>(new Error("GetUserRetentionRateDto", e.Message));
            }
            
           

        }


    }
}