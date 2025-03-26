using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetDailySalesQuery(string? FromDate, string? ToDate) : IQuery<GetDailySalesResponse>;
    internal sealed class GetDailySalesQueryHandler : IQueryHandler<GetDailySalesQuery, GetDailySalesResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;


        public GetDailySalesQueryHandler(IMapper mapper, IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetDailySalesResponse>> Handle(GetDailySalesQuery request, CancellationToken cancellationToken)
        {
            DateTime? fromDate = null;
            DateTime? toDate = null;

            // Parse fromDate
            if (!string.IsNullOrEmpty(request.FromDate))
            {
                if (!DateTime.TryParseExact(request.FromDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedFromDate))
                {
                    return Result<GetDailySalesResponse>.Failure<GetDailySalesResponse>(new Error("GetDailySalesResponse", "Invalid fromDate format. Please use yyyy-MM-dd."));
                }
                fromDate = parsedFromDate;
            }

            // Parse toDate
            if (!string.IsNullOrEmpty(request.ToDate))
            {
                if (!DateTime.TryParseExact(request.ToDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedToDate))
                {
                    return Result<GetDailySalesResponse>.Failure<GetDailySalesResponse>(new Error("GetDailySalesResponse", "Invalid toDate format. Please use yyyy-MM-dd."));
                }
                toDate = parsedToDate;
            }

            var result = await _orderRepository.GetDailySalesAsync(fromDate, toDate, cancellationToken);

            
            
            return Result<GetDailySalesResponse>.Success(new GetDailySalesResponse
            {
                DailySales = _mapper.Map<IEnumerable<GetDailySaleDto>>(result)
            });
        }


    }
}