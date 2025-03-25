using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using Application.Features.ReportsService.Queries.Response;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ReportsService.Queries
{
    public sealed record GetTopSellingProductQuery(string? FromDate, string? ToDate) : IQuery<GetTopSellingProductResponse>;
    internal sealed class GetTopSellingProductsQueryHandler : IQueryHandler<GetTopSellingProductQuery, GetTopSellingProductResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;


        public GetTopSellingProductsQueryHandler(IMapper mapper, IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;
        }


        public async Task<Result<GetTopSellingProductResponse>> Handle(GetTopSellingProductQuery request, CancellationToken cancellationToken)
        {
            DateTime? fromDate = null;
            DateTime? toDate = null;

            // Parse fromDate
            if (!string.IsNullOrEmpty(request.FromDate))
            {
                if (!DateTime.TryParseExact(request.FromDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedFromDate))
                {
                    return Result<GetTopSellingProductResponse>.Failure<GetTopSellingProductResponse>(new Error("GetTopSellingProductResponse", "Invalid fromDate format. Please use yyyy-MM-dd."));
                }
                fromDate = parsedFromDate;
            }

            // Parse toDate
            if (!string.IsNullOrEmpty(request.ToDate))
            {
                if (!DateTime.TryParseExact(request.ToDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsedToDate))
                {
                    return Result<GetTopSellingProductResponse>.Failure<GetTopSellingProductResponse>(new Error("GetTopSellingProductResponse", "Invalid toDate format. Please use yyyy-MM-dd."));
                }
                toDate = parsedToDate;
            }

            var result = await _orderRepository.GetTopSellingProductsAsync(fromDate, toDate, cancellationToken);

            if (result == null)
            {
                return Result<GetTopSellingProductResponse>.Failure<GetTopSellingProductResponse>(new Error("GetTopSellingProductResponse", "No top selling products found."));
            }




            return Result<GetTopSellingProductResponse>.Success(new GetTopSellingProductResponse
            {
                TopSellingProducts = _mapper.Map<IEnumerable<GetTopSellingProductDto>>(result)
            });
        }


    }


}