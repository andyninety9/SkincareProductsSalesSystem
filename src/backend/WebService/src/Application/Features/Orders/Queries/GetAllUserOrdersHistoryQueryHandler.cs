using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Abstractions.Messaging;
using Application.Common.Paginations;
using Application.Common.ResponseModel;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Orders.Queries
{
    public sealed record GetAllUserOrdersHistoryQuery(
        long UserId,
        PaginationParams PaginationParams,
        string? FromDate,
        string? ToDate) : IQuery<PagedResult<GetAllOrdersResponse>>;

    internal sealed class GetAllUserOrdersHistoryQueryHandler : IQueryHandler<GetAllUserOrdersHistoryQuery, PagedResult<GetAllOrdersResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<GetAllUserOrdersHistoryQueryHandler> _logger;

        public GetAllUserOrdersHistoryQueryHandler(
            IOrderRepository orderRepository,
            IMapper mapper,
            ILogger<GetAllUserOrdersHistoryQueryHandler> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _orderRepository = orderRepository;
        }

        public async Task<Result<PagedResult<GetAllOrdersResponse>>> Handle(GetAllUserOrdersHistoryQuery request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Fetching orders with filters: UserId={UserId}, FromDate={FromDate}, ToDate={ToDate}",
                    request.UserId, request.FromDate, request.ToDate);

                // Chuyển đổi ngày tháng từ chuỗi (nếu có)
                DateTime? fromDate = string.IsNullOrWhiteSpace(request.FromDate) ? null : DateTime.Parse(request.FromDate);
                DateTime? toDate = string.IsNullOrWhiteSpace(request.ToDate) ? null : DateTime.Parse(request.ToDate);

                var (orders, totalCount) = await _orderRepository.GetAllUserOrdersHistoryByQueryAsync(
                    request.UserId,
                    fromDate,
                    toDate,
                    request.PaginationParams.Page,
                    request.PaginationParams.PageSize,
                    cancellationToken);

                var mappedOrders = _mapper.Map<IEnumerable<GetAllOrdersResponse>>(orders);

                return Result<PagedResult<GetAllOrdersResponse>>.Success(new PagedResult<GetAllOrdersResponse>
                {
                    Items = mappedOrders.ToList(),
                    TotalItems = totalCount,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching orders with filters: UserId={UserId}, FromDate={FromDate}, ToDate={ToDate}",
                    request.UserId, request.FromDate, request.ToDate);

                return Result<PagedResult<GetAllOrdersResponse>>.Failure<PagedResult<GetAllOrdersResponse>>(new Error("OrderFetchError", ex.Message));
            }
           
        }
    }
}
