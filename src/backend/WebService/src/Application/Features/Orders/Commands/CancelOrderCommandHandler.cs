using Application.Abstractions.Messaging;
using Application.Abstractions.UnitOfWork;
using Application.Common;
using Application.Common.Enum;
using Application.Common.ResponseModel;
using Application.Features.Orders.Commands.Response;
using Application.Features.ProductCategory.Commands.Response;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Features.Orders.Commands
{
    public sealed record CancelOrderCommand
    (
        long ?UserId,
        long ?OrderId,
        string? Note
    ) : ICommand<CancelOrderResponse>;

    internal sealed class CancelOrderCommandHandler : ICommandHandler<CancelOrderCommand, CancelOrderResponse>
    {

        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CancelOrderCommandHandler> _logger;
        private readonly IdGeneratorService _idGenerator;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderLogRepository _orderLogRepository;

        public CancelOrderCommandHandler(
            IMapper mapper,
            IUnitOfWork unitOfWork,
            ILogger<CancelOrderCommandHandler> logger,
            IdGeneratorService idGenerator, IOrderRepository orderRepository, IOrderLogRepository orderLogRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _idGenerator = idGenerator;
            _orderRepository = orderRepository;
            _orderLogRepository = orderLogRepository;
        }

        public async Task<Result<CancelOrderResponse>> Handle(CancelOrderCommand command, CancellationToken cancellationToken)
        {
            try
            {
                if (command.OrderId == null)
                {
                    return Result<CancelOrderResponse>.Failure<CancelOrderResponse>(new Error("InvalidInput", "OrderId cannot be null"));
                }
                var order = await _orderRepository.GetByIdAsync(command.OrderId.Value, cancellationToken);
                if (order == null)
                {
                    return Result<CancelOrderResponse>.Failure<CancelOrderResponse>(new Error("NotFound", "Order not found"));
                }

                if(order.UsrId != command.UserId)
                {
                    return Result<CancelOrderResponse>.Failure<CancelOrderResponse>(new Error("Unauthorized", "You are not authorized to cancel this order"));
                }

                if ((OrderStatusEnum)order.OrdStatusId > OrderStatusEnum.Pending)
                {
                    return Result<CancelOrderResponse>.Failure<CancelOrderResponse>(new Error("InvalidStatus", "Your order have been processed, you can't cancel it"));
                }

                order.OrdStatusId = (short)OrderStatusEnum.Cancelled;
                order.UpdatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

                OrderLog newOrderLog = new()
                {
                    OrdLogId = _idGenerator.GenerateLongId(),
                    OrdId = order.OrdId,
                    NewStatusOrdId = order.OrdStatusId,
                    Note = command.Note,
                    CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
                };

                await _orderLogRepository.AddAsync(newOrderLog, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                
                return Result<CancelOrderResponse>.Success<CancelOrderResponse>(new CancelOrderResponse
                {
                    OrdId = order.OrdId,
                    UsrId = order.UsrId,
                    EventId = order.EventId,
                    OrdDate = order.OrdDate,
                    OrdStatusId = order.OrdStatusId,
                    TotalOrdPrice = order.TotalOrdPrice,
                    CreatedAt = order.CreatedAt,
                    UpdatedAt = order.UpdatedAt,
                    IsPaid = order.IsPaid
                });
            }
            catch (Exception ex)
            {
                return Result<CancelOrderResponse>.Failure<CancelOrderResponse>(new Error("Error", ex.Message));
            }
        }
        

    }
}
