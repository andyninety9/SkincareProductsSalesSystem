using Application.Abstractions.Messaging;
using Application.Common.ResponseModel;
using AutoMapper;
using Domain.DTOs;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Orders.Queries
{
    public sealed record GetUserOrderDetailQuery(
        long UserId,
        long OrderId
        ) : IQuery<OrderDetailResponse>;

    internal sealed class GetUserOrderDetailQueryHandler : IQueryHandler<GetUserOrderDetailQuery, OrderDetailResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<GetUserOrderDetailQueryHandler> _logger;

        public GetUserOrderDetailQueryHandler(
            IOrderRepository orderRepository,
            IMapper mapper,
            ILogger<GetUserOrderDetailQueryHandler> logger)
        {
            _mapper = mapper;
            _logger = logger;
            _orderRepository = orderRepository;
        }

        public async Task<Result<OrderDetailResponse>> Handle(GetUserOrderDetailQuery request, CancellationToken cancellationToken)
        {
            try
            {
             

                var order = await _orderRepository.GetOrderByIdAsync(request.OrderId, cancellationToken);

                if (order == null || order.CustomerId != request.UserId)
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
