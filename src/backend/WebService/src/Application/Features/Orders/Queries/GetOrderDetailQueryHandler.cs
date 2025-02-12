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

namespace Application.Orders.Queries
{
    public sealed record GetOrderDetailQuery(
        long OrderId
        ) : IQuery<OrderDetailResponse>;

    internal sealed class GetOrderDetailQueryHandler : IQueryHandler<GetOrderDetailQuery, OrderDetailResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<GetOrderDetailQueryHandler> _logger;

        public GetOrderDetailQueryHandler(
            IOrderRepository orderRepository,
            IMapper mapper,
            ILogger<GetOrderDetailQueryHandler> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _orderRepository = orderRepository;
        }

        public async Task<Result<OrderDetailResponse>> Handle(GetOrderDetailQuery request, CancellationToken cancellationToken)
        {
            try
            {
                // _logger.LogInformation("Fetching order with ID: {OrderId}", request.OrderId);

                // if (string.IsNullOrEmpty(request.OrderId))
                // {
                //     _logger.LogWarning("Order ID is null or empty");
                //     return Result<OrderDetailResponse>.Failure<OrderDetailResponse>(new Error("InvalidInput", "Order ID is required."));
                // }

                var order = await _orderRepository.GetOrderByIdAsync(request.OrderId, cancellationToken);

                if (order == null)
                {
                    _logger.LogWarning("Order not found for ID: {OrderId}", request.OrderId);
                    return Result<OrderDetailResponse>.Failure<OrderDetailResponse>(new Error("NotFound", "Order not found."));
                }

                var orderResponse = _mapper.Map<OrderDetailResponse>(order);
                return Result<OrderDetailResponse>.Success(orderResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching order with ID: {OrderId}", request.OrderId);
                return Result<OrderDetailResponse>.Failure<OrderDetailResponse>(new Error("Error", "Error while fetching order."));

            }
        }
    }
}
