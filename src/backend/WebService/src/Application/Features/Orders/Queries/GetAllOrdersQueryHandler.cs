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
    public sealed record GetAllOrdersQuery(
        string? Status,
        string? Keyword,
        long? CustomerId,
        long? EventId,
        string? FromDate,
        string? ToDate,
        PaginationParams PaginationParams) : IQuery<PagedResult<GetAllOrdersResponse>>;

    internal sealed class GetAllOrdersQueryHandler : IQueryHandler<GetAllOrdersQuery, PagedResult<GetAllOrdersResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<GetAllOrdersQueryHandler> _logger;

        public GetAllOrdersQueryHandler(
            IOrderRepository orderRepository,
            IMapper mapper,
            ILogger<GetAllOrdersQueryHandler> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _orderRepository = orderRepository;
        }

        public async Task<Result<PagedResult<GetAllOrdersResponse>>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Fetching orders with filters: Status={Status}, CustomerId={CustomerId}, EventId={EventId}, FromDate={FromDate}, ToDate={ToDate}",
                    request.Status, request.CustomerId, request.EventId, request.FromDate, request.ToDate);

                // Chuyển đổi ngày tháng từ chuỗi (nếu có)
                DateTime? fromDate = string.IsNullOrWhiteSpace(request.FromDate) ? null : DateTime.Parse(request.FromDate);
                DateTime? toDate = string.IsNullOrWhiteSpace(request.ToDate) ? null : DateTime.Parse(request.ToDate);

                var (orders, totalCount) = await _orderRepository.GetAllOrdersByQueryAsync(
                    request.Status,
                    request.Keyword,
                    request.CustomerId,
                    request.EventId,
                    fromDate,
                    toDate,
                    request.PaginationParams.Page,
                    request.PaginationParams.PageSize,
                    cancellationToken);

                var mappedOrders = _mapper.Map<IEnumerable<GetAllOrdersResponse>>(orders);

                var pagedResult = new PagedResult<GetAllOrdersResponse>
                {
                    Items = mappedOrders.ToList(),
                    TotalItems = totalCount,
                    Page = request.PaginationParams.Page,
                    PageSize = request.PaginationParams.PageSize
                };

                return Result<PagedResult<GetAllOrdersResponse>>.Success(pagedResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching orders.");
                return Result<PagedResult<GetAllOrdersResponse>>.Failure<PagedResult<GetAllOrdersResponse>>(new Error("OrderError", "An error occurred while fetching orders."));
            }
        }
    }
}
