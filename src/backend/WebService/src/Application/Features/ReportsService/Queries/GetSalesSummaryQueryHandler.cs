using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetSalesSummaryQuery(string? FromDate, string? ToDate) : IQuery<GetSalesSummaryResponse>;
    internal sealed class GetSalesSummaryQueryHandler : IQueryHandler<GetSalesSummaryQuery, GetSalesSummaryResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;


        public GetSalesSummaryQueryHandler(IMapper mapper, IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetSalesSummaryResponse>> Handle(GetSalesSummaryQuery request, CancellationToken cancellationToken)
        {
            DateTime? fromDate = null;
            DateTime? toDate = null;

            // Parse fromDate
            if (!string.IsNullOrEmpty(request.FromDate))
            {
                if (!DateTime.TryParseExact(request.FromDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedFromDate))
                {
                    return Result<GetSalesSummaryResponse>.Failure<GetSalesSummaryResponse>(new Error("GetSalesSummaryResponse", "Invalid fromDate format. Please use yyyy-MM-dd."));
                }
                fromDate = parsedFromDate;
            }

            // Parse toDate
            if (!string.IsNullOrEmpty(request.ToDate))
            {
                if (!DateTime.TryParseExact(request.ToDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedToDate))
                {
                    return Result<GetSalesSummaryResponse>.Failure<GetSalesSummaryResponse>(new Error("GetSalesSummaryResponse", "Invalid toDate format. Please use yyyy-MM-dd."));
                }
                toDate = parsedToDate;
            }

            var result = await _orderRepository.GetSalesSummaryAsync(fromDate, toDate, cancellationToken);

            


            if (result == null)
            {
                return Result<GetSalesSummaryResponse>.Failure<GetSalesSummaryResponse>(new Error("GetSalesSummaryResponse", "No sales summary found."));
            }
            
            return Result<GetSalesSummaryResponse>.Success(_mapper.Map<GetSalesSummaryResponse>(result));
        }


    }
}